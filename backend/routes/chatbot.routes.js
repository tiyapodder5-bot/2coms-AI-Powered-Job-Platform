import express from 'express';
import { startChatbot, sendAnswer, getConversation } from '../controllers/chatbot.controller.js';

const router = express.Router();

// Start chatbot
router.post('/start', startChatbot);

// Send answer
router.post('/answer', sendAnswer);

// Get conversation
router.get('/conversation/:conversationId', getConversation);

export default router;
