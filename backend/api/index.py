# Vercel serverless entry point for the FastAPI application.
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.main import app  # noqa: E402

__all__ = ["app"]
