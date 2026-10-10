"""
SQLite persistence layer.

This mirrors the original project's database.py 1:1 in terms of schema and
behavior (same tables, same columns, same default admin bootstrap), just
reorganized behind a context-managed connection helper and typed for FastAPI.
"""
import sqlite3
from contextlib import contextmanager
from datetime import datetime
from typing import Optional

from werkzeug.security import generate_password_hash, check_password_hash

from app.config import settings


@contextmanager
def get_conn():
    conn = sqlite3.connect(settings.database_full_path)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def create_tables() -> None:
    with get_conn() as conn:
        c = conn.cursor()

        c.execute("""
        CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
        """)

        c.execute("""
        CREATE TABLE IF NOT EXISTS job_descriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            filename TEXT,
            upload_date TEXT
        )
        """)

        c.execute("""
        CREATE TABLE IF NOT EXISTS resumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            candidate_name TEXT,
            jd_id INTEGER,
            resume_text TEXT,
            filename TEXT,
            score REAL,
            verdict TEXT,
            feedback TEXT,
            upload_date TEXT,
            FOREIGN KEY(jd_id) REFERENCES job_descriptions(id)
        )
        """)

        # Default admin bootstrap (configurable via env, same idea as the
        # original Home.py's ensure_admin_exists()).
        c.execute("SELECT COUNT(*) FROM admin WHERE username = ?", (settings.default_admin_username,))
        if c.fetchone()[0] == 0:
            password_hash = generate_password_hash(settings.default_admin_password)
            c.execute(
                "INSERT INTO admin (username, password_hash) VALUES (?, ?)",
                (settings.default_admin_username, password_hash),
            )


# ---------------- Admin helpers ----------------

def add_admin(username: str, password: str) -> bool:
    with get_conn() as conn:
        c = conn.cursor()
        password_hash = generate_password_hash(password)
        try:
            c.execute("INSERT INTO admin (username, password_hash) VALUES (?, ?)", (username, password_hash))
            return True
        except sqlite3.IntegrityError:
            return False


def delete_admin(username: str) -> None:
    with get_conn() as conn:
        conn.execute("DELETE FROM admin WHERE username = ?", (username,))


def get_all_admins() -> list[str]:
    with get_conn() as conn:
        rows = conn.execute("SELECT username FROM admin").fetchall()
        return [row["username"] for row in rows]


def verify_admin(username: str, password: str) -> bool:
    with get_conn() as conn:
        row = conn.execute("SELECT password_hash FROM admin WHERE username = ?", (username,)).fetchone()
        if row:
            return check_password_hash(row["password_hash"], password)
        return False


# ---------------- Job description helpers ----------------

def add_jd(title: str, description: str, filename: Optional[str]) -> int:
    with get_conn() as conn:
        upload_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cur = conn.execute(
            "INSERT INTO job_descriptions (title, description, filename, upload_date) VALUES (?, ?, ?, ?)",
            (title, description, filename, upload_date),
        )
        return cur.lastrowid


def get_all_jds() -> list[sqlite3.Row]:
    with get_conn() as conn:
        return conn.execute(
            "SELECT id, title, description, filename, upload_date FROM job_descriptions ORDER BY upload_date DESC"
        ).fetchall()


def get_job_by_id(jd_id: int) -> Optional[sqlite3.Row]:
    with get_conn() as conn:
        return conn.execute(
            "SELECT id, title, description, filename, upload_date FROM job_descriptions WHERE id = ?", (jd_id,)
        ).fetchone()


def delete_job(jd_id: int) -> None:
    with get_conn() as conn:
        # Delete dependent resumes first (same order as the original Delete_job.py)
        conn.execute("DELETE FROM resumes WHERE jd_id=?", (jd_id,))
        conn.execute("DELETE FROM job_descriptions WHERE id=?", (jd_id,))


# ---------------- Resume helpers ----------------

def add_resume(candidate_name: str, jd_id: int, resume_text: str, filename: str, score: float, verdict: str) -> int:
    with get_conn() as conn:
        upload_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cur = conn.execute(
            """INSERT INTO resumes
               (candidate_name, jd_id, resume_text, filename, score, verdict, upload_date)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (candidate_name, jd_id, resume_text, filename, score, verdict, upload_date),
        )
        return cur.lastrowid


def get_resumes_for_jd(jd_id: int) -> list[sqlite3.Row]:
    with get_conn() as conn:
        return conn.execute(
            "SELECT candidate_name, score, verdict, filename FROM resumes WHERE jd_id = ?", (jd_id,)
        ).fetchall()


def get_resumes_with_jd_for_review(jd_id: int) -> list[sqlite3.Row]:
    """Same query as the original admin_review.py join."""
    with get_conn() as conn:
        return conn.execute(
            """
            SELECT resumes.id, candidate_name, score, verdict, resumes.filename,
                   resumes.upload_date, resume_text, job_descriptions.description, feedback
            FROM resumes
            JOIN job_descriptions ON resumes.jd_id = job_descriptions.id
            WHERE jd_id=?
            ORDER BY score DESC, resumes.upload_date DESC
            """,
            (jd_id,),
        ).fetchall()


def update_feedback(resume_id: int, feedback_text: str) -> None:
    with get_conn() as conn:
        conn.execute("UPDATE resumes SET feedback=? WHERE id=?", (feedback_text, resume_id))
