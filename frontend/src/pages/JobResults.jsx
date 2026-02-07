import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from 'axios'
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Star, 
  Building, 
  Loader,
  CheckCircle,
  Target,
  TrendingUp,
  ExternalLink
} from 'lucide-react'
import { API_URL } from '../config'

function JobResults() {
  const { candidateId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [candidate, setCandidate] = useState(null)
  const [matchedJobs, setMatchedJobs] = useState([])

  useEffect(() => {
    fetchMatchedJobs()
  }, [])

  const fetchMatchedJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/matching/candidate/${candidateId}`)

      if (response.data.success) {
        setCandidate(response.data.data.candidate)
        setMatchedJobs(response.data.data.matchedJobs)
        toast.success(response.data.message)
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to fetch matched jobs')
    } finally {
      setLoading(false)
    }
  }

  const getMatchBadgeColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-300'
    if (score >= 70) return 'bg-blue-100 text-blue-700 border-blue-300'
    if (score >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    return 'bg-gray-100 text-gray-700 border-gray-300'
  }

  const getStatusBadge = (status) => {
    const styles = {
      'Shortlisted': 'bg-green-100 text-green-700',
      'Recommended': 'bg-blue-100 text-blue-700',
      'Suggested': 'bg-yellow-100 text-yellow-700',
      'Applied': 'bg-gray-100 text-gray-700'
    }
    return styles[status] || styles.Applied
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Finding your perfect job matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-8 h-8" />
            <h1 className="text-3xl font-bold">
              Perfect Match Found! 🎉
            </h1>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <Target className="w-6 h-6 mb-2" />
              <p className="text-sm opacity-90">Your Profile</p>
              <p className="text-lg font-bold">{candidate?.name}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <Briefcase className="w-6 h-6 mb-2" />
              <p className="text-sm opacity-90">Category</p>
              <p className="text-lg font-bold">{candidate?.category}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <TrendingUp className="w-6 h-6 mb-2" />
              <p className="text-sm opacity-90">Total Matches</p>
              <p className="text-lg font-bold">{matchedJobs.length} Jobs</p>
            </div>
          </div>
        </motion.div>

        {/* Candidate Skills */}
        {candidate?.skills && candidate.skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="card mb-8"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-3">Your Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Matched Jobs */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Matched Jobs for You ({matchedJobs.length})
          </h2>

          {matchedJobs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <CheckCircle className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-center">Thank You for Applying!</h3>
              </div>
              
              <div className="p-8 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <Target className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-lg text-gray-800 font-semibold mb-2">
                      Your Application is Under Review
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      আপনার রিজিউম এবং সম্পূর্ণ তথ্য আমাদের কাছে পৌঁছেছে। আমাদের রিক্রুটার টিম আপনার প্রোফাইল যাচাই করছে এবং উপযুক্ত চাকরি খুঁজে পেলে আপনার সাথে যোগাযোগ করবে।
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">✓ Resume Received</p>
                    <p className="text-green-700 text-sm">✓ Profile Details Collected</p>
                    <p className="text-green-700 text-sm">✓ Under Recruiter Review</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>What's Next?</strong><br/>
                      Our recruitment team will match your profile with suitable job openings and contact you soon.
                    </p>
                  </div>

                  <button 
                    onClick={() => navigate('/jobs')}
                    className="btn-primary w-full mt-4"
                  >
                    Browse All Jobs
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            matchedJobs.map((match, index) => (
              <motion.div
                key={match.job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-xl transition-all cursor-pointer"
                onClick={() => navigate(`/jobs/${match.job._id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Job Title & Company */}
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-primary-600" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {match.job.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Building className="w-4 h-4" />
                          <span className="font-medium">{match.job.company}</span>
                        </div>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{match.job.location}</span>
                      </div>
                      
                      {match.job.salaryRange && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span>
                            ₹{(match.job.salaryRange.min / 100000).toFixed(1)}-
                            {(match.job.salaryRange.max / 100000).toFixed(1)} LPA
                          </span>
                        </div>
                      )}
                      
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {match.job.jobType}
                      </span>
                      
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {match.job.workMode}
                      </span>
                    </div>

                    {/* Skills */}
                    {match.job.requiredSkills && match.job.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {match.job.requiredSkills.slice(0, 5).map((skill, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500 mb-1">Skills</p>
                        <p className="font-bold text-gray-900">
                          {match.scoreBreakdown?.skillMatch || 0}/40
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500 mb-1">Experience</p>
                        <p className="font-bold text-gray-900">
                          {match.scoreBreakdown?.experienceMatch || 0}/20
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500 mb-1">Location</p>
                        <p className="font-bold text-gray-900">
                          {match.scoreBreakdown?.locationMatch || 0}/15
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500 mb-1">Salary</p>
                        <p className="font-bold text-gray-900">
                          {match.scoreBreakdown?.salaryMatch || 0}/15
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500 mb-1">Job Type</p>
                        <p className="font-bold text-gray-900">
                          {match.scoreBreakdown?.jobTypeMatch || 0}/10
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Match Score & Status */}
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 ${getMatchBadgeColor(match.matchScore)}`}>
                      <Star className="w-5 h-5" />
                      <span className="text-xl font-bold">{match.matchScore}%</span>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(match.status)}`}>
                      {match.status}
                    </span>

                    {match.job.externalUrl && (
                      <a
                        href={match.job.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        <span>View Job</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default JobResults
