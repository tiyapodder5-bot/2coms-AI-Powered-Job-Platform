# Backend - 2Coms ATS Job Portal

AI-powered Job Portal Backend with Smart Chatbot and Resume Parsing.

## 🚀 Features

- ✅ Resume Upload & Parsing (PDF/DOCX)
- ✅ 30 Keywords Extraction
- ✅ Smart Category Detection (Technical/Sales/Marketing/Finance etc.)
- ✅ Dynamic Chatbot (Different questions based on resume category)
- ✅ Adzuna API Integration (100+ jobs)
- ✅ Smart Matching Algorithm (70%+ auto-selection)
- ✅ JWT Authentication
- ✅ Employer Dashboard APIs

## 📦 Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- PDF-Parse (resume parsing)
- Mammoth (DOCX parsing)
- JWT (authentication)
- Adzuna API (job fetching)
- Google Gemini AI (future integration)

## 🛠️ Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment variables:**
   - Copy `.env` file and update values
   - MongoDB connection is already added
   - Add Adzuna API credentials (get free from: https://developer.adzuna.com/)

3. **Start server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on: `http://localhost:5000`

## 📡 API Endpoints

### Resume & Parsing
- `POST /api/resume/upload` - Upload resume (PDF/DOCX)
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
- `GET /api/matching/candidate/:candidateId` - Get matched jobs for candidate
- `GET /api/matching/job/:jobId/candidates` - Get auto-selected candidates (employer)
- `PATCH /api/matching/application/:applicationId` - Update application status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Candidates
- `GET /api/candidates` - Get all candidates (employer only)
- `GET /api/candidates/:id` - Get candidate profile

## 🧠 Smart Features

### 1. **Resume Parsing**
- Extracts: Name, Email, Phone, Skills, Experience, Education
- Extracts 30 most relevant keywords
- Detects category automatically

### 2. **Category Detection**
Categories detected:
- Technical (software, developer, programmer)
- Sales (business development, sales executive)
- Marketing (digital marketing, SEO, social media)
- Finance (accountant, financial analyst)
- Healthcare
- Education
- Design (UI/UX, graphic designer)
- HR
- Operations
- Other

### 3. **Smart Chatbot**
**Technical Resume → Technical Questions:**
- Preferred tech stack
- Salary expectations (higher range)
- Tech hubs (Bangalore, Hyderabad, Pune)
- IT industry preferences

**Sales Resume → Sales Questions:**
- Field sales vs Inside sales
- B2B or B2C preference
- Commission structure preference

**Marketing Resume → Marketing Questions:**
- Digital marketing specialty
- SEO/SEM experience
- Social media platforms

And so on for each category!

### 4. **Matching Algorithm (100 points)**
- **Skills Match (40 points):** Candidate skills vs job requirements
- **Experience Match (20 points):** Years of experience
- **Location Match (15 points):** Preferred location vs job location
- **Salary Match (15 points):** Expected salary vs job salary
- **Job Type Match (10 points):** Full-time/Part-time/Remote

**Auto-Selection Rules:**
- 80%+ → Shortlisted (auto-selected)
- 70-79% → Recommended (auto-selected)
- 60-69% → Suggested
- 40-59% → Applied

## 🔧 Environment Variables

```env
MONGODB_URI=mongodb+srv://...
PORT=5000
JWT_SECRET=your_jwt_secret
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_API_KEY=your_adzuna_api_key
GEMINI_API_KEY=your_gemini_key (optional - for future use)
```

## 📝 Usage Example

### 1. Upload Resume
```bash
POST http://localhost:5000/api/resume/upload
Content-Type: multipart/form-data

{
  "resume": [PDF/DOCX file]
}
```

Response:
```json
{
  "success": true,
  "message": "Resume uploaded and parsed successfully!",
  "data": {
    "candidateId": "123...",
    "name": "Rahul Kumar",
    "email": "rahul@example.com",
    "category": "Technical",
    "keywords": ["python", "javascript", "react", ...],
    "skills": ["Python", "React", "Node.js", ...],
    "experience": 3
  }
}
```

### 2. Start Chatbot
```bash
POST http://localhost:5000/api/chatbot/start
Content-Type: application/json

{
  "candidateId": "123..."
}
```

### 3. Get Matched Jobs
```bash
GET http://localhost:5000/api/matching/candidate/123...
```

Response:
```json
{
  "success": true,
  "message": "Found 15 matching jobs for you!",
  "data": {
    "totalMatches": 15,
    "matchedJobs": [
      {
        "job": {...},
        "matchScore": 85,
        "status": "Shortlisted"
      }
    ]
  }
}
```

## 🎯 Next Steps

1. Get Adzuna API credentials from: https://developer.adzuna.com/
2. Add API keys to `.env` file
3. Run: `GET /api/jobs/fetch/adzuna` to fetch 100+ jobs
4. Test resume upload with sample PDFs
5. Test chatbot flow

## 📧 Support

For any issues, check the logs or contact the development team.

---

**Made with ❤️ for 2Coms ATS**
