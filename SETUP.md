# 🚀 Quick Setup Guide - 2Coms ATS

Follow these steps to get your AI Job Portal up and running in 10 minutes!

---

## ✅ Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

**Wait for installation to complete...**

---

## ✅ Step 2: Configure Adzuna API (Optional but Recommended)

1. Go to: https://developer.adzuna.com/
2. Sign up for a free account
3. Get your **App ID** and **API Key**
4. Open `backend/.env` file
5. Update these lines:
   ```env
   ADZUNA_APP_ID=your_adzuna_app_id
   ADZUNA_API_KEY=your_adzuna_api_key
   ```

**Note:** MongoDB connection is already configured. You can use it as is.

---

## ✅ Step 3: Start Backend Server

```bash
# Make sure you're in the backend folder
cd backend
npm run dev
```

**You should see:**
```
✅ MongoDB Connected: cluster0.40kc8hw.mongodb.net
📦 Database: jobPortalDB
🚀 Server running on port 5000
```

**Leave this terminal running!**

---

## ✅ Step 4: Fetch Jobs from Adzuna (Optional)

Open a **new terminal** and run:

```bash
curl http://localhost:5000/api/jobs/fetch/adzuna
```

Or open in browser: http://localhost:5000/api/jobs/fetch/adzuna

This will fetch 100+ jobs and store them in your database.

**Note:** Skip this if you haven't configured Adzuna API yet. You can add jobs manually later.

---

## ✅ Step 5: Install Frontend Dependencies

Open a **new terminal**:

```bash
cd frontend
npm install
```

**Wait for installation to complete...**

---

## ✅ Step 6: Start Frontend Server

```bash
# Make sure you're in the frontend folder
cd frontend
npm run dev
```

**You should see:**
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## ✅ Step 7: Open Application

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the homepage! 🎉

---

## 🎬 Test the Complete Flow

### Test 1: Upload Resume
1. Click "Upload Resume" button
2. Drag & drop a sample resume (PDF or DOCX)
3. Wait for parsing to complete
4. Check extracted keywords and category

### Test 2: Chatbot
1. After resume upload, you'll be redirected to chatbot
2. Answer all questions (7-8 questions based on category)
3. Questions will be different based on your resume category

### Test 3: Matched Jobs
1. After chatbot, you'll see matched jobs
2. Jobs sorted by match score (highest first)
3. Click on any job to view details

### Test 4: Browse All Jobs
1. Click "Browse Jobs" in navbar
2. Use filters (category, location, job type)
3. Click on any job for details

---

## 🔧 Troubleshooting

### Issue 1: Backend won't start
**Error:** `MongoDB Connection Error`

**Solution:**
- Check your internet connection
- MongoDB Atlas connection string is already configured
- If still failing, create your own MongoDB Atlas cluster and update `.env`

---

### Issue 2: Resume upload fails
**Error:** `Failed to upload resume`

**Possible causes:**
1. File size > 5MB
2. File type not PDF or DOCX
3. Backend server not running

**Solution:**
- Use smaller resume file (< 5MB)
- Ensure backend is running on port 5000
- Check backend terminal for errors

---

### Issue 3: No jobs showing
**Solution:**
1. Run Adzuna fetch API: `http://localhost:5000/api/jobs/fetch/adzuna`
2. Or manually add Adzuna credentials in `.env`
3. Or browse existing jobs if any were already fetched

---

### Issue 4: Frontend can't connect to backend
**Error:** `Network Error` or `Failed to fetch`

**Solution:**
1. Ensure backend is running on port 5000
2. Check `frontend/.env` - should have: `VITE_API_URL=http://localhost:5000/api`
3. Restart both servers

---

## 📊 MongoDB Collections

Your database will have these collections:

1. **candidates** - Candidate profiles with resume data
2. **jobs** - All job listings (from Adzuna + manual)
3. **applications** - Job applications with match scores
4. **conversations** - Chatbot conversation history
5. **users** - User accounts (optional - for authentication)

---

## 🎯 Next Steps

### For Development:
1. Add Gemini API key in `backend/.env` for enhanced resume parsing
2. Customize chatbot questions in `backend/utils/chatbotQuestions.js`
3. Adjust matching algorithm in `backend/controllers/matching.controller.js`

### For Production:
1. Build frontend: `cd frontend && npm run build`
2. Deploy backend to Railway/Render/Heroku
3. Deploy frontend to Vercel/Netlify
4. Update environment variables for production

---

## 📱 Sample Test Data

### Sample Resume Keywords:
- **Technical:** python, javascript, react, node.js, mongodb, aws
- **Sales:** sales, crm, salesforce, b2b, business development
- **Marketing:** digital marketing, seo, social media, content

### Sample Locations:
- Bangalore, Mumbai, Delhi, Hyderabad, Pune, Kolkata

### Sample Job Types:
- Full-time, Part-time, Contract, Remote

---

## 🎉 You're All Set!

Your AI-powered job portal is now running!

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

---

## 💡 Pro Tips

1. **Test with real resumes** - Use actual PDF/DOCX resumes to test parsing
2. **Check MongoDB** - Use MongoDB Compass to view data: `mongodb+srv://tiyapodder5_db_user:Mijanur12345@cluster0.40kc8hw.mongodb.net/`
3. **Watch console logs** - Both frontend and backend show useful logs
4. **Use Postman** - Test APIs directly with Postman collection

---

## 📧 Need Help?

- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
- Main README: `README.md`

---

**Happy Coding! 🚀**
