import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import { testGeminiConnection } from './utils/geminiService.js';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';
import jobRoutes from './routes/job.routes.js';
import candidateRoutes from './routes/candidate.routes.js';
import matchingRoutes from './routes/matching.routes.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// CORS Configuration for Production
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded files
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/matching', matchingRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    mongodb: 'Connected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test Gemini API connection
app.get('/api/test-gemini', async (req, res) => {
  try {
    const result = await testGeminiConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      status: 'Gemini API connection failed ❌'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
});
