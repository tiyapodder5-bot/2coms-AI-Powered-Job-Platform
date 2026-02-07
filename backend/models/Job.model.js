import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  // Basic Job Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  
  // Job Category
  category: {
    type: String,
    enum: ['Technical', 'Sales', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Design', 'HR', 'Operations', 'Other'],
    required: true
  },
  
  // Job Details
  description: {
    type: String,
    required: true
  },
  responsibilities: {
    type: String
  },
  
  // Requirements
  requiredSkills: [{
    type: String
  }],
  experienceRequired: {
    min: Number,
    max: Number
  },
  educationRequired: {
    type: String
  },
  
  // Salary
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  
  // Job Type
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
    required: true
  },
  
  workMode: {
    type: String,
    enum: ['Office', 'Hybrid', 'Remote'],
    default: 'Office'
  },
  
  // Source (Adzuna or Manual)
  source: {
    type: String,
    enum: ['Adzuna', 'Manual'],
    default: 'Adzuna'
  },
  
  // External Job URL
  externalUrl: {
    type: String
  },
  
  // Posting Date
  postedDate: {
    type: Date,
    default: Date.now
  },
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Closed', 'Filled'],
    default: 'Active'
  },
  
  // Employer (if manually posted)
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
jobSchema.index({ category: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ requiredSkills: 1 });
jobSchema.index({ status: 1 });

export default mongoose.model('Job', jobSchema);
