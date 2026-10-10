"""
Text extraction for PDF/DOCX files.

Same behavior as the original app's extract_text() helpers, just adapted to
work on FastAPI's UploadFile (file-like objects) instead of Streamlit's
uploaded file objects.
"""
import io
from typing import Optional

from PyPDF2 import PdfReader
import docx


def extract_text_from_bytes(file_bytes: bytes, filename: str) -> Optional[str]:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    elif lower.endswith(".docx"):
        doc = docx.Document(io.BytesIO(file_bytes))
        return "\n".join(p.text for p in doc.paragraphs)
    else:
        return None
