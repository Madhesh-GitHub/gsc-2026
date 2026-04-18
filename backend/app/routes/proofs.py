from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.base import CandidateProofResponse
from app.middleware.auth import get_current_recruiter
from app.utils.supabase_client import supabase_client
from datetime import datetime
from uuid import uuid4
from typing import List

router = APIRouter(prefix="/candidate-proofs", tags=["Candidate Proofs"])

@router.get("/candidate/{candidate_id}", response_model=List[CandidateProofResponse])
async def get_candidate_proofs(
    candidate_id: str,
    current_user: dict = Depends(get_current_recruiter)
):
    """
    Get all proofs/verifications for a candidate (HR/Recruiter only)
    """
    try:
        result = supabase_client.table("candidate_proofs").select("*").eq(
            "candidate_id", candidate_id
        ).execute()
        
        proofs = []
        for proof in result.data:
            proofs.append(CandidateProofResponse(
                id=proof["id"],
                candidate_id=proof["candidate_id"],
                link_type=proof["link_type"],
                url=proof["url"],
                is_verified=proof["is_verified"],
                forensic_match_score=proof["forensic_match_score"],
                created_at=datetime.fromisoformat(proof["created_at"])
            ))
        
        return proofs
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
