-- Equitable ATS Database Schema - Phase 1
-- Run this in Supabase SQL Editor

-- Enable pgvector extension for vector operations (Phase 4)
CREATE EXTENSION IF NOT EXISTS vector;

-- ==================== USERS TABLE ====================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('candidate', 'recruiter', 'admin')),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- ==================== JOBS TABLE ====================
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    jd_text TEXT NOT NULL,
    jd_vector vector(1536) DEFAULT NULL,  -- For Phase 4 (Vertex AI embeddings)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

-- ==================== CANDIDATES TABLE ====================
CREATE TABLE IF NOT EXISTS candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'Reviewing' 
        CHECK (status IN ('Reviewing', 'Rejected', 'Blacklisted', 'Accepted', 'Human_Escalation')),
    resume_url TEXT,
    resume_text TEXT,  -- Masked PII version for Phase 2
    resume_vector vector(1536) DEFAULT NULL,  -- For Phase 3
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    capability_score FLOAT DEFAULT NULL,  -- Out of 100
    verification_score FLOAT DEFAULT NULL,  -- Out of 100
    decision_matrix JSONB DEFAULT NULL,  -- Stores defensible decision data
    fraud_alert BOOLEAN DEFAULT FALSE,
    fraud_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_capability_score ON candidates(capability_score DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_verification_score ON candidates(verification_score DESC);

-- ==================== CANDIDATE PROOFS TABLE ====================
-- Stores verification data for GitHub, LinkedIn, Credly, etc.
CREATE TABLE IF NOT EXISTS candidate_proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    link_type VARCHAR(50) NOT NULL 
        CHECK (link_type IN ('github', 'linkedin', 'credly', 'custom', 'certificate')),
    url TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    forensic_match_score FLOAT DEFAULT NULL,  -- GitHub email match score
    proof_data JSONB DEFAULT NULL,  -- Raw proof/verification data
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_candidate_proofs_candidate_id ON candidate_proofs(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_proofs_link_type ON candidate_proofs(link_type);
CREATE INDEX IF NOT EXISTS idx_candidate_proofs_is_verified ON candidate_proofs(is_verified);

-- ==================== APPEALS TABLE (For Phase 5) ====================
CREATE TABLE IF NOT EXISTS appeals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    appeal_text TEXT NOT NULL,
    appeal_url TEXT,  -- URL provided by candidate for additional proof
    status VARCHAR(50) NOT NULL DEFAULT 'Pending'
        CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    response TEXT,  -- AI's response to appeal
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appeals_candidate_id ON appeals(candidate_id);
CREATE INDEX IF NOT EXISTS idx_appeals_status ON appeals(status);

-- ==================== AUDIT LOG TABLE (For Phase 5+) ====================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    candidate_id UUID REFERENCES candidates(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_candidate_id ON audit_logs(candidate_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ==================== SEED DATA (OPTIONAL) ====================
-- Insert test job description
INSERT INTO jobs (title, jd_text) VALUES (
    'Senior Software Engineer',
    'We are looking for a Senior Software Engineer with 5+ years of experience in Python, React, and cloud technologies. Must have experience with microservices, API design, and PostgreSQL. Familiarity with GCP and Docker is a plus.'
) ON CONFLICT DO NOTHING;

-- Insert test recruiter account (password: recruiter123)
INSERT INTO users (email, password_hash, role, first_name, last_name) 
VALUES (
    'recruiter@equitableats.com',
    '$2b$12$ywBB4L7Gv3o.hCeFhCqyUOXfjGPy8VKmLVmW8.5JKMY2y8Qn2dJTa',  -- bcrypt hash
    'recruiter',
    'Sarah',
    'Johnson'
) ON CONFLICT DO NOTHING;

-- Set up Row Level Security (Optional - for Phase 2+)
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_proofs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Candidates can only see their own data
CREATE POLICY candidates_own_data ON candidates
    FOR SELECT USING (user_id = auth.uid());

-- RLS Policy: Recruiters can see all candidates
CREATE POLICY recruiters_see_all ON candidates
    FOR SELECT USING (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('recruiter', 'admin')
    );
