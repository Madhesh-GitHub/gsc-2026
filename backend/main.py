#!/usr/bin/env python3
"""
Equitable ATS Backend - Entry Point

Run with: python -m uvicorn main:app --reload
Or: python main.py
"""

from app.main import app

if __name__ == "__main__":
    import uvicorn
    from app.config import settings
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )
