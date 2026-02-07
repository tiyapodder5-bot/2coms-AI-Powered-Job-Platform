import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from 'axios'
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Building, 
  Clock,
  ExternalLink,
  ArrowLeft,
  Loader,
  CheckCircle,
  Mail
} from 'lucide-react'
import { API_URL } from '../config'

function JobDetails() {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState(null)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    fetchJobDetails()
  }, [jobId])

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs/${jobId}`)

      if (response.data.success) {
        setJob(response.data.data)
      }
    } catch (error) {
      console.error('Fetch job error:', error)
      toast.error('Failed to fetch job details')
      navigate('/jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    // Check if candidate has uploaded resume
    const candidateId = localStorage.getItem('candidateId')
    
    if (!candidateId) {
      toast.error('Please upload your resume first to apply for jobs!')
      navigate('/upload')
      return
    }

    setApplying(true)

    try {
      const response = await axios.post(`${API_URL}/matching/apply`, {
        candidateId,
        jobId
      })

      if (response.data.success) {
        setApplied(true)
        toast.success(response.data.message, { duration: 5000 })
      }
    } catch (error) {
      console.error('Apply error:', error)
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already applied')) {
        toast.error('You have already applied for this job!')
        setApplied(true)
      } else {
        toast.error(error.response?.data?.message || 'Failed to apply')
      }
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Job Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-8 h-8 text-primary-600" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {job.title}
              </h1>
              
              <div className="flex items-center space-x-2 text-lg text-gray-700 mb-4">
                <Building className="w-5 h-5" />
                <span className="font-medium">{job.company}</span>
              </div>

              <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>{job.location}</span>
                </div>
                
                {job.salaryRange && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>
                      ₹{(job.salaryRange.min / 100000).toFixed(1)}-
                      {(job.salaryRange.max / 100000).toFixed(1)} LPA
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg font-medium">
                  {job.category}
                </span>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                  {job.jobType}
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                  {job.workMode}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!applied ? (
              <button
                onClick={handleApply}
                disabled={applying}
                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applying ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Applying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Apply Now</span>
                  </>
                )}
              </button>
            ) : (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-green-900 mb-1">
                  Successfully Applied! 🎉
                </p>
                <p className="text-sm text-green-700 mb-3">
                  Our recruiter will review your profile and contact you soon.
                </p>
                <div className="bg-white rounded-lg p-3 flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">
                    Check your application status anytime at{' '}
                    <button
                      onClick={() => navigate('/check-status')}
                      className="text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      /check-status
                    </button>
                  </span>
                </div>
              </div>
            )}

            {job.externalUrl && (
              <a
                href={job.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full flex items-center justify-center space-x-2"
              >
                <span>View on Company Website</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Job Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Job Description
          </h2>
          <div className="text-gray-700 whitespace-pre-line">
            {job.description}
          </div>
        </motion.div>

        {/* Required Skills */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Experience & Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {job.experienceRequired && (
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Experience Required
              </h3>
              <p className="text-gray-700">
                {job.experienceRequired.min} - {job.experienceRequired.max} years
              </p>
            </div>
          )}

          {job.educationRequired && (
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Education Required
              </h3>
              <p className="text-gray-700">
                {job.educationRequired}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default JobDetails
