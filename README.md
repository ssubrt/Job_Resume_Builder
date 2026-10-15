# alignr — AI-Powered Resume Optimization Studio

alignr is a production-grade full-stack web application designed to tailor candidate resumes to any target Job Description (JD) using Google Gemini. It restructures achievements using the Google XYZ formula ("Accomplished [X], as measured by [Y], by doing [Z]"), injects relevant keywords, audits ATS compatibility, and highlights missing skill gaps — without ever fabricating false experience.

---

## 🌟 Features Overview

### Core Features
- **Job Description Validation:** Real-time character/word counting and validation (min 40 chars).
- **In-Memory Resume Parsing:** Supports PDF and DOCX uploads processed strictly in memory (zero disk retention for privacy).
- **Upload Metadata:** Displays uploaded file name and formatted file size (e.g. `245.5 KB`) with instant clear/replace controls.
- **Truthful Tailoring Prompt:** Guided prompt engineering that preserves real titles, companies, metrics, and dates while emphasizing role relevance.
- **Multiple Export Formats:**
  - 📄 **Print / Save as PDF:** Clean A4 executive layout via CSS `@media print`.
  - 📝 **Microsoft Word (.docx):** Server-generated `.docx` document via FastAPI & `python-docx`.
  - 📑 **Markdown (.md):** Clean raw markdown download.
  - 📋 **Plain Text (.txt):** Plain text download without formatting tokens.
  - 📋 **Copy to Clipboard:** 1-click clipboard copy.

### 🚀 Bonus Features Implemented (All 8 from PDF Specs)
1. **[x] Match Score:** Visual percentage match between original resume and target role.
2. **[x] Interactive Diff View:** Split side-by-side or unified diff comparison highlighting strategic optimizations and changes.
3. **[x] Multiple Resume Versions:** LocalStorage session history allowing users to store, switch, and compare multiple versions (V1, V2...).
4. **[x] Section-wise Customization & Tone:** Selective checkboxes (`Summary`, `Experience`, `Skills`) and Tone selector (`Impactful & Metrics-Driven`, `Executive`, `Technical`).
5. **[x] AI Cover Letter Generator:** Instant role-specific tailored cover letter based on verified achievements.
6. **[x] ATS Scorecard & Missing Keywords Audit:**
   - Overall ATS score meter
   - Sub-category breakdown: Keyword Match, Action Verbs, Parse Readability
   - 🟢 **Matched Keywords** vs 🟠 **Missing Keywords / Skill Gaps**
   - Concrete ATS optimization tips.
7. **[x] Saved History / Session Management:** Persistent version manager with timestamps, match scores, and 1-click restore.
8. **[x] Streaming / Pipeline Progress Feedback:** Multi-stage animated progress indicators showing extraction, analysis, ATS audit, and synthesis.
9. **[x] ⚡ 1-Click Demo Sample Mode:** Single click to pre-fill a realistic Senior Full-Stack JD and resume for instant reviewer testing.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│             Next.js 16 (App Router) Frontend           │
│  - Reactive Dashboard & 1-Click Demo Sample            │
│  - A4 Executive Resume Preview (Print-ready PDF)       │
│  - Interactive Diff Viewer (Side-by-side / Unified)    │
│  - ATS Scorecard & Missing Keywords Gap Audit          │
│  - AI Cover Letter Studio & Version History            │
└──────────────────────────┬─────────────────────────────┘
                           │  Multipart POST /api/customize
                           │  POST /api/export/docx
                           ▼
┌────────────────────────────────────────────────────────┐
│               Python 3.12 (FastAPI) Backend            │
│  - In-memory PDF / DOCX text extraction (pypdf, docx)  │
│  - Section-wise prompt engineering & validation        │
│  - DOCX Binary Generation Stream                       │
│  - CORS & strict error handling (400, 413, 415, 422)   │
└──────────────────────────┬─────────────────────────────┘
                           │  HTTPS REST API
                           ▼
┌────────────────────────────────────────────────────────┐
│               Google Gemini API (Gemini Flash)         │
│  - Constrained JSON Schema Generation                  │
│  - Low-latency ATS scoring & truthful synthesis        │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Lucide Icons.
- **Backend:** Python 3.12, FastAPI, Pydantic Settings, Uvicorn.
- **Parsing & Generation:** `pypdf`, `python-docx`.
- **LLM Provider:** Google Gemini API (`gemini-3-flash-preview`).
- **DevOps:** Docker, Docker Compose.

---

## 🚀 Local Setup Instructions

### 1. Configure Environment Variables
```bash
cp .env.example .env.local
cp backend/.env.example backend/.env
```
Add your free Google AI Studio key to `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3-flash-preview
ALLOWED_ORIGINS=["http://localhost:3000"]
MAX_UPLOAD_SIZE_MB=10
```

### 2. Run Frontend
```bash
npm install
npm run dev
```
The frontend will start at: `http://localhost:3000`

### 3. Run Backend API
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Interactive OpenAPI documentation will be accessible at: `http://localhost:8000/docs`

### 4. Or Run with Docker Compose
```bash
docker compose up --build
```

---

## 🧪 Testing

```bash
# Frontend type check & build
npm run build

# Backend unit tests
cd backend
pytest
```
