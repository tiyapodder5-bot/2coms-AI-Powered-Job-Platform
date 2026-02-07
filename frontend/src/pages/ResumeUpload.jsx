import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Upload, FileText, CheckCircle, Loader, AlertCircle, Sparkles } from 'lucide-react'
import { API_URL } from '../config'

function ResumeUpload() {
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setResult(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 5242880 // 5MB
  })

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first')
      return
    }

    const formData = new FormData()
    formData.append('resume', file)

    setUploading(true)

    try {
      const response = await axios.post(`${API_URL}/resume/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        setResult(response.data.data)
        toast.success('Resume uploaded successfully! 🎉')
        
        // Store candidate ID in localStorage for job applications
        localStorage.setItem('candidateId', response.data.data.candidateId)
        
        // Redirect to chatbot after 2 seconds
        setTimeout(() => {
          navigate(`/chatbot/${response.data.data.candidateId}`)
        }, 2000)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload resume')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Step 1 of 3: Upload Your Resume</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Your Job Search Journey
          </h1>
          <p className="text-lg text-gray-600">
            Upload your resume and our AI will analyze it to find your perfect job matches!
          </p>
        </div>

        {/* Upload Area */}
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              <input {...getInputProps()} />
              
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              
              {isDragActive ? (
                <p className="text-lg text-primary-600 font-medium">
                  Drop your resume here...
                </p>
              ) : (
                <>
                  <p className="text-lg text-gray-700 font-medium mb-2">
                    Drag & drop your resume here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF and DOCX (Max 5MB)
                  </p>
                </>
              )}
            </div>

            {file && (
              <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Upload & Analyze</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card bg-green-50 border-2 border-green-200"
          >
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Resume Analyzed Successfully! 🎉
              </h2>
              <p className="text-gray-600">
                Here's what we found:
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="text-lg font-bold text-gray-900">{result.name}</p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Category</p>
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
                  {result.category}
                </span>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Top Keywords (30 extracted)</p>
                <div className="flex flex-wrap gap-2">
                  {result.keywords?.slice(0, 10).map((keyword, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                  {result.keywords?.length > 10 && (
                    <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                      +{result.keywords.length - 10} more
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Skills Detected</p>
                <div className="flex flex-wrap gap-2">
                  {result.skills?.slice(0, 8).map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Experience</p>
                  <p className="text-lg font-bold text-gray-900">
                    {result.experience} years
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Education</p>
                  <p className="text-lg font-bold text-gray-900">
                    {result.education}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Redirecting you to chatbot in 2 seconds... Our AI will ask you smart questions based on your <strong>{result.category}</strong> background!
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ResumeUpload
