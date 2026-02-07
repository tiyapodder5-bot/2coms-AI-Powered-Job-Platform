# 🚀 Production & Localhost Dual Environment Setup

## ✅ সম্পূর্ণ Configuration হয়ে গেছে!

আপনার project এখন **localhost এবং production** - দুটো environment এই automatically কাজ করবে!

---

## 📁 Environment Files

### Backend Files:
```
backend/
  ├── .env                    # ✅ Localhost Development (Currently Active)
  └── .env.production         # 🌐 Production Deployment
```

### Frontend Files:
```
frontend/
  ├── .env                    # ✅ Localhost Development (Currently Active)
  ├── .env.development        # 🔧 Development Environment
  └── .env.production         # 🌐 Production Environment
```

---

## 🔧 Localhost Development (Current Setup)

### Backend (.env):
```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
PORT=5000
```

### Frontend (.env):
```env
VITE_API_URL=http://localhost:5000/api
```

### ✅ Working URLs:
- **Frontend:** http://localhost:3001
- **Backend:** http://localhost:5000
- **API:** http://localhost:5000/api

### Run Locally:
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 🌐 Production Deployment

### Backend Configuration:

#### On Render.com:
1. Go to your backend service
2. Add Environment Variables:
```env
NODE_ENV=production
FRONTEND_URL=https://your-app-name.netlify.app
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
GEMINI_API_KEY=AIzaSyDgMtAU3ZfWvahbCe7fS0TQMx38KilT-FA
ADZUNA_APP_ID=83ab617a
ADZUNA_API_KEY=dccad88e1f9f64da886a9ba43fced0d7
```

### Frontend Configuration:

#### On Netlify:
1. Go to Site settings → Environment variables
2. Add:
```env
VITE_API_URL=https://twocoms-ai-powered-job-platform.onrender.com/api
```

**অথবা** আপনার `frontend/.env.production` file ইতিমধ্যে সেট করা আছে!

---

## 🎯 Auto-Detection Features

### 1. Backend CORS (Automatic)
Backend automatically allows:
- ✅ `http://localhost:3000`
- ✅ `http://localhost:3001`
- ✅ `http://localhost:5173`
- ✅ Your production Netlify URL
- ✅ Any origin when `NODE_ENV=development`

### 2. Frontend API URL (Automatic)
Frontend automatically detects:
```javascript
// If localhost -> http://localhost:5000/api
// If production -> https://your-backend.onrender.com/api
```

---

## 🔄 Switching Between Environments

### For Localhost:
```bash
# Backend - Already set to development
cd backend
npm start

# Frontend - Auto uses .env (localhost)
cd frontend
npm run dev
```

### For Production Build:
```bash
# Backend - Set NODE_ENV=production in Render
# Frontend - Auto uses .env.production
cd frontend
npm run build
```

---

## 📝 Environment Variables Reference

### Backend Required Variables:
| Variable | Development | Production |
|----------|-------------|------------|
| `NODE_ENV` | development | production |
| `FRONTEND_URL` | http://localhost:3001 | https://your-netlify-url |
| `MONGODB_URI` | *(same)* | *(same)* |
| `JWT_SECRET` | *(same)* | *(same)* |
| `GEMINI_API_KEY` | *(same)* | *(same)* |
| `PORT` | 5000 | 5000 |

### Frontend Required Variables:
| Variable | Development | Production |
|----------|-------------|------------|
| `VITE_API_URL` | http://localhost:5000/api | https://your-backend.onrender.com/api |

---

## 🧪 Testing Both Environments

### Test Localhost:
```powershell
# Backend Health
curl http://localhost:5000/api/health

# Should return:
# {
#   "environment": "development",
#   "status": "Server is running"
# }

# Frontend
# Open: http://localhost:3001
# Console should show: 🌐 API URL: http://localhost:5000/api
```

### Test Production:
```powershell
# Backend Health
curl https://twocoms-ai-powered-job-platform.onrender.com/api/health

# Frontend
# Open: https://your-app-name.netlify.app
# Console should show: 🌐 API URL: https://twocoms-ai-powered-job-platform.onrender.com/api
```

---

## 🎨 Current Status

✅ **Localhost Setup:**
- Backend: Running on port 5000
- Frontend: Running on port 3001
- CORS: Configured for localhost
- Environment: Development mode
- API Connection: Working

✅ **Production Ready:**
- Environment files created
- CORS allows production URLs
- Auto-detection enabled
- Ready to deploy

---

## 🚀 Deployment Steps

### 1. Push to GitHub:
```bash
git add .
git commit -m "Setup dual environment configuration"
git push origin main
```

### 2. Render (Backend):
- Auto-deploys from GitHub
- Add production environment variables
- URL: https://twocoms-ai-powered-job-platform.onrender.com

### 3. Netlify (Frontend):
- Auto-deploys from GitHub
- Build command: `npm run build`
- Publish directory: `dist`
- Auto uses `.env.production`

---

## 🔍 Debugging

### Check Current Environment:

**Backend:**
```bash
# Visit: http://localhost:5000/api/health
# Check "environment" field
```

**Frontend:**
```javascript
// Open browser console
// Look for: 🌐 API URL: <url>
```

### Common Issues:

1. **CORS Error:**
   - Check backend CORS configuration
   - Ensure FRONTEND_URL is correct
   - Verify allowedOrigins includes your URL

2. **API URL Wrong:**
   - Check frontend .env file
   - Clear browser cache
   - Restart frontend dev server

3. **Production Not Working:**
   - Verify environment variables on Render/Netlify
   - Check backend logs
   - Ensure production URLs are correct

---

## 📊 Files Changed

### Modified:
1. ✅ `backend/server.js` - Smart CORS configuration
2. ✅ `backend/.env` - Set to development
3. ✅ `frontend/src/config.js` - Auto-detection logic
4. ✅ `frontend/.env` - Localhost URLs

### Created:
1. ✅ `backend/.env.production` - Production config
2. ✅ `frontend/.env.development` - Dev config
3. ✅ `frontend/.env.production` - Production config

---

## 🎉 Summary

### কি করা হয়েছে:

1. ✅ **Dual Environment Support:**
   - Localhost এ কাজ করবে
   - Production এ কাজ করবে
   - Automatic detection

2. ✅ **CORS Configuration:**
   - Multiple origins supported
   - Development mode open
   - Production mode restricted

3. ✅ **Environment Files:**
   - Separate configs for dev/prod
   - Easy switching
   - Well documented

4. ✅ **Auto-Detection:**
   - Frontend auto-detects environment
   - Backend accepts both URLs
   - No manual changes needed

### 🎯 এখন কি করবেন:

**Development:**
```bash
npm start      # Backend
npm run dev    # Frontend
```

**Production:**
```bash
git push origin main  # Auto-deploys to Render & Netlify
```

---

## ✨ এখন আপনার project production এবং localhost দুই জায়গায় perfectly কাজ করবে!

**Need help?** Check the environment files or review CORS configuration.

