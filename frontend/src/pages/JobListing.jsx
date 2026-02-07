import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from 'axios'
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Building, 
  Loader,
  Search,
  Filter
} from 'lucide-react'
import API_URL from '../config'

function JobListing() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState([])
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    jobType: ''
  })
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchJobs()
    fetchStats()
  }, [filters])

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.location) params.append('location', filters.location)
      if (filters.jobType) params.append('jobType', filters.jobType)

      const response = await axios.get(`${API_URL}/jobs?${params.toString()}`)

      if (response.data.success) {
        setJobs(response.data.data.jobs)
      }
    } catch (error) {
      console.error('Fetch jobs error:', error)
      toast.error('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs/stats`)
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error('Fetch stats error:', error)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setLoading(true)
  }

  if (loading && jobs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading jobs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Browse All Jobs
          </h1>
          <p className="text-lg text-gray-600">
            {stats?.totalJobs || 0}+ active job opportunities waiting for you!
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <select 
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Design">Design</option>
              <option value="HR">HR</option>
              <option value="Operations">Operations</option>
            </select>

            <select 
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="input-field"
            >
              <option value="">All Locations</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi/NCR</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Chennai">Chennai</option>
            </select>

            <select 
              value={filters.jobType}
              onChange={(e) => handleFilterChange('jobType', e.target.value)}
              className="input-field"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="card text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-4">
                No jobs found with current filters.
              </p>
              <button 
                onClick={() => setFilters({ category: '', location: '', jobType: '' })}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            jobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="card hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-primary-600" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      
                      <div className="flex items-center space-x-2 text-gray-600 mb-3">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{job.company}</span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        
                        {job.salaryRange && (
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4" />
                            <span>
                              ₹{(job.salaryRange.min / 100000).toFixed(1)}-
                              {(job.salaryRange.max / 100000).toFixed(1)} LPA
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                          {job.category}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {job.jobType}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {job.workMode}
                        </span>
                      </div>
                    </div>
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

export default JobListing
