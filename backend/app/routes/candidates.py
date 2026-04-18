from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.base import CandidateCreateRequest, CandidateResponse, CandidateDetailResponse, CandidateProofResponse
from app.middleware.auth import get_current_user, get_current_candidate, get_current_recruiter
from app.utils.supabase_client import supabase_client
from datetime import datetime
from uuid import uuid4
from typing import List

router = APIRouter(prefix="/candidates", tags=["Candidates"])

@router.post("/apply", response_model=CandidateResponse)
async def submit_application(
    request: CandidateCreateRequest,
    current_user: dict = Depends(get_current_candidate)
):
    """
    Submit a job application with resume and links
    """
    try:
        candidate_id = str(uuid4())
        now = datetime.utcnow().isoformat()
        
        candidate_data = {
            "id": candidate_id,
            "user_id": current_user["id"],
            "job_id": request.job_id,
            "status": "Reviewing",
            "resume_url": request.resume_url,
            "github_url": request.github_url,
            "linkedin_url": request.linkedin_url,
            "capability_score": None,
            "verification_score": None,
            "created_at": now,
            "updated_at": now
        }
        
        result = supabase_client.table("candidates").insert(candidate_data).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to submit application"
            )
        
        candidate = result.data[0]
        return CandidateResponse(
            id=candidate["id"],
            user_id=candidate["user_id"],
            job_id=candidate["job_id"],
            status=candidate["status"],
            resume_url=candidate["resume_url"],
            github_url=candidate["github_url"],
            linkedin_url=candidate["linkedin_url"],
            capability_score=candidate["capability_score"],
            verification_score=candidate["verification_score"],
            created_at=datetime.fromisoformat(candidate["created_at"]),
            updated_at=datetime.fromisoformat(candidate["updated_at"])
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/me", response_model=CandidateDetailResponse)
async def get_my_application(
    current_user: dict = Depends(get_current_candidate)
):
    """
    Get candidate's own application status and decision matrix
    """
    try:
        result = supabase_client.table("candidates").select("*").eq(
            "user_id", current_user["id"]
        ).order("created_at", desc=True).limit(1).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No application found"
            )
        
        candidate = result.data[0]
        return CandidateDetailResponse(
            id=candidate["id"],
            user_id=candidate["user_id"],
            job_id=candidate["job_id"],
            status=candidate["status"],
            resume_url=candidate["resume_url"],
            github_url=candidate["github_url"],
            linkedin_url=candidate["linkedin_url"],
            capability_score=candidate["capability_score"],
            verification_score=candidate["verification_score"],
            decision_matrix=candidate.get("decision_matrix"),
            created_at=datetime.fromisoformat(candidate["created_at"]),
            updated_at=datetime.fromisoformat(candidate["updated_at"])
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{candidate_id}", response_model=CandidateDetailResponse)
async def get_candidate_detail(
    candidate_id: str,
    current_user: dict = Depends(get_current_recruiter)
):
    """
    Get candidate details (HR/Recruiter only)
    """
    try:
        result = supabase_client.table("candidates").select("*").eq("id", candidate_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Candidate not found"
            )
        
        candidate = result.data[0]
        return CandidateDetailResponse(
            id=candidate["id"],
            user_id=candidate["user_id"],
            job_id=candidate["job_id"],
            status=candidate["status"],
            resume_url=candidate["resume_url"],
            github_url=candidate["github_url"],
            linkedin_url=candidate["linkedin_url"],
            capability_score=candidate["capability_score"],
            verification_score=candidate["verification_score"],
            decision_matrix=candidate.get("decision_matrix"),
            created_at=datetime.fromisoformat(candidate["created_at"]),
            updated_at=datetime.fromisoformat(candidate["updated_at"])
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("", response_model=List[CandidateResponse])
async def list_candidates(
    current_user: dict = Depends(get_current_recruiter),
    status: str = None
):
    """
    List all candidates with optional status filter (HR/Recruiter only)
    """
    try:
        query = supabase_client.table("candidates").select("*")
        
        if status:
            query = query.eq("status", status)
        
        result = query.order("created_at", desc=True).execute()
        
        candidates = []
        for candidate in result.data:
            candidates.append(CandidateResponse(
                id=candidate["id"],
                user_id=candidate["user_id"],
                job_id=candidate["job_id"],
                status=candidate["status"],
                resume_url=candidate["resume_url"],
                github_url=candidate["github_url"],
                linkedin_url=candidate["linkedin_url"],
                capability_score=candidate["capability_score"],
                verification_score=candidate["verification_score"],
                created_at=datetime.fromisoformat(candidate["created_at"]),
                updated_at=datetime.fromisoformat(candidate["updated_at"])
            ))
        
        return candidates
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
