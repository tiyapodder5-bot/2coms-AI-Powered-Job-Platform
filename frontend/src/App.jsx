import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ResumeUpload from './pages/ResumeUpload'
import ChatbotPage from './pages/ChatbotPage'
import JobResults from './pages/JobResults'
import JobListing from './pages/JobListing'
import JobDetails from './pages/JobDetails'
import Login from './pages/Login'
import RecruiterDashboard from './pages/RecruiterDashboard'
import CandidateDetail from './pages/CandidateDetail'
import JobPostForm from './pages/JobPostForm'
import ShortlistedCandidates from './pages/ShortlistedCandidates'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<ResumeUpload />} />
        <Route path="/chatbot/:candidateId" element={<ChatbotPage />} />
        <Route path="/results/:candidateId" element={<JobResults />} />
        <Route path="/jobs" element={<JobListing />} />
        <Route path="/jobs/:jobId" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/candidates/:id" element={<CandidateDetail />} />
        <Route path="/recruiter/jobs/new" element={<JobPostForm />} />
        <Route path="/recruiter/jobs/edit/:id" element={<JobPostForm />} />
        <Route path="/recruiter/shortlisted" element={<ShortlistedCandidates />} />
      </Routes>
    </div>
  )
}

export default App
