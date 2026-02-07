import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'
import {
  Users,
  TrendingUp,
  Award,
  Filter,
  Search,
  X,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
  Download,
  Eye,
  AlertCircle,
  BarChart3
} from 'lucide-react'

function RecruiterDashboard() {
  const [candidates, setCandidates] = useState([])
  const [stats, setStats] = useState(null)
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterOptions, setFilterOptions] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()

  // Filter and sort state
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    minScore: '',
    maxScore: '',
    minExperience: '',
    maxExperience: '',
    skills: '',
    location: '',
    jobType: '',
    workMode: '',
    sortBy: 'atsScore',
    order: 'desc'
  })

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    if (!token || (user.role !== 'employer' && user.role !== 'admin')) {
      navigate('/login')
      return
    }

    fetchDashboardStats()
    fetchFilterOptions()
    fetchCandidates()
  }, [])

  useEffect(() => {
    if (!loading) {
      fetchCandidates()
    }
  }, [filters.sortBy, filters.order])

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()

      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'All') {
          params.append(key, filters[key])
        }
      })

      const response = await axios.get(`${API_URL}/recruiter/candidates?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        setCandidates(response.data.data)
        setStats(response.data.stats)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch candidates')
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/recruiter/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        setDashboardStats(response.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err)
    }
  }

  const fetchFilterOptions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/recruiter/filters`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        setFilterOptions(response.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch filter options', err)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleApplyFilters = () => {
    setLoading(true)
    fetchCandidates()
    setShowFilters(false)
  }

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      minScore: '',
      maxScore: '',
      minExperience: '',
      maxExperience: '',
      skills: '',
      location: '',
      jobType: '',
      workMode: '',
      sortBy: 'atsScore',
      order: 'desc'
    })
    setLoading(true)
    setTimeout(() => fetchCandidates(), 100)
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

  if (loading && candidates.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Recruiter Dashboard</h1>
          <p className="text-blue-100">Manage candidates and track ATS scores</p>
        </div>
      </div>

      {/* Stats Cards */}
      {dashboardStats && (
        <div className="container mx-auto px-4 -mt-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Candidates</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {dashboardStats.totalCandidates}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Average ATS Score</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {dashboardStats.averageScore}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Top Scorer</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {dashboardStats.topCandidates[0]?.atsScore || 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">High Scorers (80+)</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {dashboardStats.scoreDistribution['76-100'] || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, skills..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="atsScore">ATS Score</option>
                <option value="experience">Experience</option>
                <option value="name">Name</option>
                <option value="createdAt">Date Added</option>
              </select>

              <select
                value={filters.order}
                onChange={(e) => handleFilterChange('order', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="desc">High to Low</option>
                <option value="asc">Low to High</option>
              </select>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Categories</option>
                    {filterOptions.categories?.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min ATS Score</label>
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={filters.minScore}
                    onChange={(e) => handleFilterChange('minScore', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max ATS Score</label>
                  <input
                    type="number"
                    placeholder="100"
                    min="0"
                    max="100"
                    value={filters.maxScore}
                    onChange={(e) => handleFilterChange('maxScore', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Experience (years)</label>
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={filters.minExperience}
                    onChange={(e) => handleFilterChange('minExperience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Experience (years)</label>
                  <input
                    type="number"
                    placeholder="20"
                    min="0"
                    value={filters.maxExperience}
                    onChange={(e) => handleFilterChange('maxExperience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Mode</label>
                  <select
                    value={filters.workMode}
                    onChange={(e) => handleFilterChange('workMode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Modes</option>
                    <option value="Office">Office</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleApplyFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Reset All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        {stats && (
          <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
            <p>
              Showing <span className="font-semibold text-gray-900">{candidates.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{stats.total}</span> candidates
              {stats.averageScore > 0 && (
                <span className="ml-2">
                  | Average Score: <span className="font-semibold text-blue-600">{stats.averageScore}%</span>
                </span>
              )}
            </p>
          </div>
        )}

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
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {candidates.map((candidate, index) => {
              const scoreBadge = getScoreBadge(candidate.atsScore)
              
              return (
                <div
                  key={candidate._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Rank & Score */}
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 text-center">
                        {index < 3 && filters.sortBy === 'atsScore' && filters.order === 'desc' ? (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                            <Star className="w-6 h-6 text-white fill-current" />
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                        )}
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

export default RecruiterDashboard
