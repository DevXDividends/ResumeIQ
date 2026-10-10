# Resume Checker - Backend (FastAPI)

REST API for the Automated Resume Relevance Check System. Same logic as the
original Streamlit app (semantic scoring with `sentence-transformers`,
Gemini-powered feedback/summarization, SQLite persistence) reorganized into a
clean FastAPI project.

## Structure

```
backend/
  app/
    main.py            # FastAPI app, CORS, router registration
    config.py           # env-driven settings (no more hardcoded API keys)
    database.py          # SQLite access layer (same schema as original)
    schemas.py            # Pydantic request/response models
    routers/
      admin.py             # login, admin CRUD
      jobs.py               # JD CRUD + Gemini summarization
      applications.py        # candidate resume submission + scoring
      review.py                # admin review (categorized candidates) + resume download
    services/
      text_extraction.py       # PDF/DOCX -> text
      embeddings.py              # sentence-transformers scoring + verdict thresholds
      feedback.py                  # Gemini feedback/summarization
  uploads/               # uploaded JD + resume files
  downloads/             # generated candidate resume downloads
  resume_system.db       # SQLite DB (auto-created if missing)
  requirements.txt
  .env.example
```

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# then edit .env and set GOOGLE_API_KEY to your own Gemini key
```

> **Security note:** the original app had a Gemini API key hardcoded in
> `admin_review.py` / `jobDesc.py` and committed to a public GitHub repo.
> That key should be considered compromised — revoke it in Google AI Studio
> and generate a new one, then put it only in `.env` (which is gitignored).

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`.

## Default admin

On first run, a default admin is created from `DEFAULT_ADMIN_USERNAME` /
`DEFAULT_ADMIN_PASSWORD` in `.env` (defaults to `admin` / `admin123`) if no
admin with that username exists yet. Your existing `resume_system.db` already
has `admin1` / `admin2` (password `root`) carried over from the original app.

## Key endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/admin/login` | Admin login |
| GET/POST | `/api/admin/admins` | List / create admins |
| DELETE | `/api/admin/admins/{username}` | Delete an admin |
| GET | `/api/jobs` | List job descriptions |
| POST | `/api/jobs` | Upload a new JD (multipart: `title`, `file`) |
| GET | `/api/jobs/{id}` | Get a job description |
| DELETE | `/api/jobs/{id}` | Delete a job (cascades resumes) |
| POST | `/api/jobs/{id}/summarize` | Gemini-simplified JD summary |
| POST | `/api/jobs/{id}/apply` | Submit a resume (multipart: `candidate_name`, `resume`) |
| GET | `/api/jobs/{id}/review` | Categorized candidates (High/Medium/Low fit) with feedback |
| GET | `/api/resumes/{id}/download` | Download a candidate's resume |
