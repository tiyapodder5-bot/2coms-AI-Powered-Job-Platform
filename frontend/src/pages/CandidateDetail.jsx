import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Target,
  DollarSign,
  Calendar,
  Building,
  Download,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  XCircle,
  StickyNote,
  Send,
  Trash2
} from 'lucide-react'

function CandidateDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newNote, setNewNote] = useState('')
  const [addingNote, setAddingNote] = useState(false)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    if (!token || (user.role !== 'employer' && user.role !== 'admin')) {
      navigate('/login')
      return
    }

    fetchCandidateDetails()
  }, [id])

  const fetchCandidateDetails = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/recruiter/candidates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        setCandidate(response.data.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch candidate details')
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    setAddingNote(true)
    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      const response = await axios.post(
        `${API_URL}/recruiter/candidates/${id}/notes`,
        { text: newNote },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        // Add the new note to local state
        const newNoteObj = {
          text: newNote,
          addedBy: {
            _id: user.id,
            name: user.name || user.email
          },
          createdAt: new Date().toISOString()
        }
        setCandidate(prev => ({
          ...prev,
          notes: [...(prev.notes || []), newNoteObj]
        }))
        setNewNote('')
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add note')
    } finally {
      setAddingNote(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-500 to-green-600'
    if (score >= 60) return 'from-blue-500 to-blue-600'
    if (score >= 40) return 'from-yellow-500 to-yellow-600'
    return 'from-red-500 to-red-600'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    if (score >= 40) return 'Fair Match'
    return 'Needs Improvement'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidate details...</p>
        </div>
      </div>
    )
  }

  if (error || !candidate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Candidate not found'}</p>
          <button
            onClick={() => navigate('/recruiter/dashboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/recruiter/dashboard')}
            className="flex items-center gap-2 text-white hover:text-blue-100 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold">Candidate Profile</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        {/* ATS Score Card */}
        <div className={`bg-gradient-to-r ${getScoreColor(candidate.atsScore)} rounded-xl shadow-xl p-8 mb-6 text-white`}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">{candidate.name}</h2>
              <p className="text-white/90 text-lg">{getScoreLabel(candidate.atsScore)}</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{candidate.atsScore}</div>
              <div className="text-xl font-medium">ATS Score</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{candidate.email}</span>
                </div>
                {candidate.phone && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span>{candidate.phone}</span>
                  </div>
                )}
                {candidate.currentLocation && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{candidate.currentLocation}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Summary */}
            {candidate.summary && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Professional Summary
                </h3>
                <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
              </div>
            )}

            {/* Experience */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Experience
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-blue-600">{candidate.totalExperience || 0}</span>
                  <span className="text-gray-600">years of experience</span>
                </div>
                {candidate.experienceDetails && (
                  <p className="text-gray-700 mt-3">{candidate.experienceDetails}</p>
                )}
              </div>
            </div>

            {/* Education */}
            {candidate.education && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Education
                </h3>
                <p className="text-gray-700">{candidate.education}</p>
              </div>
            )}

            {/* Skills */}
            {candidate.extractedSkills && candidate.extractedSkills.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.extractedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {candidate.keywords && candidate.keywords.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Keywords from Resume</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation History */}
            {candidate.conversation && candidate.conversation.messages && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Chatbot Conversation
                  {candidate.conversation.completed && (
                    <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                  )}
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {candidate.conversation.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${
                        msg.sender === 'bot'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-100 text-blue-900 ml-8'
                      }`}
                    >
                      <div className="text-xs text-gray-500 mb-1">
                        {msg.sender === 'bot' ? 'Bot' : 'Candidate'}
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {candidate.resumePath && (
                  <a
                    href={`${API_URL.replace('/api', '')}${candidate.resumePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Download className="w-5 h-5" />
                    Download Resume
                  </a>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Category</h3>
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                {candidate.category}
              </span>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Preferences
              </h3>
              <div className="space-y-3 text-sm">
                {candidate.preferredLocation && candidate.preferredLocation.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Preferred Locations:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {candidate.preferredLocation.map((loc, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {candidate.preferredJobType && (
                  <div>
                    <span className="font-medium text-gray-700">Job Type:</span>
                    <p className="text-gray-600 mt-1">{candidate.preferredJobType}</p>
                  </div>
                )}
                
                {candidate.workMode && (
                  <div>
                    <span className="font-medium text-gray-700">Work Mode:</span>
                    <p className="text-gray-600 mt-1">{candidate.workMode}</p>
                  </div>
                )}
                
                {candidate.noticePeriod && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-700">Notice Period:</span>
                    <span className="text-gray-600">{candidate.noticePeriod}</span>
                  </div>
                )}
                
                {candidate.expectedSalary && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-700">Expected Salary:</span>
                    <span className="text-gray-600">
                      ${candidate.expectedSalary.min?.toLocaleString()} - ${candidate.expectedSalary.max?.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {candidate.willingToRelocate !== undefined && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-700">Willing to Relocate:</span>
                    <span className={candidate.willingToRelocate ? 'text-green-600' : 'text-gray-600'}>
                      {candidate.willingToRelocate ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Profile Status:</span>
                  <span className={`font-medium ${candidate.status === 'Active' ? 'text-green-600' : 'text-gray-600'}`}>
                    {candidate.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Chatbot:</span>
                  <span className={`font-medium ${candidate.chatbotCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
                    {candidate.chatbotCompleted ? 'Completed' : 'Incomplete'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Added:</span>
                  <span className="text-gray-600">
                    {new Date(candidate.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-blue-600" />
                Recruiter Notes
              </h3>

              {/* Add Note Form */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                    placeholder="Add a note about this candidate..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={addingNote}
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={addingNote || !newNote.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {candidate.notes && candidate.notes.length > 0 ? (
                  candidate.notes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <p className="text-sm text-gray-800 mb-2">{note.text}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium">
                          By: {note.addedBy?.name || 'Unknown'}
                        </span>
                        <span>
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <StickyNote className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notes yet. Add one above!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateDetail
