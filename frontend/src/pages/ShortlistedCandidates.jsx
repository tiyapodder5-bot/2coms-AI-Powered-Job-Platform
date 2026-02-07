import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'
import {
  ArrowLeft,
  Star,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Eye,
  Download,
  AlertCircle,
  Users
} from 'lucide-react'

function ShortlistedCandidates() {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    if (!token || (user.role !== 'employer' && user.role !== 'admin')) {
      navigate('/login')
      return
    }

    fetchShortlistedCandidates()
  }, [])

  const fetchShortlistedCandidates = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/recruiter/shortlisted`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        setCandidates(response.data.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch shortlisted candidates')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveShortlist = async (candidateId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${API_URL}/recruiter/candidates/${candidateId}/shortlist`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Remove from local state
      setCandidates(prev => prev.filter(c => c._id !== candidateId))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove from shortlist')
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getScoreBadge = (score) => {
    if (score >= 80) return { text: 'Excellent', color: 'bg-green-500' }
    if (score >= 60) return { text: 'Good', color: 'bg-blue-500' }
    if (score >= 40) return { text: 'Average', color: 'bg-yellow-500' }
    return { text: 'Below Average', color: 'bg-red-500' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shortlisted candidates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/recruiter/dashboard')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-8 h-8 fill-current" />
            <h1 className="text-3xl md:text-4xl font-bold">Shortlisted Candidates</h1>
          </div>
          <p className="text-yellow-100">
            {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} marked as favorites
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Candidates List */}
        {candidates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No shortlisted candidates</h3>
            <p className="text-gray-600 mb-6">
              Click the star icon on candidate cards to add them to your shortlist
            </p>
            <button
              onClick={() => navigate('/recruiter/dashboard')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse Candidates
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {candidates.map((candidate) => {
              const scoreBadge = getScoreBadge(candidate.atsScore)
              
              return (
                <div
                  key={candidate._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Score */}
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Star className="w-8 h-8 text-yellow-400 fill-current" />
                      </div>

                      <div className={`flex-shrink-0 w-24 h-24 rounded-lg border-2 ${getScoreColor(candidate.atsScore)} flex flex-col items-center justify-center`}>
                        <div className="text-3xl font-bold">{candidate.atsScore}</div>
                        <div className="text-xs font-medium">ATS Score</div>
                      </div>
                    </div>

                    {/* Candidate Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {candidate.name}
                          </h3>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${scoreBadge.color} text-white`}>
                            {scoreBadge.text}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="truncate">{candidate.email}</span>
                        </div>
                        
                        {candidate.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {candidate.phone}
                          </div>
                        )}
                        
                        {candidate.currentLocation && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            {candidate.currentLocation}
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                          {candidate.totalExperience || 0} years experience
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {candidate.category}
                        </span>
                        {candidate.extractedSkills?.slice(0, 4).map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            {skill}
                          </span>
                        ))}
                        {candidate.extractedSkills?.length > 4 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            +{candidate.extractedSkills.length - 4} more
                          </span>
                        )}
                      </div>

                      {candidate.summary && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {candidate.summary}
                        </p>
                      )}

                      {candidate.shortlistedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Shortlisted on {new Date(candidate.shortlistedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <button
                        onClick={() => navigate(`/recruiter/candidates/${candidate._id}`)}
                        className="flex-1 lg:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View Details</span>
                      </button>
                      
                      <button
                        onClick={() => handleRemoveShortlist(candidate._id)}
                        className="flex-1 lg:flex-none px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Star className="w-4 h-4 fill-current" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                      
                      {candidate.resumePath && (
                        <a
                          href={`${API_URL.replace('/api', '')}${candidate.resumePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 lg:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">Resume</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShortlistedCandidates
