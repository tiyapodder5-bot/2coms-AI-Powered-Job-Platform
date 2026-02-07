import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'
import {
  Search,
  Mail,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Star,
  TrendingUp
} from 'lucide-react'

function CandidateStatusCheck() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [candidate, setCandidate] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setCandidate(null)

    try {
      const response = await axios.get(`${API_URL}/candidates/status/${email}`)

      if (response.data.success) {
        setCandidate(response.data.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No application found with this email')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    const icons = {
      'Applied': <Clock className="w-6 h-6 text-gray-500" />,
      'Screening': <Search className="w-6 h-6 text-blue-500" />,
      'Interview': <TrendingUp className="w-6 h-6 text-yellow-500" />,
      'Offer': <Star className="w-6 h-6 text-purple-500" />,
      'Hired': <CheckCircle className="w-6 h-6 text-green-500" />,
      'Rejected': <XCircle className="w-6 h-6 text-red-500" />
    }
    return icons[status] || <Clock className="w-6 h-6 text-gray-500" />
  }

  const getStatusColor = (status) => {
    const colors = {
      'Applied': 'bg-gray-100 text-gray-700 border-gray-300',
      'Screening': 'bg-blue-100 text-blue-700 border-blue-300',
      'Interview': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Offer': 'bg-purple-100 text-purple-700 border-purple-300',
      'Hired': 'bg-green-100 text-green-700 border-green-300',
      'Rejected': 'bg-red-100 text-red-700 border-red-300'
    }
    return colors[status] || colors['Applied']
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Check Your Application Status
          </h1>
          <p className="text-gray-600">
            Enter your email to see the status of your job application
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Check Status
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-8">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm text-red-800 font-medium">Application Not Found</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <p className="text-sm text-red-600 mt-2">
                Make sure you've already applied by uploading your resume.
              </p>
            </div>
          </div>
        )}

        {/* Candidate Information */}
        {candidate && (
          <div className="space-y-6">
            {/* Current Status Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">Hello, {candidate.name}!</h2>
                <p className="text-blue-100">Here's your application status</p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-4">
                      {getStatusIcon(candidate.applicationStatus || 'Applied')}
                    </div>
                    <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold border-2 ${getStatusColor(
                      candidate.applicationStatus || 'Applied'
                    )}`}>
                      {candidate.applicationStatus || 'Applied'}
                    </div>
                  </div>
                </div>

                {/* Status Description */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-700 text-center">
                    {candidate.applicationStatus === 'Applied' && 
                      'Your application has been received and is under review.'}
                    {candidate.applicationStatus === 'Screening' && 
                      'Your profile is being reviewed by our recruitment team.'}
                    {candidate.applicationStatus === 'Interview' && 
                      'Congratulations! You have been shortlisted for an interview.'}
                    {candidate.applicationStatus === 'Offer' && 
                      'Great news! We would like to extend an offer to you.'}
                    {candidate.applicationStatus === 'Hired' && 
                      'Congratulations! You have been hired. Welcome to the team!'}
                    {candidate.applicationStatus === 'Rejected' && 
                      'Unfortunately, we are moving forward with other candidates at this time.'}
                    {!candidate.applicationStatus && 
                      'Your application has been received and is under review.'}
                  </p>
                </div>

                {/* Candidate Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{candidate.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{candidate.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium text-gray-900">{candidate.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="font-medium text-gray-900">
                        {candidate.totalExperience || 0} years
                      </p>
                    </div>
                  </div>

                  {/* ATS Score */}
                  {candidate.atsScore && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">ATS Score</p>
                        <p className="text-lg font-bold text-blue-600">
                          {candidate.atsScore}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${candidate.atsScore}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Shortlisted Badge */}
                  {candidate.shortlisted && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <div>
                        <p className="font-medium text-yellow-900">Shortlisted Candidate</p>
                        <p className="text-sm text-yellow-700">
                          You have been added to our shortlist!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Chatbot Status */}
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Profile Completion:</strong>{' '}
                      {candidate.chatbotCompleted ? (
                        <span className="text-green-600">✓ Completed</span>
                      ) : (
                        <span className="text-yellow-600">⚠ Incomplete - Complete chatbot for better matching</span>
                      )}
                    </p>
                  </div>

                  {/* Application Date */}
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Applied on {new Date(candidate.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => setCandidate(null)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Check Another Email
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Info Box */}
        {!candidate && !error && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Haven't Applied Yet?
            </h3>
            <p className="text-gray-600 mb-4">
              Upload your resume to start your application process
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Upload Resume
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CandidateStatusCheck
