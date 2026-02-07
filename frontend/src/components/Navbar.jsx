import { Link } from 'react-router-dom'
import { Upload, Home, ListFilter } from 'lucide-react'

function Navbar() {
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
              <span className="font-medium">Home</span>
            </Link>

            <Link 
              to="/jobs" 
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ListFilter className="w-5 h-5" />
              <span className="font-medium">Browse Jobs</span>
            </Link>

            <Link 
              to="/upload" 
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span className="font-medium">Upload Resume</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
