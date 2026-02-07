import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  getCandidates,
  getCandidateById,
  getDashboardStats,
  getFilterOptions,
  updateCandidateStatus,
  toggleShortlist,
  addNote,
  getShortlistedCandidates,
  compareCandidates
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

// Get shortlisted candidates
router.get('/shortlisted', getShortlistedCandidates);

// Compare candidates
router.post('/compare', compareCandidates);

// Get candidate by ID
router.get('/candidates/:id', getCandidateById);

// Update candidate status
router.put('/candidates/:id/status', updateCandidateStatus);

// Toggle shortlist
router.put('/candidates/:id/shortlist', toggleShortlist);

// Add note
router.post('/candidates/:id/notes', addNote);

export default router;
