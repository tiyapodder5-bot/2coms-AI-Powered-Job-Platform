import Candidate from '../models/Candidate.model.js';
import Application from '../models/Application.model.js';

/**
 * Get all candidates (for employers/admin)
 * GET /api/candidates
 */
export const getAllCandidates = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category) filter.category = category;

    const candidates = await Candidate.find(filter)
      .select('-resumeText')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Candidate.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        candidates,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching candidates',
      error: error.message
    });
  }
};

/**
 * Get candidate profile with applications
 * GET /api/candidates/:id
 */
export const getCandidateProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).select('-resumeText');

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    const applications = await Application.find({ candidate: req.params.id })
      .populate('job', 'title company location jobType')
      .sort({ matchScore: -1 });

    res.status(200).json({
      success: true,
      data: {
        candidate,
        applications
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching candidate profile',
      error: error.message
    });
  }
};

export default {
  getAllCandidates,
  getCandidateProfile
};
