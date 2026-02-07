import Candidate from '../models/Candidate.model.js';
import Job from '../models/Job.model.js';
import Application from '../models/Application.model.js';
import { generateMatchExplanation } from '../utils/geminiService.js';

/**
 * Calculate match score between candidate and job
 */
const calculateMatchScore = (candidate, job) => {
  let totalScore = 0;
  const scoreBreakdown = {
    skillMatch: 0,
    experienceMatch: 0,
    locationMatch: 0,
    salaryMatch: 0,
    jobTypeMatch: 0
  };

  // 1. Skill Matching (40 points)
  if (job.requiredSkills && job.requiredSkills.length > 0) {
    const candidateSkills = candidate.extractedSkills?.map(s => s.toLowerCase()) || [];
    const jobSkills = job.requiredSkills.map(s => s.toLowerCase());
    
    let matchedSkills = 0;
    jobSkills.forEach(skill => {
      if (candidateSkills.some(cs => cs.includes(skill) || skill.includes(cs))) {
        matchedSkills++;
      }
    });

    scoreBreakdown.skillMatch = jobSkills.length > 0 
      ? Math.round((matchedSkills / jobSkills.length) * 40)
      : 20;
  } else {
    scoreBreakdown.skillMatch = 20; // Default if no skills specified
  }

  // 2. Experience Matching (20 points)
  const candidateExp = candidate.totalExperience || 0;
  const jobMinExp = job.experienceRequired?.min || 0;
  const jobMaxExp = job.experienceRequired?.max || 10;

  if (candidateExp >= jobMinExp && candidateExp <= jobMaxExp) {
    scoreBreakdown.experienceMatch = 20;
  } else if (candidateExp >= jobMinExp - 1) {
    scoreBreakdown.experienceMatch = 15;
  } else if (candidateExp >= jobMinExp - 2) {
    scoreBreakdown.experienceMatch = 10;
  } else {
    scoreBreakdown.experienceMatch = 5;
  }

  // 3. Location Matching (15 points)
  if (job.location && candidate.preferredLocation) {
    const jobLoc = job.location.toLowerCase();
    const prefLocs = candidate.preferredLocation.map(l => l.toLowerCase());
    
    if (prefLocs.includes('remote') || prefLocs.includes('any')) {
      scoreBreakdown.locationMatch = 15;
    } else if (prefLocs.some(loc => jobLoc.includes(loc) || loc.includes(jobLoc))) {
      scoreBreakdown.locationMatch = 15;
    } else if (candidate.willingToRelocate) {
      scoreBreakdown.locationMatch = 10;
    } else {
      scoreBreakdown.locationMatch = 3;
    }
  } else {
    scoreBreakdown.locationMatch = 10;
  }

  // 4. Salary Matching (15 points)
  if (candidate.expectedSalary && job.salaryRange) {
    const candidateSalary = candidate.expectedSalary.min;
    const jobSalaryMin = job.salaryRange.min;
    const jobSalaryMax = job.salaryRange.max;

    if (candidateSalary >= jobSalaryMin && candidateSalary <= jobSalaryMax) {
      scoreBreakdown.salaryMatch = 15;
    } else if (candidateSalary <= jobSalaryMax + 200000) {
      scoreBreakdown.salaryMatch = 10;
    } else {
      scoreBreakdown.salaryMatch = 5;
    }
  } else {
    scoreBreakdown.salaryMatch = 10;
  }

  // 5. Job Type Matching (10 points)
  if (candidate.preferredJobType === job.jobType) {
    scoreBreakdown.jobTypeMatch = 10;
  } else if (candidate.preferredJobType === 'Remote' && job.workMode === 'Remote') {
    scoreBreakdown.jobTypeMatch = 10;
  } else {
    scoreBreakdown.jobTypeMatch = 5;
  }

  // Calculate total
  totalScore = Object.values(scoreBreakdown).reduce((sum, score) => sum + score, 0);

  return { totalScore, scoreBreakdown };
};

/**
 * Get matched jobs for candidate
 * GET /api/matching/candidate/:candidateId
 */
export const getMatchedJobs = async (req, res) => {
  try {
    const { candidateId } = req.params;
    
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    if (!candidate.chatbotCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Please complete chatbot questions first'
      });
    }

    // Get all active jobs
    const jobs = await Job.find({ status: 'Active' });

    // Calculate match scores
    const matchedJobs = [];

    for (const job of jobs) {
      // Skip if category mismatch (unless job is 'Other' or candidate willing to switch)
      if (job.category !== candidate.category && 
          job.category !== 'Other' && 
          candidate.category !== 'Other') {
        continue;
      }

      const { totalScore, scoreBreakdown } = calculateMatchScore(candidate, job);

      // Only include jobs with reasonable match (40%+)
      if (totalScore >= 40) {
        // Check if application already exists
        const existingApp = await Application.findOne({
          candidate: candidateId,
          job: job._id
        });

        // Generate AI match explanation for high-scoring matches
        let aiExplanation = '';
        if (totalScore >= 60) {
          const explanationResult = await generateMatchExplanation(candidate, job);
          if (explanationResult.success) {
            aiExplanation = explanationResult.explanation;
          }
        }

        if (!existingApp) {
          // Create application
          const application = await Application.create({
            job: job._id,
            candidate: candidateId,
            matchScore: totalScore,
            scoreBreakdown: scoreBreakdown,
            autoSelected: totalScore >= 70,
            status: totalScore >= 80 ? 'Shortlisted' : 
                    totalScore >= 70 ? 'Recommended' : 
                    totalScore >= 60 ? 'Suggested' : 'Applied',
            notes: aiExplanation
          });

          matchedJobs.push({
            job,
            matchScore: totalScore,
            scoreBreakdown: scoreBreakdown,
            applicationId: application._id,
            status: application.status,
            aiExplanation: aiExplanation
          });
        } else {
          matchedJobs.push({
            job,
            matchScore: existingApp.matchScore,
            scoreBreakdown: existingApp.scoreBreakdown,
            applicationId: existingApp._id,
            status: existingApp.status,
            aiExplanation: existingApp.notes || aiExplanation
          });
        }
      }
    }

    // Sort by match score
    matchedJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      message: `Found ${matchedJobs.length} matching jobs for you!`,
      data: {
        candidate: {
          name: candidate.name,
          category: candidate.category,
          skills: candidate.extractedSkills
        },
        totalMatches: matchedJobs.length,
        matchedJobs: matchedJobs.slice(0, 50) // Return top 50
      }
    });

  } catch (error) {
    console.error('❌ Match error:', error);
    res.status(500).json({
      success: false,
      message: 'Error matching jobs',
      error: error.message
    });
  }
};

/**
 * Get auto-selected candidates for a job (for employers)
 * GET /api/matching/job/:jobId/candidates
 */
export const getAutoSelectedCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const applications = await Application.find({
      job: jobId,
      autoSelected: true
    })
      .populate('candidate')
      .sort({ matchScore: -1 });

    res.status(200).json({
      success: true,
      data: {
        job: {
          title: job.title,
          company: job.company
        },
        totalCandidates: applications.length,
        candidates: applications
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
 * Update application status
 * PATCH /api/matching/application/:applicationId
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, employerNotes } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.status = status;
    application.employerViewed = true;
    if (employerNotes) application.employerNotes = employerNotes;

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating application',
      error: error.message
    });
  }
};

/**
 * Apply for a specific job
 * POST /api/matching/apply
 */
export const applyForJob = async (req, res) => {
  try {
    const { candidateId, jobId } = req.body;

    // Validate inputs
    if (!candidateId || !jobId) {
      return res.status(400).json({
        success: false,
        message: 'Candidate ID and Job ID are required'
      });
    }

    // Get candidate
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Get job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      candidate: candidateId,
      job: jobId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
        data: existingApplication
      });
    }

    // Calculate match score for this specific job
    const { totalScore, scoreBreakdown } = calculateMatchScore(candidate, job);

    // Create application
    const application = new Application({
      job: jobId,
      candidate: candidateId,
      matchScore: totalScore,
      scoreBreakdown,
      status: 'Applied',
      autoSelected: false
    });

    await application.save();

    // Update candidate's ATS score if this is better
    if (!candidate.atsScore || totalScore > candidate.atsScore) {
      candidate.atsScore = totalScore;
      await candidate.save();
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Our recruiter will review your profile and contact you soon.',
      data: {
        application,
        matchScore: totalScore,
        scoreBreakdown,
        statusCheckInfo: 'You can check your application status anytime at /check-status using your email address'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message
    });
  }
};

export default {
  getMatchedJobs,
  getAutoSelectedCandidates,
  updateApplicationStatus,
  applyForJob
};
