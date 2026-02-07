# 🎯 Recruiter Dashboard - User Guide

## ✅ Setup Complete!

Your recruiter dashboard is now fully functional and running on your localhost!

---

## 🚀 Quick Start

### Access the Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000

---

## 👤 Recruiter Login Credentials

### Primary Recruiter Account
- **Email**: `recruiter@company.com`
- **Password**: `recruiter123`
- **Company**: Tech Solutions Inc.

### Secondary Recruiter Account
- **Email**: `hr@startup.com`
- **Password**: `recruiter123`
- **Company**: Innovation Startup

### Admin Account
- **Email**: `admin@ats.com`
- **Password**: `admin123`
- **Company**: ATS Platform

---

## 📋 How to Use the Recruiter Dashboard

### Step 1: Sign In
1. Go to http://localhost:3001
2. Click the **"Sign In"** button in the navbar (top right)
3. Enter your recruiter credentials
4. Click **"Sign In"**

### Step 2: Access Dashboard
- After logging in, you'll be automatically redirected to the **Recruiter Dashboard**
- You can also access it by clicking **"Dashboard"** in the navbar

---

## 🎨 Dashboard Features

### 📊 Statistics Overview
At the top of the dashboard, you'll see:
- **Total Candidates**: Number of active candidates in the system
- **Average ATS Score**: Mean score across all candidates
- **Top Scorer**: Highest ATS score achieved
- **High Scorers (80+)**: Count of candidates with excellent scores

### 🔍 Smart Search & Filters

#### Quick Search
- Search by candidate name, email, or skills
- Real-time search as you type
- Press Enter to apply search

#### Sort Options
Sort candidates by:
- **ATS Score** (High to Low / Low to High)
- **Experience** (Most/Least experienced)
- **Name** (A-Z / Z-A)
- **Date Added** (Newest/Oldest)

#### Advanced Filters (Click "Filters" button)
1. **Category**: Filter by job category (Technical, Sales, Marketing, etc.)
2. **Location**: Filter by current or preferred location
3. **ATS Score Range**: Set minimum and maximum ATS scores
4. **Experience Range**: Set min/max years of experience
5. **Job Type**: Full-time, Part-time, Contract, Remote, Hybrid
6. **Work Mode**: Office, Hybrid, Remote

**Filter Actions:**
- **Apply Filters**: Apply selected filters
- **Reset All**: Clear all filters and show all candidates

---

## 📈 ATS Scoring System

### How ATS Scores are Calculated

Each candidate receives a score from 0-100 based on:

1. **Resume Completeness (30 points)**
   - Resume text quality: 10 points
   - Keywords extracted (10+): 10 points
   - Professional summary: 10 points

2. **Skills Match (25 points)**
   - 10+ skills: 25 points
   - 5-9 skills: 15 points
   - 3-4 skills: 10 points

3. **Experience (20 points)**
   - 5+ years: 20 points
   - 3-4 years: 15 points
   - 1-2 years: 10 points
   - 0-1 years: 5 points

4. **Chatbot Completion (15 points)**
   - Completed chatbot: 15 points
   - Partial completion: 8 points

5. **Profile Completeness (10 points)**
   - Based on filled fields (email, phone, location, education, etc.)

### Score Categories
- **80-100**: 🟢 Excellent Match
- **60-79**: 🔵 Good Match
- **40-59**: 🟡 Fair Match
- **0-39**: 🔴 Needs Improvement

---

## 🎯 Candidate Cards

Each candidate card displays:

### Left Section
- **Rank Number**: Position in sorted list
- **Star Badge**: Top 3 candidates get a gold star (when sorted by score)
- **ATS Score**: Large colored score indicator

### Center Section
- **Name & Quality Badge**: Candidate name with score category
- **Contact Info**: Email, phone, location
- **Experience**: Years of experience
- **Category & Skills**: Job category and top skills
- **Professional Summary**: Brief overview

### Right Section
- **View Details**: Full candidate profile
- **Resume**: Download candidate's resume

---

## 📄 Candidate Detail Page

Click **"View Details"** on any candidate to see:

### Header Section
- Large ATS score display with color coding
- Overall match quality assessment

### Main Content
1. **Contact Information**: Email, phone, location
2. **Professional Summary**: AI-generated summary
3. **Experience Details**: Years and description
4. **Education**: Academic background
5. **Skills & Expertise**: All extracted skills
6. **Resume Keywords**: Important keywords from resume
7. **Chatbot Conversation**: Full chat history (if completed)

### Sidebar
1. **Actions**: Download resume
2. **Category**: Job category classification
3. **Preferences**: 
   - Preferred locations
   - Job type preference
   - Work mode
   - Notice period
   - Expected salary
   - Willing to relocate
4. **Status**: Profile and chatbot completion status

---

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- ✅ Desktop (1920px+)
- ✅ Laptop (1024px+)
- ✅ Tablet (768px+)
- ✅ Mobile (320px+)

---

## 🔐 Authentication & Security

- JWT-based authentication
- Token stored in localStorage
- Protected routes (redirects to login if not authenticated)
- Role-based access (only employers and admins can access)

---

## 🎨 Smart Features

### Auto-Sorting
- Top scorers appear first by default
- Customize sorting as needed

### Smart Filtering Logic
- Multiple filters combine with AND logic
- Location filter checks both current and preferred locations
- Skills filter uses partial matching
- Experience and score filters use ranges

### Visual Indicators
- Color-coded scores for quick assessment
- Badge indicators for match quality
- Star badges for top performers
- Status indicators for profile completion

---

## 🔄 Logout

To logout:
1. Click your name in the top right corner
2. Click the **"Logout"** button
3. You'll be redirected to the home page

---

## 📝 Important Notes

1. **Existing Candidates**: The dashboard will show all candidates currently in your database
2. **Real-time Updates**: Refresh the page to see newly added candidates
3. **Local Only**: This runs on localhost only (not deployed to any platform)
4. **Data Security**: All recruiter credentials are hashed in the database

---

## 🆘 Troubleshooting

### Cannot Login
- Verify you're using the correct credentials
- Check that the backend server is running (localhost:5000)

### No Candidates Showing
- Check if there are candidates in the database
- Try clicking "Reset All" filters
- Verify the backend API is responding: http://localhost:5000/api/health

### Dashboard Not Loading
- Ensure you're logged in as an employer or admin
- Clear browser cache and try again
- Check browser console for errors

---

## 🎉 You're All Set!

Your recruiter dashboard is ready to use. Sign in and start managing candidates with intelligent ATS scoring and advanced filtering!

**Enjoy your smart recruitment platform! 🚀**
