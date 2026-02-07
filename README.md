# 2Coms ATS - AI-Powered Job Portal 🚀

**Smart Job Matching Platform with AI Chatbot and Resume Parsing**

Complete MERN Stack application that uses AI to match candidates with perfect job opportunities. Upload your resume, chat with our intelligent bot, and get matched with 100+ jobs automatically!

---

## ✨ Key Features

### 🤖 **Smart Resume Parsing**
- Extracts **30 keywords** automatically from resume
- Detects **candidate category** (Technical/Sales/Marketing/Finance/Healthcare etc.)
- Extracts: Name, Email, Phone, Skills, Experience, Education
- Supports **PDF & DOCX** formats

### 💬 **Intelligent Chatbot**
- **Category-based questions** - different questions for different profiles
- Technical CV → Gets technical questions (tech stack, salary, tech cities)
- Sales CV → Gets sales questions (B2B/B2C, field sales preference)
- Marketing CV → Gets marketing questions (SEO/SEM, digital marketing)
- **Dynamic & conversational** - feels like talking to a real recruiter

### 🎯 **Smart Matching Algorithm (100 points)**
- **Skills Match (40 points)** - Candidate skills vs job requirements
- **Experience Match (20 points)** - Years of experience alignment
- **Location Match (15 points)** - Preferred location vs job location
- **Salary Match (15 points)** - Expected salary vs job salary
- **Job Type Match (10 points)** - Full-time/Part-time/Remote preference

### 🏆 **Auto-Shortlisting**
- **80%+ match** → Shortlisted (auto-selected for employers)
- **70-79% match** → Recommended (auto-selected)
- **60-69% match** → Suggested
- **40-59% match** → Applied

### 📊 **100+ Jobs Integration**
- Integrated with **Adzuna API** for real job listings
- Jobs across multiple categories
- Daily updates with fresh opportunities

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** (Mongoose)
- **PDF-Parse** (PDF parsing)
- **Mammoth** (DOCX parsing)
- **JWT** (Authentication)
- **Adzuna API** (Job listings)
- **Google Gemini AI** ✅ **INTEGRATED** (AI-powered resume parsing & job matching)

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** (Styling)
- **React Router DOM** (Navigation)
- **Axios** (API calls)
- **Lucide React** (Professional icons)
- **React Dropzone** (File upload)
- **Framer Motion** (Animations)
- **React Hot Toast** (Notifications)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

### 1️⃣ **Backend Setup**

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Configure .env file
# MongoDB connection is already added: mongodb+srv://tiyapodder5_db_user:Mijanur12345@cluster0.40kc8hw.mongodb.net/jobPortalDB
# Add Adzuna API credentials (get free from: https://developer.adzuna.com/)

# Start backend server
npm run dev

# Server runs on: http://localhost:5000
```

### 2️⃣ **Frontend Setup**

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start frontend dev server
npm run dev

# Frontend runs on: http://localhost:3000
```

### 3️⃣ **Fetch Jobs from Adzuna**

Once both servers are running:

```bash
# Make a GET request to fetch 100+ jobs
curl http://localhost:5000/api/jobs/fetch/adzuna

# Or open in browser:
# http://localhost:5000/api/jobs/fetch/adzuna
```

---

## 🎬 How It Works (User Flow)

### Step 1: Upload Resume
1. User visits homepage
2. Clicks "Upload Resume"
3. Drags & drops resume (PDF/DOCX)
4. System analyzes:
   - Extracts 30 keywords
   - Detects category (e.g., "Technical")
   - Extracts skills, experience, education

### Step 2: Smart Chatbot
1. Bot welcomes based on category
   - Technical: "Hi! I see you're a Technical professional..."
   - Sales: "Hi! I see you have a Sales background..."
2. Bot asks category-specific questions:
   - Technical → Tech stack, tech cities, startup preference
   - Sales → B2B/B2C, field sales preference
   - Marketing → SEO/SEM, social media expertise
3. Bot collects: Job type, salary, location, work mode, notice period

### Step 3: Get Matched Jobs
1. System runs matching algorithm
2. Calculates score for each job (0-100%)
3. Auto-selects candidates with 70%+ match
4. Shows top matching jobs sorted by score
5. Each job displays:
   - Match percentage badge
   - Status (Shortlisted/Recommended/Suggested)
   - Score breakdown (Skills/Experience/Location/Salary/JobType)

### Step 4: Apply
1. User clicks on job to view details
2. Can apply via external link (Adzuna job URL)
3. Employer dashboard shows auto-selected candidates

---

## 🎨 Screenshots & Features

### 🏠 **Homepage**
- Hero section with CTA
- "How It Works" section
- Features showcase
- Professional UI with Tailwind CSS

### 📤 **Resume Upload**
- Drag & drop interface
- File validation (PDF/DOCX, max 5MB)
- Real-time parsing with loading states
- Shows extracted data (keywords, category, skills)

### 🤖 **Chatbot Interface**
- WhatsApp-style chat UI
- Bot avatar with animations
- Multiple choice buttons
- Progress indicator (Question 3 of 7)
- Smooth message transitions

### 🎯 **Job Results**
- Match score badges (color-coded)
- Status tags (Shortlisted/Recommended)
- Score breakdown visualization
- Filter by category, location, job type

---

## 📁 Project Structure

```
2Coms-ATS/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── resume.controller.js
│   │   ├── chatbot.controller.js
│   │   ├── job.controller.js
│   │   ├── matching.controller.js
│   │   └── candidate.controller.js
│   ├── models/
│   │   ├── Candidate.model.js
│   │   ├── Job.model.js
│   │   ├── Application.model.js
│   │   ├── Conversation.model.js
│   │   └── User.model.js
│   ├── routes/
│   │   ├── resume.routes.js
│   │   ├── chatbot.routes.js
│   │   ├── job.routes.js
│   │   ├── matching.routes.js
│   │   ├── candidate.routes.js
│   │   └── auth.routes.js
│   ├── utils/
│   │   ├── resumeParser.js
│   │   └── chatbotQuestions.js
│   ├── middleware/
│   │   ├── upload.js
│   │   └── auth.js
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ResumeUpload.jsx
│   │   │   ├── ChatbotPage.jsx
│   │   │   ├── JobResults.jsx
│   │   │   ├── JobListing.jsx
│   │   │   └── JobDetails.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── config.js
│   │   └── index.css
│   ├── public/
│   ├── .env
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── index.html
│
└── README.md
```

---

## 🔧 API Endpoints

### Resume
- `POST /api/resume/upload` - Upload & parse resume
- `GET /api/resume/candidate/:id` - Get candidate details

### Chatbot
- `POST /api/chatbot/start` - Start chatbot conversation
- `POST /api/chatbot/answer` - Send answer & get next question
- `GET /api/chatbot/conversation/:id` - Get conversation history

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `GET /api/jobs/stats` - Get job statistics
- `GET /api/jobs/fetch/adzuna` - Fetch jobs from Adzuna
- `POST /api/jobs` - Create manual job (employer only)

### Matching
- `GET /api/matching/candidate/:candidateId` - Get matched jobs
- `GET /api/matching/job/:jobId/candidates` - Get auto-selected candidates
- `PATCH /api/matching/application/:applicationId` - Update application status

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

---

## 🎯 Smart Category Detection

The system automatically detects the candidate's category based on resume keywords:

| Category | Keywords Detected |
|----------|-------------------|
| **Technical** | python, javascript, react, node, java, sql, aws, docker, developer, programmer |
| **Sales** | sales, business development, crm, salesforce, b2b, b2c, lead generation |
| **Marketing** | marketing, seo, sem, social media, google ads, content marketing, branding |
| **Finance** | finance, accounting, audit, tax, bookkeeping, financial analyst, investment |
| **Healthcare** | healthcare, medical, doctor, nurse, physician, clinical, patient, hospital |
| **Education** | teacher, professor, education, teaching, tutor, instructor, curriculum |
| **Design** | design, ui, ux, photoshop, figma, illustrator, graphic, creative |
| **HR** | hr, human resources, recruitment, hiring, payroll, talent acquisition |
| **Operations** | operations, logistics, supply chain, inventory, warehouse, procurement |

---

## 🚀 Production Deployment

### Quick Deploy

This project is ready for production deployment:

- **Backend:** Deploy on [Render](https://render.com) [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)
- **Frontend:** Deploy on [Netlify](https://netlify.com) [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com)

### Deployment Files Included

- ✅ `render.yaml` - Render configuration (backend)
- ✅ `netlify.toml` - Netlify configuration (frontend)
- ✅ `.env.example` - Environment variable templates
- ✅ Production-ready CORS configuration
- ✅ Optimized build scripts

### Quick Start Deployment

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Production deployment"
git push origin main

# 2. Deploy Backend (Render)
# - Connect GitHub repo
# - Select 'backend' folder
# - Add environment variables from .env.example
# - Deploy!

# 3. Deploy Frontend (Netlify)
# - Connect GitHub repo
# - Select 'frontend' folder
# - Add VITE_API_URL environment variable
# - Deploy!
```

**📖 Full Guide:** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed step-by-step instructions.

**⚡ Quick Reference:** See [QUICK_DEPLOY.md](QUICK_DEPLOY.md) for fast deployment commands.

---

## 🚀 Future Enhancements

- [x] **Google Gemini AI integration** ✅ **COMPLETED** - AI-powered resume parsing & smart job matching
- [ ] WhatsApp chatbot integration
- [ ] Email notifications for matched jobs
- [ ] Employer dashboard (React app)
- [ ] Video interview scheduling
- [ ] Resume templates & builder
- [ ] Multi-language support (English + Bengali)
- [ ] Dark mode
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

This project was built for **2Coms ATS**. For any questions or contributions, please contact the development team.

---

## 📄 License

This project is proprietary software for 2Coms ATS.

---

## 🎉 Credits

**Developed by:** GitHub Copilot Assistant  
**For:** 2Coms ATS  
**Date:** February 2026  

**Technologies Used:**
- MongoDB Atlas (Database)
- Adzuna API (Job Listings)
- React + Vite (Frontend)
- Node.js + Express (Backend)
- Tailwind CSS (Styling)
- Framer Motion (Animations)

---

## 📞 Support

For setup issues or questions:
1. Check the individual README files in `/backend` and `/frontend`
2. Ensure MongoDB connection is working
3. Verify Adzuna API credentials
4. Make sure both servers are running

---

**🎯 Happy Job Hunting with AI! 🚀**
