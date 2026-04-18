from fastapi import APIRouter, HTTPException, status
from app.schemas.base import UserRegisterRequest, UserLoginRequest, TokenResponse, UserResponse
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.supabase_client import supabase_client
from datetime import datetime
from uuid import uuid4

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
async def register(request: UserRegisterRequest):
    """
    Register a new user (Candidate or Recruiter)
    """
    try:
        # Check if user already exists
        result = supabase_client.table("users").select("*").eq("email", request.email).execute()
        if result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password
        password_hash = hash_password(request.password)
        
        # Create user in Supabase
        user_id = str(uuid4())
        now = datetime.utcnow().isoformat()
        
        user_data = {
            "id": user_id,
            "email": request.email,
            "password_hash": password_hash,
            "role": request.role,
            "first_name": request.first_name,
            "last_name": request.last_name,
            "created_at": now,
            "updated_at": now
        }
        
        result = supabase_client.table("users").insert(user_data).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user"
            )
        
        # Create JWT token
        token_data = {
            "id": user_id,
            "email": request.email,
            "role": request.role,
            "first_name": request.first_name,
            "last_name": request.last_name
        }
        access_token = create_access_token(token_data)
        
        user_response = UserResponse(
            id=user_id,
            email=request.email,
            first_name=request.first_name,
            last_name=request.last_name,
            role=request.role,
            created_at=datetime.fromisoformat(now)
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=user_response
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/login", response_model=TokenResponse)
async def login(request: UserLoginRequest):
    """
    Login with email and password
    """
    try:
        # Find user by email
        result = supabase_client.table("users").select("*").eq("email", request.email).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        user = result.data[0]
        
        # Verify password
        if not verify_password(request.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Create JWT token
        token_data = {
            "id": user["id"],
            "email": user["email"],
            "role": user["role"],
            "first_name": user["first_name"],
            "last_name": user["last_name"]
        }
        access_token = create_access_token(token_data)
        
        user_response = UserResponse(
            id=user["id"],
            email=user["email"],
            first_name=user["first_name"],
            last_name=user["last_name"],
            role=user["role"],
            created_at=datetime.fromisoformat(user["created_at"])
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=user_response
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict):
    """
    Get current user information from token
    """
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        first_name=current_user["first_name"],
        last_name=current_user["last_name"],
        role=current_user["role"],
        created_at=datetime.utcnow()
    )
