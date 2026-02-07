import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Bot, User, Loader, CheckCircle, ArrowRight } from 'lucide-react'
import API_URL from '../config'

function ChatbotPage() {
  const { candidateId } = useParams()
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [conversationId, setConversationId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    startChatbot()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const startChatbot = async () => {
    try {
      const response = await axios.post(`${API_URL}/chatbot/start`, {
        candidateId
      })

      if (response.data.success) {
        const data = response.data.data

        // Add welcome message
        setMessages([
          {
            sender: 'bot',
            message: data.welcomeMessage,
            timestamp: new Date()
          }
        ])

        // Set current question
        setCurrentQuestion(data.currentQuestion)
        setConversationId(data.conversationId)
        
        // Add question to messages after a delay
        setTimeout(() => {
          setMessages(prev => [...prev, {
            sender: 'bot',
            message: data.currentQuestion.question,
            options: data.currentQuestion.options,
            timestamp: new Date()
          }])
        }, 1000)
      }
    } catch (error) {
      console.error('Start chatbot error:', error)
      toast.error('Failed to start chatbot')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = async (selectedOption) => {
    // Add user message
    setMessages(prev => [...prev, {
      sender: 'user',
      message: selectedOption.label,
      timestamp: new Date()
    }])

    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/chatbot/answer`, {
        candidateId,
        conversationId,
        answer: selectedOption.value,
        questionId: currentQuestion.id
      })

      if (response.data.success) {
        if (response.data.completed) {
          // Chatbot completed
          setCompleted(true)
          setTimeout(() => {
            setMessages(prev => [...prev, {
              sender: 'bot',
              message: response.data.message,
              timestamp: new Date()
            }])
          }, 500)

          // Redirect to results after 3 seconds
          setTimeout(() => {
            navigate(`/results/${candidateId}`)
          }, 3000)
        } else {
          // Get next question
          const nextQ = response.data.data.currentQuestion
          setCurrentQuestion(nextQ)

          setTimeout(() => {
            setMessages(prev => [...prev, {
              sender: 'bot',
              message: nextQ.question,
              options: nextQ.options,
              timestamp: new Date()
            }])
          }, 800)
        }
      }
    } catch (error) {
      console.error('Answer error:', error)
      toast.error('Failed to send answer')
    } finally {
      setLoading(false)
    }
  }

  if (loading && messages.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading chatbot...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-md p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Bot className="w-7 h-7 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Career Assistant</h2>
              {currentQuestion && !completed && (
                <p className="text-sm text-gray-500">
                  Question {currentQuestion.step} of {currentQuestion.totalSteps}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-gray-50 h-[60vh] overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-2 max-w-[80%] ${
                  msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                }`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' 
                      ? 'bg-primary-600' 
                      : 'bg-gray-300'
                  }`}>
                    {msg.sender === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-gray-700" />
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      msg.sender === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-900 shadow-md'
                    }`}>
                      <p className="text-sm md:text-base">{msg.message}</p>
                    </div>

                    {/* Options */}
                    {msg.sender === 'bot' && msg.options && !completed && index === messages.length - 1 && (
                      <div className="mt-3 space-y-2">
                        {msg.options.map((option, optIndex) => (
                          <motion.button
                            key={optIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: optIndex * 0.1 }}
                            onClick={() => handleAnswer(option)}
                            disabled={loading}
                            className="w-full text-left px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm md:text-base text-gray-900">
                                {option.label}
                              </span>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && messages.length > 0 && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-gray-700" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <div className="bg-green-100 border-2 border-green-300 rounded-xl p-6 text-center max-w-md">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-lg font-bold text-gray-900 mb-2">
                  All Done! 🎉
                </p>
                <p className="text-sm text-gray-600">
                  Redirecting to matched jobs...
                </p>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-xl shadow-md p-4 border-t">
          <p className="text-sm text-gray-500 text-center">
            🤖 Powered by AI • Your data is secure and confidential
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChatbotPage
