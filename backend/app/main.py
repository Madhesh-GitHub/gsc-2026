from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.utils.supabase_client import SupabaseClient
from app.routes import auth, candidates, proofs, jobs
from app.middleware.auth import security

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered Equitable ATS Backend",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup"""
    try:
        SupabaseClient.init_database()
        print("✓ Application started successfully")
    except Exception as e:
        print(f"✗ Startup error: {e}")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT
    }

# Include routers
app.include_router(auth.router)
app.include_router(candidates.router)
app.include_router(proofs.router)
app.include_router(jobs.router)

# Root endpoint
@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Equitable ATS API",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
