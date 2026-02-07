import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  // Basic Information (from resume)
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  
  // Resume Information
  resumePath: {
    type: String,
    required: true
  },
  resumeText: {
    type: String
  },
  
  // Extracted 30 Keywords from Resume
  keywords: [{
    type: String
  }],
  
  // Detected Category (Technical/Sales/Marketing/Finance/Healthcare etc.)
  category: {
    type: String,
    enum: ['Technical', 'Sales', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Design', 'HR', 'Operations', 'Other'],
    default: 'Other'
  },
  
  // Extracted Skills
  extractedSkills: [{
    type: String
  }],
  
  // Experience
  totalExperience: {
    type: Number, // in years
    default: 0
  },
  experienceDetails: {
    type: String
  },
  
  // Education
  education: {
    type: String
  },
  
  // Professional Summary (AI-generated)
  summary: {
    type: String
  },
  
  // Preferences (from chatbot)
  currentLocation: {
    type: String
  },
  preferredLocation: [{
    type: String
  }],
  expectedSalary: {
    min: Number,
    max: Number
  },
  preferredJobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid']
  },
  noticePeriod: {
    type: String,
    enum: ['Immediate', '15 days', '1 month', '2 months', '3 months']
  },
  workMode: {
    type: String,
    enum: ['Office', 'Hybrid', 'Remote']
  },
  preferredIndustry: [{
    type: String
  }],
  willingToRelocate: {
    type: Boolean,
    default: false
  },
  
  // Chatbot Conversation
  chatbotCompleted: {
    type: Boolean,
    default: false
  },
  
  // Recruitment Status
  applicationStatus: {
    type: String,
    enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'],
    default: 'Applied'
  },
  
  // Status History
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  
  // Shortlist & Favorite
  shortlisted: {
    type: Boolean,
    default: false
  },
  shortlistedAt: Date,
  shortlistedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Rejection
  rejectionReason: String,
  rejectedAt: Date,
  
  // Recruiter Notes
  notes: [{
    text: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Assigned Recruiter
  assignedRecruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Index for faster searches
candidateSchema.index({ email: 1 });
candidateSchema.index({ category: 1 });
candidateSchema.index({ extractedSkills: 1 });

export default mongoose.model('Candidate', candidateSchema);
