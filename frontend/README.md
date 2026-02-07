# Frontend - 2Coms ATS Job Portal

AI-powered Job Portal Frontend built with React, Vite, and Tailwind CSS.

## 🚀 Features

- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Drag & drop resume upload
- ✅ Real-time chatbot with smooth animations
- ✅ Professional job listings with filters
- ✅ Match score visualization
- ✅ Framer Motion animations
- ✅ Hot toast notifications

## 📦 Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (icons)
- React Dropzone
- Framer Motion
- React Hot Toast

## 🛠️ Installation

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Configure environment:**
   - Update `.env` file if backend URL is different
   - Default: `http://localhost:5000/api`

3. **Start development server:**
```bash
npm run dev
```

Frontend will run on: `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ResumeUpload.jsx
│   │   ├── ChatbotPage.jsx
│   │   ├── JobResults.jsx
│   │   ├── JobListing.jsx
│   │   └── JobDetails.jsx
│   ├── App.jsx
│   ├── main.jsx
│   ├── config.js
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Pages

1. **Home** - Landing page with hero section
2. **Resume Upload** - Drag & drop resume upload
3. **Chatbot** - Smart Q&A based on resume category
4. **Job Results** - Matched jobs with scores
5. **Job Listing** - Browse all jobs with filters
6. **Job Details** - Detailed job view

## 🚀 Build for Production

```bash
npm run build
```

Build output will be in `dist/` folder.

## 🌐 Preview Production Build

```bash
npm run preview
```

---

**Made with ❤️ for 2Coms ATS**
