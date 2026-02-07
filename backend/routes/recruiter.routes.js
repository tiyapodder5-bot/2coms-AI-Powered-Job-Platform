import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  getCandidates,
  getCandidateById,
  getDashboardStats,
  getFilterOptions
} from '../controllers/recruiter.controller.js';

const router = express.Router();

// All routes require authentication and employer/admin role
router.use(protect);
router.use(restrictTo('employer', 'admin'));

// Get all candidates with filters
router.get('/candidates', getCandidates);

// Get dashboard statistics
router.get('/stats', getDashboardStats);

// Get filter options
router.get('/filters', getFilterOptions);

// Get candidate by ID
router.get('/candidates/:id', getCandidateById);

export default router;
