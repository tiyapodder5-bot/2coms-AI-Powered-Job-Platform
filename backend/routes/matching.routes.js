import express from 'express';
import { 
  getMatchedJobs, 
  getAutoSelectedCandidates, 
  updateApplicationStatus,
  applyForJob
} from '../controllers/matching.controller.js';
import { protect, employerOnly } from '../middleware/auth.js';

const router = express.Router();

// Get matched jobs for candidate
router.get('/candidate/:candidateId', getMatchedJobs);

// Apply for a job (public - no auth required)
router.post('/apply', applyForJob);

// Get auto-selected candidates for job (employer only)
router.get('/job/:jobId/candidates', protect, employerOnly, getAutoSelectedCandidates);

// Update application status (employer only)
router.patch('/application/:applicationId', protect, employerOnly, updateApplicationStatus);

export default router;
