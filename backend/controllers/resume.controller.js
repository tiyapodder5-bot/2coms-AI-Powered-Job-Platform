import Candidate from '../models/Candidate.model.js';
import Conversation from '../models/Conversation.model.js';
import {
  extractTextFromFile,
  extractKeywords,
  detectCategory,
  extractEmail,
  extractPhone,
  extractSkills,
  extractExperience,
  extractEducation,
  extractName
} from '../utils/resumeParser.js';
import { parseResumeWithAI } from '../utils/geminiService.js';

/**
 * Upload and parse resume
 * POST /api/resume/upload
 */
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please upload a resume file' 
      });
    }

    const filePath = req.file.path;
    
    // Extract text from PDF/DOCX
    console.log('📄 Extracting text from resume...');
    const resumeText = await extractTextFromFile(filePath);
    
    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from resume. Please ensure the file contains readable text.'
      });
    }

    // Try to parse with Gemini AI first
    console.log('🤖 Parsing resume with Gemini AI...');
    const aiResult = await parseResumeWithAI(resumeText);
    
    let name, email, phone, keywords, category, skills, experience, education, summary;
    
    if (aiResult.success && aiResult.data) {
      // Use AI-extracted data
      console.log('✅ Using Gemini AI parsed data');
      const aiData = aiResult.data;
      name = aiData.name || 'Not found';
      email = aiData.email || null;
      phone = aiData.phone || null;
      keywords = aiData.keywords || [];
      category = aiData.category || 'Other';
      skills = aiData.skills || [];
      experience = aiData.experience || 0;
      education = aiData.education || 'Not specified';
      summary = aiData.summary || '';
    } else {
      // Fallback to rule-based extraction
      console.log('⚠️ Gemini AI failed, using fallback parser...');
      keywords = extractKeywords(resumeText);
      category = detectCategory(keywords, resumeText);
      name = extractName(resumeText);
      email = extractEmail(resumeText);
      phone = extractPhone(resumeText);
      skills = extractSkills(resumeText, keywords);
      experience = extractExperience(resumeText);
      education = extractEducation(resumeText);
      summary = '';
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Could not find email in resume. Please ensure your email is clearly mentioned.'
      });
    }

    // Check if candidate already exists
    let candidate = await Candidate.findOne({ email });

    if (candidate) {
      // Update existing candidate
      candidate.resumePath = filePath;
      candidate.resumeText = resumeText;
      candidate.keywords = keywords;
      candidate.category = category;
      candidate.name = name !== 'Not found' ? name : candidate.name;
      candidate.phone = phone || candidate.phone;
      candidate.extractedSkills = skills;
      candidate.totalExperience = experience;
      candidate.education = education;
      candidate.chatbotCompleted = false; // Reset chatbot
      await candidate.save();
    } else {
      // Create new candidate
      candidate = await Candidate.create({
        name: name !== 'Not found' ? name : 'Candidate',
        email,
        phone: phone || '',
        resumePath: filePath,
        resumeText,
        keywords,
        category,
        extractedSkills: skills,
        totalExperience: experience,
        education,
        summary: summary || ''
      });
    }

    // Initialize or reset conversation
    await Conversation.findOneAndDelete({ candidate: candidate._id });
    await Conversation.create({
      candidate: candidate._id,
      questionCategory: category,
      messages: [],
      currentStep: 0,
      completed: false
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and parsed successfully!',
      data: {
        candidateId: candidate._id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        category: candidate.category,
        keywords: candidate.keywords,
        skills: candidate.extractedSkills,
        experience: candidate.totalExperience,
        education: candidate.education
      }
    });

  } catch (error) {
    console.error('❌ Resume upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing resume',
      error: error.message
    });
  }
};

/**
 * Get candidate details
 * GET /api/resume/candidate/:id
 */
export const getCandidateDetails = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching candidate details',
      error: error.message
    });
  }
};
