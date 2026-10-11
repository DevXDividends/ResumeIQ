# 📄 ResumeIQ — Resume Checker AI

**AI-powered resume screening that doesn't suck.**
ResumeIQ matches resumes against job descriptions using semantic similarity, ranks every applicant into **High / Medium / Low fit**, and writes personalized, AI-generated improvement feedback for each candidate — powered by Google Gemini.

> Originally a single-file Streamlit hackathon project. Rebuilt into a clean **FastAPI backend + React/Tailwind frontend**, with every original scoring behavior preserved.

```
.
├── backend/     FastAPI + SQLite REST API
└── frontend/    React + Tailwind CSS SPA
```

---

## ✨ What changed vs. the original

- **Structure** — split into `backend/` (FastAPI, layered into routers/services/database) and `frontend/` (React + Tailwind), instead of one flat Streamlit folder.
- **UI** — fully redesigned: a real homepage, a job listings page, a job detail/apply page, and an admin area (login, dashboard, review, manage admins) — all responsive and styled with Tailwind.
- **Security fix** — the Gemini API key used to be hardcoded and committed to the repo. It's now read from an environment variable (`GOOGLE_API_KEY`). **Rotate your old key in Google AI Studio** since it's already exposed in git history.
- **Everything else is unchanged** — same SQLite schema, same scoring logic (sentence-transformers cosine similarity, same fit thresholds, same 0.6/0.4 blended re-score on the admin review screen), same Gemini prompts, same admin flow, same JD upload/delete/cascade behavior.

---

## 🧰 Tech stack

| Layer | Stack |
|---|---|
| Backend | FastAPI, SQLite, sentence-transformers, PyTorch, Gemini (via `langchain-google-genai`) |
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios |
| Deployment | Docker + Docker Compose |

---

## ✅ Prerequisites (Windows only)

This guide covers **Windows only**. Install these before doing anything else:

1. **[Python 3.11](https://www.python.org/downloads/)** — during install, check **"Add python.exe to PATH"**.
2. **[Node.js LTS](https://nodejs.org/)** (includes `npm`).
3. **[Git](https://git-scm.com/download/win)**.
4. **[Google Gemini API key](https://aistudio.google.com/app/apikey)** — free to generate, needed for AI feedback/summaries.
5. *(Only if you plan to use Docker)* **[Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)**.

All commands below are meant to run in **PowerShell** or **Command Prompt**.

---

## 🚀 Running for the first time

Follow these steps once, in order. After this, skip to [Everyday startup](#-everyday-startup-after-first-time-setup) whenever you want to run the app again.

### 1. Clone the repository

```powershell
git clone https://github.com/DevXDividends/ResumeIQ.git
cd ResumeIQ
```

### 2. Set up the backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Now open the new `.env` file in Notepad (or any editor) and paste in your Gemini key:

```powershell
notepad .env
```

Set `GOOGLE_API_KEY="your-real-key-here"`, save, and close.

Start the backend:

```powershell
uvicorn app.main:app --reload --port 8000
```

Leave this terminal window open — the backend is now running at `http://localhost:8000`.

### 3. Set up the frontend

Open a **new** terminal window (keep the backend one running):

```powershell
cd ResumeIQ\frontend
npm install
npm run dev
```

### 4. Open the app

Go to **http://localhost:5173** in your browser. The frontend automatically talks to the backend running on port 8000.

Your database (`backend/resume_system.db`) and admin accounts (`admin1` / `admin2`, password `root`) are created automatically on first run.

---

## 🔁 Everyday startup (after first-time setup)

Once dependencies are installed, you don't need to reinstall anything. Just run these commands every time you want to start the app — two terminal windows, one for each:

**Terminal 1 — backend**
```powershell
cd ResumeIQ\backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — frontend**
```powershell
cd ResumeIQ\frontend
npm run dev
```

Then open **http://localhost:5173**.

---

## 🐳 Running with Docker

If you'd rather not install Python/Node locally, Docker runs the whole app in containers. Requires **Docker Desktop** to be installed and running.

### First-time Docker setup

```powershell
cd ResumeIQ
```

Create your backend `.env` file (Docker reads it the same way the local setup does):

```powershell
copy backend\.env.example backend\.env
notepad backend\.env
```

Set your `GOOGLE_API_KEY` inside, save, and close.

Build and start both containers:

```powershell
docker compose up --build
```

Open **http://localhost:5173** for the app and **http://localhost:8000** for the backend API.

Press `Ctrl + C` in the terminal to stop the containers.

### Restarting with Docker (dependencies already installed)

Once the images are built, you don't need `--build` again unless you changed code or dependencies:

```powershell
cd ResumeIQ
docker compose up
```

To stop everything:

```powershell
docker compose down
```

To run it in the background (without keeping the terminal open):

```powershell
docker compose up -d
```

> 💡 If you later pull new code or change `requirements.txt` / `package.json`, run `docker compose up --build` once to rebuild the images.

---

## 🗃️ Notes on the database

SQLite is the storage engine (`backend/resume_system.db`). Tables are created automatically on backend startup if the file doesn't exist — so this also works as a fresh install. Uploaded job description/resume files live in `backend/uploads/`, and files prepared for candidate download live in `backend/downloads/`.

> ⚠️ When using Docker, the database and uploaded files live **inside the container** by default. If you rebuild the image without adding a volume, that data will reset. For persistent storage across rebuilds, mount `backend/resume_system.db`, `backend/uploads/`, and `backend/downloads/` as volumes in `docker-compose.yml`.

---

## 🔐 Security

Your Gemini API key is read from the `GOOGLE_API_KEY` environment variable — never commit your `.env` file. If you're working from an older copy of this project where the key was hardcoded in source, **rotate that key in [Google AI Studio](https://aistudio.google.com/app/apikey)** immediately, since it may already be exposed in git history.