# Resume Checker AI

An AI-powered platform that matches resumes against job descriptions using
semantic similarity, ranks candidates into **High / Medium / Low fit**, and
generates AI-written improvement feedback for each applicant (via Gemini).

Originally a single-file Streamlit hackathon project. Rebuilt here into a
proper **FastAPI backend + React/Tailwind frontend** with a clean folder
structure, while keeping every original feature and scoring behavior intact.

```
.
├── backend/    FastAPI + SQLite REST API (see backend/README.md)
└── frontend/   React + Tailwind CSS SPA (see frontend/README.md)
```

## What changed vs. the original

- **Structure**: split into `backend/` (FastAPI, layered into routers/services/database)
  and `frontend/` (React + Tailwind), instead of one flat Streamlit folder.
- **UI**: fully redesigned - a real homepage explaining the product, a job
  listings page, a job detail/apply page, and an admin area (login,
  dashboard, review, manage admins) - all responsive and styled with Tailwind.
- **Security fix**: the Gemini API key was previously hardcoded in
  `admin_review.py` / `jobDesc.py` and committed to the public repo. It's now
  read from an environment variable (`GOOGLE_API_KEY`) instead. **You should
  rotate that old key** in Google AI Studio since it's already exposed in
  your git history.
- **Everything else is unchanged**: same SQLite schema, same scoring logic
  (sentence-transformers cosine similarity + the same fit thresholds,
  including the exact 0.6/0.4 blended re-score used on the admin review
  screen), same Gemini feedback/summarization prompts, same admin
  add/delete/login flow, same JD upload/delete/cascade behavior.

## Quick start

**1. Backend**

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then set GOOGLE_API_KEY
uvicorn app.main:app --reload --port 8000
```

**2. Frontend** (in a second terminal)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` requests to
the FastAPI backend on port 8000.

Your existing data carries over automatically - `backend/resume_system.db`
already contains your job descriptions, resumes, and the `admin1`/`admin2`
accounts (password `root`) from the original app.

## Notes on the database

SQLite is unchanged as the storage engine (`backend/resume_system.db`).
Tables are auto-created on backend startup if the file doesn't exist yet, so
this also works as a fresh install. Uploaded JD/resume files live in
`backend/uploads/`, and files prepared for candidate download live in
`backend/downloads/` - same convention as the original app.
