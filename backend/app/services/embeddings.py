"""
Semantic similarity scoring.

Ported 1:1 from the original app's logic:
  - jobDesc.py / Automated_Resume_Relevance_Checker.py apply-time scoring:
        score = cosine_similarity(resume_embedding, jd_embedding) * 100
        > 70  -> High Fit
        > 40  -> Medium Fit
        else  -> Low Fit

  - admin_review.py re-scoring pass (used only in the admin review screen):
        final_score = 0.6 * stored_score + 0.4 * semantic_score
        >= 70 -> High Fit
        >= 50 -> Medium Fit
        else  -> Low Fit
    (semantic_score there is recomputed the same way as stored_score - this
    was already the case in the original app and is preserved as-is.)

The model is loaded once and cached (mirrors @st.cache_resource).
"""
from functools import lru_cache

from sentence_transformers import SentenceTransformer, util

from app.config import settings


@lru_cache(maxsize=1)
def get_model() -> SentenceTransformer:
    return SentenceTransformer(settings.embedding_model)


def encode(text: str):
    model = get_model()
    return model.encode(text, convert_to_tensor=True)


def cosine_similarity_score(text_a: str, text_b: str) -> float:
    """Returns similarity as a 0-100 score, matching the original app's rounding."""
    emb_a = encode(text_a)
    emb_b = encode(text_b)
    score = util.pytorch_cos_sim(emb_a, emb_b).item()
    return round(score * 100, 2)


def apply_time_verdict(relevance_score: float) -> str:
    """Verdict used at application time (jobDesc.py thresholds)."""
    if relevance_score > settings.high_fit_threshold:
        return "High Fit"
    elif relevance_score > settings.medium_fit_threshold:
        return "Medium Fit"
    else:
        return "Low Fit"


def review_time_verdict(final_score: float) -> str:
    """Verdict used on the admin review re-scoring pass (admin_review.py thresholds)."""
    if final_score >= settings.review_high_fit_threshold:
        return "High Fit"
    elif final_score >= settings.review_medium_fit_threshold:
        return "Medium Fit"
    else:
        return "Low Fit"


def review_final_score(stored_score: float, resume_text: str, jd_text: str) -> float:
    """Recreates admin_review.py's blended score (0.6 hard score + 0.4 semantic score)."""
    semantic_score = cosine_similarity_score(resume_text, jd_text)
    return 0.6 * stored_score + 0.4 * semantic_score
