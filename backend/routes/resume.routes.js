import express from 'express';
import upload from '../middleware/upload.js';
import { uploadResume, getCandidateDetails } from '../controllers/resume.controller.js';

const router = express.Router();

// Upload resume
router.post('/upload', upload.single('resume'), uploadResume);

// Get candidate details
router.get('/candidate/:id', getCandidateDetails);

export default router;
