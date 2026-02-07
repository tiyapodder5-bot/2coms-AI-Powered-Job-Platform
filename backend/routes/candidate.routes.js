import express from 'express';
import { getAllCandidates, getCandidateProfile, getCandidateStatusByEmail } from '../controllers/candidate.controller.js';
import { protect, employerOnly } from '../middleware/auth.js';

const router = express.Router();

// Public route - Check application status by email
router.get('/status/:email', getCandidateStatusByEmail);

// Protected routes (employer/admin only)
router.get('/', protect, employerOnly, getAllCandidates);
router.get('/:id', protect, employerOnly, getCandidateProfile);

export default router;
