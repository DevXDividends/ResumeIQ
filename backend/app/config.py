"""
Centralized app configuration.

All values are read from environment variables (see .env.example).
Nothing sensitive (like the Gemini API key) is hardcoded here anymore -
that was a security issue in the original Streamlit app.
"""
import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent  # backend/


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    google_api_key: str = ""
    default_admin_username: str = "admin"
    default_admin_password: str = "admin123"

    database_path: str = "resume_system.db"
    upload_folder: str = "uploads"
    download_folder: str = "downloads"

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    embedding_model: str = "all-MiniLM-L6-v2"
    gemini_model: str = "gemini-1.5-flash"

    # Verdict thresholds (kept identical to the original app's logic)
    high_fit_threshold: float = 70.0
    medium_fit_threshold: float = 40.0
    # Threshold used specifically on the admin review re-scoring pass,
    # which originally used >= 70 / >= 50 (yes, different from the apply-time
    # thresholds above) - preserved as-is from the original app.
    review_high_fit_threshold: float = 70.0
    review_medium_fit_threshold: float = 50.0

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def database_full_path(self) -> str:
        return str(BASE_DIR / self.database_path)

    @property
    def upload_dir(self) -> Path:
        path = BASE_DIR / self.upload_folder
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def download_dir(self) -> Path:
        path = BASE_DIR / self.download_folder
        path.mkdir(parents=True, exist_ok=True)
        return path


settings = Settings()
