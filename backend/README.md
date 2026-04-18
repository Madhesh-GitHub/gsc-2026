# Equitable ATS Backend - Phase 1 Setup Guide

## 📋 Overview

FastAPI backend for the AI-powered Equitable Applicant Tracking System with role-based access control and Supabase PostgreSQL integration.

**Tech Stack:**
- Backend: FastAPI (Python)
- Database: PostgreSQL (Supabase)
- Authentication: JWT + Bcrypt
- Role-Based Access: Candidate & Recruiter

---

## 🚀 Quick Start

### 1. Environment Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Supabase

**Get your Supabase credentials:**

1. Go to https://app.supabase.com
2. Create a new project or use existing
3. Find your credentials in Settings → API:
   - Project URL: `https://nnrbvnbbqevziuhknram.supabase.co`
   - Anon Key (public, safe for frontend)
   - Service Role Key (secret, backend only)

**Create `.env` file:**

```bash
cp .env.example .env
```

**Edit `.env` with your credentials:**

```env
SUPABASE_URL=https://nnrbvnbbqevziuhknram.supabase.co
SUPABASE_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
JWT_SECRET_KEY=your_random_secret_key_here
```

### 3. Initialize Database Schema

1. Go to Supabase Dashboard → SQL Editor
2. Create new query
3. Copy entire contents of `database_schema.sql`
4. Paste and click "Run"
5. Verify tables are created ✓

**Test user credentials (after schema setup):**
- Email: `recruiter@equitableats.com`
- Password: `recruiter123`
- Role: `recruiter`

### 4. Start the Server

```bash
# Development mode (with auto-reload)
python main.py

# Or with uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Server will start at:**
- API: http://localhost:8000
- Docs (Swagger): http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 📚 API Endpoints

### Health & Status
- `GET /health` - Server health check
- `GET /` - API info

### Authentication (Public)
- `POST /auth/register` - Register new user
  ```json
  {
    "email": "candidate@example.com",
    "password": "securepassword123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "candidate"  // or "recruiter"
  }
  ```

- `POST /auth/login` - Login
  ```json
  {
    "email": "candidate@example.com",
    "password": "securepassword123"
  }
  ```

- `GET /auth/me` - Get current user info (requires JWT)

### Candidate Routes (Candidates Only)
- `POST /candidates/apply` - Submit application
  ```json
  {
    "resume_url": "https://drive.google.com/file/d/...",
    "github_url": "https://github.com/username",
    "linkedin_url": "https://linkedin.com/in/username"
  }
  ```

- `GET /candidates/me` - Get own application status

### Recruiter Routes (Recruiters Only)
- `GET /candidates` - List all candidates (filter by ?status=Reviewing)
- `GET /candidates/{candidate_id}` - Get candidate details
- `GET /candidate-proofs/candidate/{candidate_id}` - Get verification proofs

---

## 🔐 Authentication Flow

### JWT Token Structure
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "candidate",
  "first_name": "John",
  "last_name": "Doe",
  "exp": 1234567890
}
```

### Using the Token

All protected endpoints require:
```
Authorization: Bearer <your_jwt_token>
```

**Example:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  http://localhost:8000/candidates/me
```

### Role-Based Access

| Route | Candidate | Recruiter | Admin |
|-------|-----------|-----------|-------|
| `/auth/register` | ✓ | ✓ | ✓ |
| `/auth/login` | ✓ | ✓ | ✓ |
| `/candidates/apply` | ✓ | ✗ | ✓ |
| `/candidates/me` | ✓ | ✗ | ✓ |
| `/candidates` (list) | ✗ | ✓ | ✓ |
| `/candidates/{id}` | ✗ | ✓ | ✓ |
| `/candidate-proofs` | ✗ | ✓ | ✓ |

---

## 📊 Database Schema (Phase 1)

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password_hash` (String)
- `role` (Enum: candidate, recruiter, admin)
- `first_name`, `last_name` (String)
- `created_at`, `updated_at` (Timestamp)

### Candidates Table
- `id` (UUID, Primary Key)
- `user_id` (FK → users)
- `status` (Enum: Reviewing, Rejected, Blacklisted, Accepted, Human_Escalation)
- `resume_url` (String) - S3 or Google Drive link
- `resume_text` (Text) - Extracted + masked for Phase 2
- `github_url`, `linkedin_url` (String)
- `capability_score`, `verification_score` (Float, 0-100)
- `decision_matrix` (JSONB) - Phase 4 defensible decision data

### Candidate_Proofs Table
- `id` (UUID)
- `candidate_id` (FK → candidates)
- `link_type` (Enum: github, linkedin, credly, custom)
- `url` (Text)
- `is_verified` (Boolean)
- `forensic_match_score` (Float)
- `proof_data` (JSONB) - Raw extraction data

### Jobs Table
- `id` (UUID)
- `title` (String)
- `jd_text` (Text) - Job description
- `jd_vector` (Vector) - For Phase 3+ similarity search

---

## 🧪 Testing the API

### Test with Swagger UI
1. Go to http://localhost:8000/docs
2. Click "Try it out" on any endpoint
3. Fill in parameters and execute

### Test with cURL

**Register:**
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "first_name": "Test",
    "last_name": "User",
    "role": "candidate"
  }'
```

**Login:**
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

**Get Current User (replace TOKEN):**
```bash
curl -X GET "http://localhost:8000/auth/me" \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔧 Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Configuration & settings
│   ├── models/
│   │   └── database.py         # Database models (not ORM)
│   ├── schemas/
│   │   └── base.py             # Pydantic validation schemas
│   ├── routes/
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── candidates.py       # Candidate endpoints
│   │   └── proofs.py           # Verification endpoints
│   ├── middleware/
│   │   └── auth.py             # JWT & role-based access
│   └── utils/
│       ├── supabase_client.py  # Supabase connection
│       └── security.py         # JWT & password hashing
├── main.py                     # Entry point
├── requirements.txt            # Python dependencies
├── .env.example               # Environment template
├── database_schema.sql        # PostgreSQL schema
└── README.md                  # This file
```

---

## 🚨 Important Notes

### Security
- ✓ Passwords are hashed with bcrypt (never store plaintext)
- ✓ JWT tokens expire after 24 hours (configurable)
- ✓ CORS is configured for frontend origins
- ✓ Role-based access control on all protected routes
- ⚠️ Change `JWT_SECRET_KEY` in production!
- ⚠️ Use Service Role Key only on backend, never expose

### Database Security
- Row Level Security (RLS) policies are included in `database_schema.sql`
- Candidates can only see their own data
- Recruiters see all candidates

### Deployment Considerations
1. Set `DEBUG=False` in production
2. Use strong `JWT_SECRET_KEY`
3. Configure proper CORS origins
4. Use environment variables (never hardcode secrets)
5. Set up database backups in Supabase

---

## 📝 Phase 1 Completion Checklist

- [x] FastAPI backend scaffold
- [x] Supabase PostgreSQL integration
- [x] JWT authentication system
- [x] Role-based access control (Candidate/Recruiter)
- [x] User registration & login
- [x] Candidate application submission
- [x] Application status tracking
- [x] HR dashboard candidate listing
- [x] Database schema with proper indices
- [x] API documentation (Swagger)

---

## 🔜 Next: Phase 2

Once Phase 1 is running:

1. **Vision AI Integration** - Extract resume text
2. **PII Masking** - Anonymize candidate data
3. **Vertex AI Embeddings** - Generate resume vectors
4. **Fast Filter** - Cosine similarity matching against JD
5. **Auto-Rejection** - Threshold-based screening

---

## ❓ Troubleshooting

### Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000  # macOS/Linux

# Kill it
kill -9 <PID>

# Or use different port
uvicorn app.main:app --reload --port 8001
```

### Supabase Connection Error
1. Check `.env` file has correct URL and keys
2. Verify network access isn't blocked
3. Ensure Supabase project is active
4. Check database tables exist (run schema SQL)

### JWT Token Issues
- Token expired? Login again to get new token
- Invalid signature? Verify `JWT_SECRET_KEY` matches
- Headers formatted incorrectly? Use `Authorization: Bearer TOKEN`

---

## 📧 Support

For issues:
1. Check API docs at http://localhost:8000/docs
2. Review server logs in terminal
3. Verify `.env` configuration
4. Check Supabase dashboard for data

