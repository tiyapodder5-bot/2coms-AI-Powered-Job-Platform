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
  BarChart3,
  CheckSquare,
  Square,
  GitCompare,
  XCircle
} from 'lucide-react'

function RecruiterDashboard() {
  const [candidates, setCandidates] = useState([])
  const [stats, setStats] = useState(null)
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterOptions, setFilterOptions] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [selectedForCompare, setSelectedForCompare] = useState([])
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [comparisonData, setComparisonData] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState({})
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

  const handleStatusChange = async (candidateId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [candidateId]: true }))
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${API_URL}/recruiter/${candidateId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        // Update local state
        setCandidates(prev =>
          prev.map(c =>
            c._id === candidateId
              ? { ...c, applicationStatus: newStatus }
              : c
          )
        )
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [candidateId]: false }))
    }
  }

  const handleShortlistToggle = async (candidateId, currentlyShortlisted) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${API_URL}/recruiter/${candidateId}/shortlist`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        // Update local state
        setCandidates(prev =>
          prev.map(c =>
            c._id === candidateId
              ? { ...c, shortlisted: !currentlyShortlisted }
              : c
          )
        )
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update shortlist')
    }
  }

  const toggleCompareSelection = (candidateId) => {
    setSelectedForCompare(prev => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId)
      } else {
        if (prev.length >= 5) {
          alert('You can compare maximum 5 candidates at once')
          return prev
        }
        return [...prev, candidateId]
      }
    })
  }

  const handleCompare = async () => {
    if (selectedForCompare.length < 2) {
      alert('Please select at least 2 candidates to compare')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/recruiter/compare`,
        { candidateIds: selectedForCompare },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        setComparisonData(response.data.data)
        setShowCompareModal(true)
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to compare candidates')
    }
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
          <>
            {/* Compare Bar */}
            {selectedForCompare.length > 0 && (
              <div className="mb-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GitCompare className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {selectedForCompare.length} candidate(s) selected for comparison
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCompare}
                    disabled={selectedForCompare.length < 2}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Compare Now
                  </button>
                  <button
                    onClick={() => setSelectedForCompare([])}
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {candidates.map((candidate, index) => {
                const scoreBadge = getScoreBadge(candidate.atsScore)
                const isSelected = selectedForCompare.includes(candidate._id)
                
                return (
                  <div
                    key={candidate._id}
                    className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 ${
                      isSelected ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Compare Checkbox */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => toggleCompareSelection(candidate._id)}
                          className="w-6 h-6 flex items-center justify-center text-blue-600 hover:text-blue-700"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-6 h-6" />
                          ) : (
                            <Square className="w-6 h-6" />
                          )}
                        </button>
                      </div>

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
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-gray-900">
                                {candidate.name}
                              </h3>
                              <button
                                onClick={() => handleShortlistToggle(candidate._id, candidate.shortlisted)}
                                className="text-yellow-400 hover:text-yellow-500 transition-colors"
                              >
                                <Star
                                  className={`w-5 h-5 ${candidate.shortlisted ? 'fill-current' : ''}`}
                                />
                              </button>
                            </div>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${scoreBadge.color} text-white`}>
                              {scoreBadge.text}
                            </div>
                          </div>

                          {/* Status Dropdown */}
                          <div className="ml-4">
                            <select
                              value={candidate.applicationStatus || 'Applied'}
                              onChange={(e) => handleStatusChange(candidate._id, e.target.value)}
                              disabled={updatingStatus[candidate._id]}
                              className={`px-3 py-1.5 text-xs font-medium border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                                candidate.applicationStatus || 'Applied'
                              )} ${updatingStatus[candidate._id] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <option value="Applied">Applied</option>
                              <option value="Screening">Screening</option>
                              <option value="Interview">Interview</option>
                              <option value="Offer">Offer</option>
                              <option value="Hired">Hired</option>
                              <option value="Rejected">Rejected</option>
                            </select>
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
          </>
        )}
      </div>

      {/* Compare Modal */}
      {showCompareModal && comparisonData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Compare Candidates
              </h2>
              <button
                onClick={() => {
                  setShowCompareModal(false)
                  setComparisonData(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Best Match Indicator */}
              {comparisonData.bestMatch && (
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Best Match</p>
                      <p className="text-sm text-green-700">
                        {comparisonData.bestMatch.name} - {comparisonData.bestMatch.atsScore}% ATS Score
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric</th>
                      {comparisonData.candidates.map((candidate) => (
                        <th key={candidate._id} className="text-left py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{candidate.name}</span>
                            {candidate._id === comparisonData.bestMatch?._id && (
                              <span className="text-xs text-green-600 font-medium">★ Best Match</span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 bg-blue-50">
                      <td className="py-3 px-4 font-medium text-gray-700">ATS Score</td>
                      {comparisonData.candidates.map((candidate) => (
                        <td key={candidate._id} className="py-3 px-4">
                          <span className={`font-bold text-lg ${
                            candidate.atsScore >= 80 ? 'text-green-600' :
                            candidate.atsScore >= 60 ? 'text-blue-600' :
                            candidate.atsScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {candidate.atsScore}%
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-700">Status</td>
                      {comparisonData.candidates.map((candidate) => (
                        <td key={candidate._id} className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            candidate.applicationStatus || 'Applied'
                          )}`}>
                            {candidate.applicationStatus || 'Applied'}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-700">Email</td>
                      {comparisonData.candidates.map((candidate) => (
                        <td key={candidate._id} className="py-3 px-4 text-sm text-gray-600">
                          {candidate.email}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-700">Experience</td>
                      {comparisonData.candidates.map((candidate) => (
                        <td key={candidate._id} className="py-3 px-4 text-sm text-gray-600">
                          {candidate.totalExperience || 0} years
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-700">Location</td>
                      {comparisonData.candidates.map((candidate) => (
                        <td key={candidate._id} className="py-3 px-4 text-sm text-gray-600">
                          {candidate.currentLocation || 'N/A'}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-700">Category</td>
                      {comparisonData.candidates.map((candidate) => (
                        <td key={candidate._id} className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {candidate.category}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-700">Skills</td>
                      {comparisonData.candidates.map((candidate) => (
                        <td key={candidate._id} className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {candidate.extractedSkills?.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
                            {candidate.extractedSkills?.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{candidate.extractedSkills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-700">Shortlisted</td>
                      {comparisonData.candidates.map((candidate) => (
                        <td key={candidate._id} className="py-3 px-4">
                          {candidate.shortlisted ? (
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          ) : (
                            <span className="text-gray-400 text-sm">No</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-700">Actions</td>
                      {comparisonData.candidates.map((candidate) => (
                        <td key={candidate._id} className="py-3 px-4">
                          <button
                            onClick={() => {
                              setShowCompareModal(false)
                              navigate(`/recruiter/candidates/${candidate._id}`)
                            }}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700"
                          >
                            View Details
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecruiterDashboard
