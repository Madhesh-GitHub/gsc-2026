from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.base import JobCreateRequest, JobResponse, JobListResponse
from app.middleware.auth import get_current_user, get_current_recruiter
from app.utils.supabase_client import supabase_client
from datetime import datetime
from uuid import uuid4
from typing import List

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.post("", response_model=JobResponse)
async def create_job(
    request: JobCreateRequest,
    current_user: dict = Depends(get_current_recruiter)
):
    """
    Create a new job posting (Recruiter only)
    """
    try:
        job_id = str(uuid4())
        now = datetime.utcnow().isoformat()
        
        job_data = {
            "id": job_id,
            "title": request.title,
            "jd_text": request.jd_text,
            "created_at": now,
            "updated_at": now
        }
        
        result = supabase_client.table("jobs").insert(job_data).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create job posting"
            )
        
        job = result.data[0]
        return JobResponse(
            id=job["id"],
            title=job["title"],
            jd_text=job["jd_text"],
            created_at=datetime.fromisoformat(job["created_at"]),
            updated_at=datetime.fromisoformat(job["updated_at"])
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("", response_model=List[JobListResponse])
async def list_jobs():
    """
    List all active job postings (Public endpoint)
    """
    try:
        result = supabase_client.table("jobs").select("*").order("created_at", desc=True).execute()
        
        jobs = []
        for job in result.data:
            jobs.append(JobListResponse(
                id=job["id"],
                title=job["title"],
                jd_text=job["jd_text"],
                created_at=datetime.fromisoformat(job["created_at"]),
                updated_at=datetime.fromisoformat(job["updated_at"])
            ))
        
        return jobs
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: str):
    """
    Get a specific job posting (Public endpoint)
    """
    try:
        result = supabase_client.table("jobs").select("*").eq("id", job_id).single().execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        job = result.data
        return JobResponse(
            id=job["id"],
            title=job["title"],
            jd_text=job["jd_text"],
            created_at=datetime.fromisoformat(job["created_at"]),
            updated_at=datetime.fromisoformat(job["updated_at"])
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
