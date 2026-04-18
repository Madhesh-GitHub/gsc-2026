from fastapi import HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer
from app.utils.security import decode_access_token
from typing import Optional, Dict

security = HTTPBearer()

async def get_current_user(request: Request) -> Dict:
    """
    Get current authenticated user from JWT token
    Raises 401 if token is invalid or expired
    """
    # Extract token from Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = auth_header.split(" ")[1]
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return payload

async def get_current_candidate(current_user: Dict = Depends(get_current_user)) -> Dict:
    """
    Verify that current user has 'candidate' role
    """
    if current_user.get("role") != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Candidates only"
        )
    return current_user

async def get_current_recruiter(current_user: Dict = Depends(get_current_user)) -> Dict:
    """
    Verify that current user has 'recruiter' role
    """
    if current_user.get("role") != "recruiter":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Recruiters only"
        )
    return current_user

async def get_current_admin(current_user: Dict = Depends(get_current_user)) -> Dict:
    """
    Verify that current user has 'admin' role
    """
    if current_user.get("role") not in ["recruiter", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user
