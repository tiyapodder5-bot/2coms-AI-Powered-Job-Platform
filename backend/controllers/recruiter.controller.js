import Candidate from '../models/Candidate.model.js';
import Conversation from '../models/Conversation.model.js';
import Job from '../models/Job.model.js';
import { sendStatusUpdateEmail, sendShortlistEmail } from '../utils/emailService.js';

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

/**
 * Update candidate application status
 * PUT /api/recruiter/candidates/:id/status
 */
export const updateCandidateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const recruiterId = req.user._id;
    const recruiterName = req.user.name;

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Add to status history
    candidate.statusHistory.push({
      status: status,
      changedBy: recruiterId,
      changedAt: new Date(),
      note: note || ''
    });

    // Update current status
    candidate.applicationStatus = status;

    // If rejected, save rejection date
    if (status === 'Rejected' && note) {
      candidate.rejectionReason = note;
      candidate.rejectedAt = new Date();
    }

    await candidate.save();

    // Send email notification (async, don't wait)
    if (process.env.EMAIL_NOTIFICATIONS_ENABLED === 'true') {
      sendStatusUpdateEmail(candidate.email, candidate.name, status, recruiterName)
        .catch(err => console.error('Email send failed:', err.message));
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: candidate
    });

  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message
    });
  }
};

/**
 * Toggle shortlist candidate
 * PUT /api/recruiter/candidates/:id/shortlist
 */
export const toggleShortlist = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user._id;
    const recruiterName = req.user.name;

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Toggle shortlist
    const wasShortlisted = candidate.shortlisted;
    candidate.shortlisted = !candidate.shortlisted;
    
    if (candidate.shortlisted) {
      candidate.shortlistedAt = new Date();
      candidate.shortlistedBy = recruiterId;
      
      // Send shortlist email notification (async, don't wait)
      if (process.env.EMAIL_NOTIFICATIONS_ENABLED === 'true') {
        sendShortlistEmail(candidate.email, candidate.name, recruiterName)
          .catch(err => console.error('Email send failed:', err.message));
      }
    } else {
      candidate.shortlistedAt = undefined;
      candidate.shortlistedBy = undefined;
    }

    await candidate.save();

    res.status(200).json({
      success: true,
      message: candidate.shortlisted ? 'Added to shortlist' : 'Removed from shortlist',
      data: {
        shortlisted: candidate.shortlisted
      }
    });

  } catch (error) {
    console.error('Error toggling shortlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling shortlist',
      error: error.message
    });
  }
};

/**
 * Add note to candidate
 * POST /api/recruiter/candidates/:id/notes
 */
export const addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const recruiterId = req.user._id;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Note text is required'
      });
    }

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    candidate.notes.push({
      text: text.trim(),
      addedBy: recruiterId,
      addedAt: new Date()
    });

    await candidate.save();

    // Populate the added note
    const populatedCandidate = await Candidate.findById(id)
      .populate('notes.addedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Note added successfully',
      data: {
        notes: populatedCandidate.notes
      }
    });

  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding note',
      error: error.message
    });
  }
};

/**
 * Get shortlisted candidates
 * GET /api/recruiter/shortlisted
 */
export const getShortlistedCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({
      shortlisted: true,
      status: 'Active'
    })
    .select('-resumeText -__v')
    .populate('shortlistedBy', 'name email')
    .sort('-shortlistedAt')
    .lean();

    // Calculate ATS scores
    const candidatesWithScores = candidates.map(candidate => ({
      ...candidate,
      atsScore: calculateATSScore(candidate)
    }));

    res.status(200).json({
      success: true,
      data: candidatesWithScores,
      count: candidatesWithScores.length
    });

  } catch (error) {
    console.error('Error fetching shortlisted candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shortlisted candidates',
      error: error.message
    });
  }
};

/**
 * Compare multiple candidates
 * POST /api/recruiter/compare
 */
export const compareCandidates = async (req, res) => {
  try {
    const { candidateIds } = req.body;

    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 2 candidate IDs to compare'
      });
    }

    if (candidateIds.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'You can compare maximum 5 candidates at a time'
      });
    }

    const candidates = await Candidate.find({
      _id: { $in: candidateIds }
    }).lean();

    if (candidates.length !== candidateIds.length) {
      return res.status(404).json({
        success: false,
        message: 'Some candidates not found'
      });
    }

    // Calculate ATS scores and prepare comparison data
    const comparison = candidates.map(candidate => {
      const atsScore = calculateATSScore(candidate);
      
      return {
        _id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        category: candidate.category,
        atsScore: atsScore,
        totalExperience: candidate.totalExperience || 0,
        skills: candidate.extractedSkills || [],
        skillsCount: (candidate.extractedSkills || []).length,
        education: candidate.education,
        currentLocation: candidate.currentLocation,
        expectedSalary: candidate.expectedSalary,
        noticePeriod: candidate.noticePeriod,
        applicationStatus: candidate.applicationStatus,
        shortlisted: candidate.shortlisted || false,
        chatbotCompleted: candidate.chatbotCompleted
      };
    });

    // Sort by ATS score
    comparison.sort((a, b) => b.atsScore - a.atsScore);

    // Find best match
    const bestMatch = comparison[0];

    res.status(200).json({
      success: true,
      data: {
        candidates: comparison,
        bestMatch: bestMatch,
        comparisonSummary: {
          highestScore: comparison[0].atsScore,
          lowestScore: comparison[comparison.length - 1].atsScore,
          averageExperience: Math.round(
            comparison.reduce((sum, c) => sum + c.totalExperience, 0) / comparison.length
          )
        }
      }
    });

  } catch (error) {
    console.error('Error comparing candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Error comparing candidates',
      error: error.message
    });
  }
};
