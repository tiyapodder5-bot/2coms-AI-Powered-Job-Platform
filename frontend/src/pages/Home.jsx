import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Bot, 
  Target, 
  CheckCircle, 
  Briefcase, 
  Users,
  TrendingUp,
  Sparkles
} from 'lucide-react'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Powered Job Matching</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Find Your Dream Job with
                <span className="text-primary-600"> AI Intelligence</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Upload your resume, chat with our smart AI bot, and get matched with 100+ perfect job opportunities instantly!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/upload')}
                  className="btn-primary inline-flex items-center justify-center space-x-2 text-lg"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Resume & Get Started</span>
                </button>
                
                <button
                  onClick={() => navigate('/jobs')}
                  className="btn-secondary inline-flex items-center justify-center space-x-2 text-lg"
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Browse All Jobs</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get matched with your perfect job in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                1. Upload Resume
              </h3>
              <p className="text-gray-600">
                Upload your resume (PDF/DOCX). Our AI extracts 30 keywords and detects your category automatically.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                2. Chat with AI Bot
              </h3>
              <p className="text-gray-600">
                Answer smart questions tailored to your profile. Technical CV gets tech questions, Sales CV gets sales questions!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                3. Get Matched Jobs
              </h3>
              <p className="text-gray-600">
                Our smart algorithm finds perfect matches. 70%+ match score = auto-shortlisted for employers!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose 2Coms ATS?
            </h2>
            <p className="text-xl text-gray-600">
              Powered by cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Smart Category Detection
              </h3>
              <p className="text-gray-600">
                Automatically detects if you're Technical, Sales, Marketing, Finance, or other category.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <Bot className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Dynamic Questions
              </h3>
              <p className="text-gray-600">
                Different questions for different profiles. Not one-size-fits-all!
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <TrendingUp className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                100+ Active Jobs
              </h3>
              <p className="text-gray-600">
                Integrated with Adzuna API. Fresh jobs updated daily across categories.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <Users className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Auto-Shortlisting
              </h3>
              <p className="text-gray-600">
                70%+ match? You're automatically shortlisted for employers to see!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Perfect Job?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Upload your resume now and let our AI do the magic!
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
          >
            <Upload className="w-6 h-6" />
            <span>Get Started Now - It's Free!</span>
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home
