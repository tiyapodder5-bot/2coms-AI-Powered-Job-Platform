import { Link, useNavigate } from 'react-router-dom'
import { Upload, Home, ListFilter, LogIn, LogOut, LayoutDashboard, Star, Briefcase, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img 
              src="https://2coms.com/images/logo.png" 
              alt="2Coms Logo" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium hidden md:inline">Home</span>
            </Link>

            <Link 
              to="/jobs" 
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ListFilter className="w-5 h-5" />
              <span className="font-medium hidden md:inline">Browse Jobs</span>
            </Link>

            {!user && (
              <>
                <Link 
                  to="/check-status" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium hidden md:inline">Check Status</span>
                </Link>
                
                <Link 
                  to="/upload" 
                  className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium hidden md:inline">Upload Resume</span>
                </Link>
              </>
            )}

            {user && (user.role === 'employer' || user.role === 'admin') && (
              <>
                <Link 
                  to="/recruiter/dashboard" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-medium hidden md:inline">Dashboard</span>
                </Link>
                
                <Link 
                  to="/recruiter/shortlisted" 
                  className="flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 transition-colors"
                >
                  <Star className="w-5 h-5" />
                  <span className="font-medium hidden lg:inline">Shortlisted</span>
                </Link>
                
                <Link 
                  to="/recruiter/jobs/new" 
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Briefcase className="w-5 h-5" />
                  <span className="font-medium hidden md:inline">Post Job</span>
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 hidden md:inline">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <LogIn className="w-5 h-5" />
                <span className="font-medium">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
