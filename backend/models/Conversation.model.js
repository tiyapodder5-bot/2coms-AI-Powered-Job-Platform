import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['bot', 'user'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  options: [{
    type: String
  }],
  selectedOption: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const conversationSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  
  messages: [messageSchema],
  
  currentStep: {
    type: Number,
    default: 0
  },
  
  completed: {
    type: Boolean,
    default: false
  },
  
  // Category-based questions tracking
  questionCategory: {
    type: String
  }
}, {
  timestamps: true
});

conversationSchema.index({ candidate: 1 });

export default mongoose.model('Conversation', conversationSchema);
