import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  
  // Matching Score (0-100)
  matchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  
  // Score Breakdown
  scoreBreakdown: {
    skillMatch: Number,
    experienceMatch: Number,
    locationMatch: Number,
    salaryMatch: Number,
    jobTypeMatch: Number
  },
  
  // Auto Selected by System
  autoSelected: {
    type: Boolean,
    default: false
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Recommended', 'Suggested', 'Rejected', 'Interviewed', 'Offered'],
    default: 'Applied'
  },
  
  // AI-generated match explanation
  notes: {
    type: String
  },
  
  // Employer Actions
  employerViewed: {
    type: Boolean,
    default: false
  },
  employerNotes: {
    type: String
  },
  
  // Applied Date
  appliedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for faster queries
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ matchScore: -1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ autoSelected: 1 });

export default mongoose.model('Application', applicationSchema);
