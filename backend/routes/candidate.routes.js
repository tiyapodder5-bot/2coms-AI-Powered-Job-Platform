import express from 'express';
import { getAllCandidates, getCandidateProfile } from '../controllers/candidate.controller.js';
import { protect, employerOnly } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (employer/admin only)
router.get('/', protect, employerOnly, getAllCandidates);
router.get('/:id', protect, employerOnly, getCandidateProfile);

export default router;
