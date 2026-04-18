from typing import Optional
from datetime import datetime

class User:
    """User Model - Candidates & HR"""
    def __init__(
        self,
        id: str,
        email: str,
        password_hash: str,
        role: str,  # 'candidate' or 'recruiter'
        first_name: str,
        last_name: str,
        created_at: datetime,
        updated_at: datetime
    ):
        self.id = id
        self.email = email
        self.password_hash = password_hash
        self.role = role  # 'candidate' | 'recruiter'
        self.first_name = first_name
        self.last_name = last_name
        self.created_at = created_at
        self.updated_at = updated_at

    @staticmethod
    def get_table_schema():
        """SQL for creating users table in Supabase"""
        return """
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL CHECK (role IN ('candidate', 'recruiter')),
            first_name VARCHAR(255),
            last_name VARCHAR(255),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(email)
        );
        
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
        """


class Candidate:
    """Candidate Model"""
    def __init__(
        self,
        id: str,
        user_id: str,
        status: str,  # 'Reviewing', 'Rejected', 'Blacklisted', 'Accepted'
        resume_url: str,
        github_url: Optional[str],
        linkedin_url: Optional[str],
        capability_score: Optional[float],
        verification_score: Optional[float],
        created_at: datetime,
        updated_at: datetime
    ):
        self.id = id
        self.user_id = user_id
        self.status = status
        self.resume_url = resume_url
        self.github_url = github_url
        self.linkedin_url = linkedin_url
        self.capability_score = capability_score
        self.verification_score = verification_score
        self.created_at = created_at
        self.updated_at = updated_at

    @staticmethod
    def get_table_schema():
        """SQL for creating candidates table in Supabase"""
        return """
        CREATE TABLE IF NOT EXISTS candidates (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            status VARCHAR(50) NOT NULL DEFAULT 'Reviewing' 
                CHECK (status IN ('Reviewing', 'Rejected', 'Blacklisted', 'Accepted')),
            resume_url TEXT,
            resume_text TEXT,
            resume_vector vector(1536),
            github_url VARCHAR(255),
            linkedin_url VARCHAR(255),
            capability_score FLOAT,
            verification_score FLOAT,
            decision_matrix JSONB,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON candidates(user_id);
        CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
        CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates(created_at DESC);
        """


class Job:
    """Job Description Model"""
    def __init__(
        self,
        id: str,
        title: str,
        jd_text: str,
        created_at: datetime,
        updated_at: datetime
    ):
        self.id = id
        self.title = title
        self.jd_text = jd_text
        self.created_at = created_at
        self.updated_at = updated_at

    @staticmethod
    def get_table_schema():
        """SQL for creating jobs table in Supabase"""
        return """
        CREATE TABLE IF NOT EXISTS jobs (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title VARCHAR(255) NOT NULL,
            jd_text TEXT NOT NULL,
            jd_vector vector(1536),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title);
        """


class CandidateProof:
    """Candidate Proof/Verification Model"""
    def __init__(
        self,
        id: str,
        candidate_id: str,
        link_type: str,  # 'github', 'linkedin', 'credly', 'custom'
        url: str,
        is_verified: bool,
        forensic_match_score: Optional[float],
        created_at: datetime,
        updated_at: datetime
    ):
        self.id = id
        self.candidate_id = candidate_id
        self.link_type = link_type
        self.url = url
        self.is_verified = is_verified
        self.forensic_match_score = forensic_match_score
        self.created_at = created_at
        self.updated_at = updated_at

    @staticmethod
    def get_table_schema():
        """SQL for creating candidate_proofs table in Supabase"""
        return """
        CREATE TABLE IF NOT EXISTS candidate_proofs (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
            link_type VARCHAR(50) NOT NULL 
                CHECK (link_type IN ('github', 'linkedin', 'credly', 'custom')),
            url TEXT NOT NULL,
            is_verified BOOLEAN DEFAULT FALSE,
            forensic_match_score FLOAT,
            proof_data JSONB,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_candidate_proofs_candidate_id ON candidate_proofs(candidate_id);
        CREATE INDEX IF NOT EXISTS idx_candidate_proofs_link_type ON candidate_proofs(link_type);
        """
