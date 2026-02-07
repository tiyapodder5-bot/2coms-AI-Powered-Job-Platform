import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Parse resume using Gemini AI
 * Extracts structured information from resume text
 */
export const parseResumeWithAI = async (resumeText) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an expert ATS (Applicant Tracking System) resume parser. Analyze the following resume text and extract structured information.

Resume Text:
${resumeText}

Extract and return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just raw JSON):
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "experience": number of years (as integer, e.g., 3),
  "education": "Highest degree or qualification",
  "skills": ["skill1", "skill2", "skill3", ...] (extract up to 20 relevant technical and professional skills),
  "category": "one of: Technical, Sales, Marketing, Finance, Healthcare, Education, Design, HR, Operations, or Other",
  "summary": "Brief 2-3 sentence professional summary",
  "keywords": ["keyword1", "keyword2", ...] (extract 30 most relevant keywords for job matching)
}

Rules:
- Return ONLY valid JSON, no additional text or markdown
- If information is not found, use appropriate defaults: "" for strings, 0 for numbers, [] for arrays
- Category must be one of the specified options
- Skills and keywords should be relevant technical or professional terms
- Experience should be a number (years)
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response - remove markdown code blocks if present
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\n?/g, '');
    }
    
    // Parse JSON
    const parsedData = JSON.parse(cleanText);
    
    return {
      success: true,
      data: parsedData
    };

  } catch (error) {
    console.error('❌ Gemini AI parsing error:', error.message);
    return {
      success: false,
      error: error.message,
      fallback: true
    };
  }
};

/**
 * Enhance chatbot response using Gemini AI
 * Provides intelligent, context-aware responses
 */
export const enhanceChatbotResponse = async (userMessage, context) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are a helpful job portal chatbot assistant. A candidate is asking a question during their job application process.

Context:
- Candidate Category: ${context.category || 'Not specified'}
- Current Step: ${context.currentStep || 'Initial'}

User Question: ${userMessage}

Provide a helpful, professional, and friendly response in 2-3 sentences. If the question is about job search, provide relevant advice. Keep the tone conversational and supportive.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      success: true,
      response: text.trim()
    };

  } catch (error) {
    console.error('❌ Gemini chatbot enhancement error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate job matching score explanation using AI
 * Explains why a job is a good match for a candidate
 */
export const generateMatchExplanation = async (candidate, job) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Analyze why this job is a good match for the candidate and provide a brief explanation.

Candidate Profile:
- Skills: ${candidate.skills?.join(', ') || 'Not specified'}
- Experience: ${candidate.experience || 0} years
- Category: ${candidate.category || 'Not specified'}
- Education: ${candidate.education || 'Not specified'}

Job Description:
- Title: ${job.title}
- Company: ${job.company}
- Description: ${job.description?.substring(0, 500) || 'Not available'}

Provide a 2-3 sentence explanation of why this job is a good match for the candidate. Focus on skill alignment, experience fit, and growth opportunities.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      success: true,
      explanation: text.trim()
    };

  } catch (error) {
    console.error('❌ Gemini match explanation error:', error.message);
    return {
      success: false,
      explanation: 'This job matches your profile based on skills and experience.'
    };
  }
};

/**
 * Analyze job description and extract requirements
 */
export const analyzeJobDescription = async (jobDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Analyze this job description and extract key information.

Job Description:
${jobDescription}

Extract and return ONLY a valid JSON object (no markdown, no code blocks):
{
  "requiredSkills": ["skill1", "skill2", ...] (up to 15 key skills),
  "experienceLevel": "Entry Level/Mid Level/Senior Level/Executive",
  "category": "one of: Technical, Sales, Marketing, Finance, Healthcare, Education, Design, HR, Operations, or Other",
  "keywords": ["keyword1", "keyword2", ...] (up to 20 relevant keywords)
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Clean markdown code blocks
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }
    
    const analyzed = JSON.parse(text);
    
    return {
      success: true,
      data: analyzed
    };

  } catch (error) {
    console.error('❌ Gemini job analysis error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Test Gemini API connection
 */
export const testGeminiConnection = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say "Hello, Gemini API is working!" in one sentence.');
    const response = await result.response;
    const text = response.text();
    
    return {
      success: true,
      message: text,
      status: 'Gemini API connected successfully ✅'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: 'Gemini API connection failed ❌'
    };
  }
};
