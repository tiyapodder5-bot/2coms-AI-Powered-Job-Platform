import express from 'express';
import { 
  fetchFromAdzuna, 
  getAllJobs, 
  getJobById, 
  createJob, 
  getJobStats,
  getMyJobs,
  updateJob,
  deleteJob
} from '../controllers/job.controller.js';
import { protect, employerOnly } from '../middleware/auth.js';

const router = express.Router();

// Admin route - fetch from Adzuna (must be before /:id route)
router.get('/fetch/adzuna', fetchFromAdzuna);

// Public routes
router.get('/', getAllJobs);
router.get('/stats', getJobStats);

// Protected routes (employer only)
router.post('/', protect, employerOnly, createJob);
router.get('/my-jobs', protect, employerOnly, getMyJobs);
router.put('/:id', protect, employerOnly, updateJob);
router.delete('/:id', protect, employerOnly, deleteJob);

// Must be last (dynamic route)
router.get('/:id', getJobById);

export default router;
