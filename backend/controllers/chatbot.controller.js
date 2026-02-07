import Candidate from '../models/Candidate.model.js';
import Conversation from '../models/Conversation.model.js';
import { getQuestionsByCategory, getWelcomeMessage } from '../utils/chatbotQuestions.js';
import { enhanceChatbotResponse } from '../utils/geminiService.js';

/**
 * Start chatbot conversation
 * POST /api/chatbot/start
 */
export const startChatbot = async (req, res) => {
  try {
    const { candidateId } = req.body;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Get or create conversation
    let conversation = await Conversation.findOne({ candidate: candidateId });
    
    if (!conversation) {
      conversation = await Conversation.create({
        candidate: candidateId,
        questionCategory: candidate.category,
        messages: [],
        currentStep: 0,
        completed: false
      });
    }

    // Get welcome message
    const welcomeMsg = getWelcomeMessage(candidate.name, candidate.category);
    
    // Get questions for this category
    const questions = getQuestionsByCategory(candidate.category);
    const firstQuestion = questions[0];

    // Add messages to conversation
    conversation.messages.push({
      sender: 'bot',
      message: welcomeMsg,
      timestamp: new Date()
    });

    conversation.messages.push({
      sender: 'bot',
      message: firstQuestion.question,
      options: firstQuestion.options.map(opt => opt.label),
      timestamp: new Date()
    });

    await conversation.save();

    res.status(200).json({
      success: true,
      data: {
        conversationId: conversation._id,
        category: candidate.category,
        welcomeMessage: welcomeMsg,
        currentQuestion: {
          id: firstQuestion.id,
          question: firstQuestion.question,
          options: firstQuestion.options,
          step: 1,
          totalSteps: questions.length
        }
      }
    });

  } catch (error) {
    console.error('❌ Start chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting chatbot',
      error: error.message
    });
  }
};

/**
 * Send answer and get next question
 * POST /api/chatbot/answer
 */
export const sendAnswer = async (req, res) => {
  try {
    const { candidateId, conversationId, answer, questionId } = req.body;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Get all questions for this category
    const questions = getQuestionsByCategory(candidate.category);
    const currentQuestion = questions[conversation.currentStep];

    // Save user answer
    conversation.messages.push({
      sender: 'user',
      message: answer,
      selectedOption: answer,
      timestamp: new Date()
    });

    // Update candidate data based on answer
    await updateCandidateData(candidate, currentQuestion, answer);

    // Move to next question
    conversation.currentStep += 1;

    if (conversation.currentStep >= questions.length) {
      // All questions completed
      conversation.completed = true;
      candidate.chatbotCompleted = true;
      await candidate.save();
      await conversation.save();

      return res.status(200).json({
        success: true,
        completed: true,
        message: 'Thank you! I have received all your information. I am now searching for the best matching jobs for you... 🎯',
        data: {
          candidateId: candidate._id
        }
      });
    }

    // Get next question
    const nextQuestion = questions[conversation.currentStep];
    conversation.messages.push({
      sender: 'bot',
      message: nextQuestion.question,
      options: nextQuestion.options.map(opt => opt.label),
      timestamp: new Date()
    });

    await conversation.save();

    res.status(200).json({
      success: true,
      completed: false,
      data: {
        conversationId: conversation._id,
        currentQuestion: {
          id: nextQuestion.id,
          question: nextQuestion.question,
          options: nextQuestion.options,
          step: conversation.currentStep + 1,
          totalSteps: questions.length
        }
      }
    });

  } catch (error) {
    console.error('❌ Send answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing answer',
      error: error.message
    });
  }
};

/**
 * Get conversation history
 * GET /api/chatbot/conversation/:conversationId
 */
export const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId)
      .populate('candidate', 'name email category');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
      error: error.message
    });
  }
};

/**
 * Helper function to update candidate data based on answer
 */
const updateCandidateData = async (candidate, question, answer) => {
  const field = question.field;

  switch (field) {
    case 'preferredJobType':
      candidate.preferredJobType = answer;
      break;

    case 'expectedSalary':
      const salaryRange = answer.split('-');
      if (salaryRange.length === 2) {
        candidate.expectedSalary = {
          min: parseInt(salaryRange[0]) * 100000,
          max: parseInt(salaryRange[1]) * 100000
        };
      } else if (answer.includes('+')) {
        const minSalary = parseInt(answer.replace('+', ''));
        candidate.expectedSalary = {
          min: minSalary * 100000,
          max: minSalary * 100000 * 2
        };
      }
      break;

    case 'preferredLocation':
      if (question.multiple) {
        if (!candidate.preferredLocation) {
          candidate.preferredLocation = [];
        }
        candidate.preferredLocation.push(answer);
      } else {
        candidate.preferredLocation = [answer];
      }
      break;

    case 'noticePeriod':
      candidate.noticePeriod = answer;
      break;

    case 'workMode':
      candidate.workMode = answer;
      break;

    case 'willingToRelocate':
      candidate.willingToRelocate = (answer === 'yes' || answer === 'metro');
      break;

    case 'preferredIndustry':
      if (question.multiple) {
        if (!candidate.preferredIndustry) {
          candidate.preferredIndustry = [];
        }
        candidate.preferredIndustry.push(answer);
      } else {
        candidate.preferredIndustry = [answer];
      }
      break;

    default:
      break;
  }

  await candidate.save();
};
