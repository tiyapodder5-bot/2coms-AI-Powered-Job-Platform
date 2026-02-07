import express from 'express';
import { 
  fetchFromAdzuna, 
  getAllJobs, 
  getJobById, 
  createJob, 
  getJobStats 
} from '../controllers/job.controller.js';
import { protect, employerOnly } from '../middleware/auth.js';

const router = express.Router();

// Admin route - fetch from Adzuna (must be before /:id route)
router.get('/fetch/adzuna', fetchFromAdzuna);

// Public routes
router.get('/', getAllJobs);
router.get('/stats', getJobStats);
router.get('/:id', getJobById);

// Protected routes (employer only)
router.post('/', protect, employerOnly, createJob);

export default router;
