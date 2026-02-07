import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ResumeUpload from './pages/ResumeUpload'
import ChatbotPage from './pages/ChatbotPage'
import JobResults from './pages/JobResults'
import JobListing from './pages/JobListing'
import JobDetails from './pages/JobDetails'

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
      </Routes>
    </div>
  )
}

export default App
