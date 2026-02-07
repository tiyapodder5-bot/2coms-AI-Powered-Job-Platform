import Candidate from '../models/Candidate.model.js';
import Conversation from '../models/Conversation.model.js';
import Job from '../models/Job.model.js';

/**
 * Calculate ATS Score for a candidate
 * Score is based on:
 * - Resume completeness (30%)
 * - Skills match (25%)
 * - Experience (20%)
 * - Chatbot completion (15%)
 * - Profile completeness (10%)
 */
const calculateATSScore = (candidate) => {
  let score = 0;
  
  // Resume completeness (30 points)
  if (candidate.resumeText && candidate.resumeText.length > 100) score += 10;
  if (candidate.keywords && candidate.keywords.length >= 10) score += 10;
  if (candidate.summary && candidate.summary.length > 50) score += 10;
  
  // Skills (25 points)
  const skillsCount = candidate.extractedSkills?.length || 0;
  if (skillsCount >= 10) score += 25;
  else if (skillsCount >= 5) score += 15;
  else if (skillsCount >= 3) score += 10;
  
  // Experience (20 points)
  const experience = candidate.totalExperience || 0;
  if (experience >= 5) score += 20;
  else if (experience >= 3) score += 15;
  else if (experience >= 1) score += 10;
  else if (experience > 0) score += 5;
  
  // Chatbot completion (15 points)
  if (candidate.chatbotCompleted) score += 15;
  else if (candidate.currentLocation || candidate.preferredLocation?.length) score += 8;
  
  // Profile completeness (10 points)
  let profileFields = 0;
  if (candidate.email) profileFields++;
  if (candidate.phone) profileFields++;
  if (candidate.currentLocation) profileFields++;
  if (candidate.education) profileFields++;
  if (candidate.category && candidate.category !== 'Other') profileFields++;
  
  score += (profileFields / 5) * 10;
  
  return Math.min(100, Math.round(score));
};

/**
 * Get all candidates with ATS scores
 * GET /api/recruiter/candidates
 */
export const getCandidates = async (req, res) => {
  try {
    const {
      category,
      minScore,
      maxScore,
      minExperience,
      maxExperience,
      skills,
      location,
      jobType,
      workMode,
      search,
      sortBy = 'atsScore',
      order = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    // Build filter query
    let filterQuery = { status: 'Active' };

    // Category filter
    if (category && category !== 'All') {
      filterQuery.category = category;
    }

    // Experience filter
    if (minExperience || maxExperience) {
      filterQuery.totalExperience = {};
      if (minExperience) filterQuery.totalExperience.$gte = Number(minExperience);
      if (maxExperience) filterQuery.totalExperience.$lte = Number(maxExperience);
    }

    // Skills filter (match any skill)
    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim());
      filterQuery.extractedSkills = { $in: skillArray.map(s => new RegExp(s, 'i')) };
    }

    // Location filter
    if (location) {
      filterQuery.$or = [
        { currentLocation: new RegExp(location, 'i') },
        { preferredLocation: { $in: [new RegExp(location, 'i')] } }
      ];
    }

    // Job type filter
    if (jobType) {
      filterQuery.preferredJobType = jobType;
    }

    // Work mode filter
    if (workMode) {
      filterQuery.workMode = workMode;
    }

    // Search filter (name, email, or keywords)
    if (search) {
      filterQuery.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { keywords: { $in: [new RegExp(search, 'i')] } },
        { extractedSkills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Fetch candidates
    const candidates = await Candidate.find(filterQuery)
      .select('-resumeText -__v')
      .lean();

    // Calculate ATS scores
    let candidatesWithScores = candidates.map(candidate => ({
      ...candidate,
      atsScore: calculateATSScore(candidate)
    }));

    // Filter by ATS score
    if (minScore) {
      candidatesWithScores = candidatesWithScores.filter(c => c.atsScore >= Number(minScore));
    }
    if (maxScore) {
      candidatesWithScores = candidatesWithScores.filter(c => c.atsScore <= Number(maxScore));
    }

    // Sort candidates
    candidatesWithScores.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'atsScore':
          aValue = a.atsScore;
          bValue = b.atsScore;
          break;
        case 'experience':
          aValue = a.totalExperience || 0;
          bValue = b.totalExperience || 0;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          return order === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.atsScore;
          bValue = b.atsScore;
      }
      
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    });

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedCandidates = candidatesWithScores.slice(startIndex, endIndex);

    // Statistics
    const stats = {
      total: candidatesWithScores.length,
      averageScore: candidatesWithScores.length > 0
        ? Math.round(candidatesWithScores.reduce((sum, c) => sum + c.atsScore, 0) / candidatesWithScores.length)
        : 0,
      topScore: candidatesWithScores.length > 0 ? candidatesWithScores[0].atsScore : 0,
      page: Number(page),
      totalPages: Math.ceil(candidatesWithScores.length / Number(limit))
    };

    res.status(200).json({
      success: true,
      data: paginatedCandidates,
      stats
    });

  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching candidates',
      error: error.message
    });
  }
};

/**
 * Get candidate details by ID
 * GET /api/recruiter/candidates/:id
 */
export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id).lean();
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Get conversation history
    const conversation = await Conversation.findOne({ candidate: id })
      .select('messages completed')
      .lean();

    // Calculate ATS score
    const atsScore = calculateATSScore(candidate);

    res.status(200).json({
      success: true,
      data: {
        ...candidate,
        atsScore,
        conversation: conversation || null
      }
    });

  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching candidate details',
      error: error.message
    });
  }
};

/**
 * Get dashboard statistics
 * GET /api/recruiter/stats
 */
export const getDashboardStats = async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments({ status: 'Active' });
    const candidates = await Candidate.find({ status: 'Active' }).lean();
    
    // Calculate scores
    const candidatesWithScores = candidates.map(c => ({
      ...c,
      atsScore: calculateATSScore(c)
    }));

    // Category breakdown
    const categoryBreakdown = {};
    candidates.forEach(c => {
      categoryBreakdown[c.category] = (categoryBreakdown[c.category] || 0) + 1;
    });

    // Experience breakdown
    const experienceBreakdown = {
      '0-1': 0,
      '1-3': 0,
      '3-5': 0,
      '5+': 0
    };
    candidates.forEach(c => {
      const exp = c.totalExperience || 0;
      if (exp < 1) experienceBreakdown['0-1']++;
      else if (exp < 3) experienceBreakdown['1-3']++;
      else if (exp < 5) experienceBreakdown['3-5']++;
      else experienceBreakdown['5+']++;
    });

    // Score distribution
    const scoreDistribution = {
      '0-25': 0,
      '26-50': 0,
      '51-75': 0,
      '76-100': 0
    };
    candidatesWithScores.forEach(c => {
      if (c.atsScore <= 25) scoreDistribution['0-25']++;
      else if (c.atsScore <= 50) scoreDistribution['26-50']++;
      else if (c.atsScore <= 75) scoreDistribution['51-75']++;
      else scoreDistribution['76-100']++;
    });

    // Average score
    const averageScore = candidatesWithScores.length > 0
      ? Math.round(candidatesWithScores.reduce((sum, c) => sum + c.atsScore, 0) / candidatesWithScores.length)
      : 0;

    // Top candidates
    const topCandidates = candidatesWithScores
      .sort((a, b) => b.atsScore - a.atsScore)
      .slice(0, 5)
      .map(c => ({
        _id: c._id,
        name: c.name,
        email: c.email,
        category: c.category,
        atsScore: c.atsScore,
        totalExperience: c.totalExperience
      }));

    res.status(200).json({
      success: true,
      data: {
        totalCandidates,
        averageScore,
        categoryBreakdown,
        experienceBreakdown,
        scoreDistribution,
        topCandidates
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

/**
 * Get filter options
 * GET /api/recruiter/filters
 */
export const getFilterOptions = async (req, res) => {
  try {
    const candidates = await Candidate.find({ status: 'Active' }).lean();

    // Extract unique values
    const categories = [...new Set(candidates.map(c => c.category))].filter(Boolean);
    const locations = [...new Set(
      candidates.flatMap(c => [c.currentLocation, ...(c.preferredLocation || [])])
    )].filter(Boolean);
    const skills = [...new Set(candidates.flatMap(c => c.extractedSkills || []))].filter(Boolean);
    const jobTypes = [...new Set(candidates.map(c => c.preferredJobType))].filter(Boolean);
    const workModes = [...new Set(candidates.map(c => c.workMode))].filter(Boolean);

    res.status(200).json({
      success: true,
      data: {
        categories: categories.sort(),
        locations: locations.sort(),
        skills: skills.sort(),
        jobTypes: jobTypes.sort(),
        workModes: workModes.sort()
      }
    });

  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
};
