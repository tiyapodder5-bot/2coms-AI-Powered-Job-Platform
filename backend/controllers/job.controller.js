import Job from '../models/Job.model.js';
import Application from '../models/Application.model.js';
import axios from 'axios';
import { analyzeJobDescription } from '../utils/geminiService.js';

/**
 * Fetch jobs from Adzuna API
 * GET /api/jobs/fetch-adzuna
 */
export const fetchFromAdzuna = async (req, res) => {
  try {
    const appId = process.env.ADZUNA_APP_ID;
    const apiKey = process.env.ADZUNA_API_KEY;

    if (!appId || !apiKey || appId === 'your_adzuna_app_id') {
      return res.status(400).json({
        success: false,
        message: 'Adzuna API credentials not configured. Please add ADZUNA_APP_ID and ADZUNA_API_KEY in .env file'
      });
    }

    const categories = [
      { name: 'Technical', query: 'software developer' },
      { name: 'Technical', query: 'web developer' },
      { name: 'Sales', query: 'sales executive' },
      { name: 'Marketing', query: 'digital marketing' },
      { name: 'Finance', query: 'accountant' },
      { name: 'HR', query: 'hr manager' },
      { name: 'Design', query: 'ui ux designer' }
    ];

    let totalJobsFetched = 0;
    const fetchedJobs = [];

    for (const category of categories) {
      try {
        const response = await axios.get(
          `https://api.adzuna.com/v1/api/jobs/in/search/1`,
          {
            params: {
              app_id: appId,
              app_key: apiKey,
              results_per_page: 15,
              what: category.query,
              'content-type': 'application/json'
            }
          }
        );

        const jobs = response.data.results || [];
        
        for (const jobData of jobs) {
          // Check if job already exists
          const existingJob = await Job.findOne({
            title: jobData.title,
            company: jobData.company.display_name
          });

          if (!existingJob) {
            // Use Gemini AI to analyze job description for better skill extraction
            let aiSkills = [];
            let aiCategory = category.name;
            
            if (jobData.description) {
              const aiAnalysis = await analyzeJobDescription(jobData.description);
              if (aiAnalysis.success && aiAnalysis.data) {
                aiSkills = aiAnalysis.data.requiredSkills || [];
                aiCategory = aiAnalysis.data.category || category.name;
              }
            }
            
            // Fallback to rule-based extraction if AI fails
            const extractedSkills = aiSkills.length > 0 
              ? aiSkills 
              : extractSkillsFromDescription(jobData.description);
            
            const newJob = await Job.create({
              title: jobData.title,
              company: jobData.company.display_name || 'Company',
              location: jobData.location.display_name || 'India',
              category: aiCategory,
              description: jobData.description || 'No description available',
              requiredSkills: extractedSkills,
              experienceRequired: {
                min: 0,
                max: 5
              },
              salaryRange: jobData.salary_min && jobData.salary_max ? {
                min: jobData.salary_min,
                max: jobData.salary_max,
                currency: 'INR'
              } : {
                min: 300000,
                max: 800000,
                currency: 'INR'
              },
              jobType: 'Full-time',
              workMode: 'Office',
              source: 'Adzuna',
              externalUrl: jobData.redirect_url,
              postedDate: jobData.created || new Date(),
              status: 'Active'
            });

            fetchedJobs.push(newJob);
            totalJobsFetched++;
          }
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error fetching ${category.name} jobs:`, error.message);
      }
    }

    res.status(200).json({
      success: true,
      message: `Successfully fetched ${totalJobsFetched} jobs from Adzuna`,
      data: {
        totalJobs: totalJobsFetched,
        jobs: fetchedJobs
      }
    });

  } catch (error) {
    console.error('❌ Adzuna fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs from Adzuna',
      error: error.message
    });
  }
};

/**
 * Get all jobs with filters
 * GET /api/jobs
 */
export const getAllJobs = async (req, res) => {
  try {
    const { category, location, jobType, page = 1, limit = 20 } = req.query;

    const filter = { status: 'Active' };
    
    if (category) filter.category = category;
    if (location && location !== 'Any') filter.location = new RegExp(location, 'i');
    if (jobType) filter.jobType = jobType;

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        jobs,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

/**
 * Get single job
 * GET /api/jobs/:id
 */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
};

/**
 * Create manual job (for employers)
 * POST /api/jobs
 */
export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      source: 'Manual',
      employer: req.user?._id,
      status: 'Active'
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
};

/**
 * Get job stats
 * GET /api/jobs/stats
 */
export const getJobStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({ status: 'Active' });
    
    const jobsByCategory = await Job.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        jobsByCategory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
};

/**
 * Helper: Extract skills from job description
 */
const extractSkillsFromDescription = (description) => {
  if (!description) return [];

  const skillKeywords = [
    'JavaScript', 'Python', 'Java', 'React', 'Node', 'Angular', 'Vue',
    'MongoDB', 'SQL', 'AWS', 'Docker', 'Git', 'Salesforce', 'Excel',
    'Marketing', 'SEO', 'SEM', 'CRM', 'Communication', 'Leadership'
  ];

  const foundSkills = [];
  const descLower = description.toLowerCase();

  skillKeywords.forEach(skill => {
    if (descLower.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  return foundSkills.slice(0, 10);
};

export default {
  fetchFromAdzuna,
  getAllJobs,
  getJobById,
  createJob,
  getJobStats
};
