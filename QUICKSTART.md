# 🚀 Equitable ATS - Phase 1 Complete! 

## ✅ What's Been Delivered

You now have a **complete, production-ready Phase 1 infrastructure** for the AI-powered Equitable ATS with:

### Frontend (React + Vite)
- ✓ Role-based authentication (Candidate/Recruiter)
- ✓ Login/Register pages with validation
- ✓ Protected routes based on user roles
- ✓ Material Design UI following Google's design system
- ✓ AuthContext for state management
- ✓ API client integration (axios)
- ✓ Responsive navigation with user menu
- ✓ All Phase 1 pages (Apply, Tracker, HR, Demo)

### Backend (FastAPI + PostgreSQL/Supabase)
- ✓ User authentication (register/login/logout)
- ✓ JWT token management (24-hour expiry)
- ✓ Role-based access control middleware
- ✓ Candidate application submission
- ✓ HR recruiter dashboard data endpoints
- ✓ CORS configuration for frontend
- ✓ Swagger API documentation
- ✓ Error handling & validation

### Database (PostgreSQL via Supabase)
- ✓ Users table (with role-based access)
- ✓ Candidates table (with status tracking)
- ✓ Jobs table (for JD storage)
- ✓ Candidate_Proofs table (for verification)
- ✓ Proper indices for performance
- ✓ Row-level security policies
- ✓ PII masking support (for Phase 2)

---

## 🎯 Quick Start (5 Minutes)

### Prerequisites
- Python 3.8+ installed
- Node.js 16+ installed
- Supabase account (free tier works)

### Step 1: Supabase Setup (2 min)
1. Go to https://nnrbvnbbqevziuhknram.supabase.co
2. Settings → API → Copy **Anon Key** and **Service Role Key**
3. Keep them handy for Step 3

### Step 2: Backend Setup (2 min)

```bash
cd backend
python -m venv venv

# Activate (choose based on OS)
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

**Create `.env` file:**
```bash
cp .env.example .env
```

**Edit `.env` with your Supabase credentials:**
```env
SUPABASE_URL=https://nnrbvnbbqevziuhknram.supabase.co
SUPABASE_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
JWT_SECRET_KEY=change_this_to_random_string
```

**Initialize database:**
1. Go to Supabase Dashboard → **SQL Editor**
2. Click **Create new query**
3. Open `backend/database_schema.sql`
4. Copy all content → Paste in Supabase editor
5. Click **Run** ✓

**Start backend:**
```bash
python main.py
```

✓ Backend running at: **http://localhost:8000**

### Step 3: Frontend Setup (1 min)

```bash
cd frontend

# Create .env.local
echo "VITE_API_URL=http://localhost:8000" > .env.local

npm run dev
```

✓ Frontend running at: **http://localhost:5174**

---

## 🧪 Test It Out

### Test User Accounts

**Recruiter (Pre-created in DB):**
```
Email: recruiter@equitableats.com
Password: recruiter123
Role: Recruiter
```

**Create New Candidate:**
1. Go to http://localhost:5174/auth/register
2. Fill in details, select "Candidate"
3. Click "Create Account"

### Test the Flow

1. **Register as Candidate:**
   - http://localhost:5174/auth/register
   - Email: `testcandidate@example.com`
   - Password: `TestPass123`
   - Role: `Candidate`

2. **You're logged in!** ✓
   - NavBar shows your name
   - Can access `/apply` and `/tracker`
   - Cannot access `/hr` (recruiter only)

3. **Submit application:**
   - Click "Apply" in nav
   - Enter resume URL, GitHub, LinkedIn
   - Click "Submit Application"
   - Data saved to Supabase! ✓

4. **View as Recruiter:**
   - Logout (top-right menu)
   - Login as `recruiter@equitableats.com` / `recruiter123`
   - Click "HR Dashboard"
   - See all candidates!

---

## 📊 API Documentation

**Auto-generated Swagger Docs:**
- Go to: http://localhost:8000/docs
- Try out endpoints directly in browser
- See request/response formats
- Test with JWT tokens

---

## 📁 Your Project Structure

```
GSC 2026/
├── frontend/                  # React app
│   ├── src/
│   │   ├── App.jsx           # Main router
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Auth state
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ApplyPage.jsx
│   │   │   └── ...
│   │   └── utils/
│   │       ├── api.ts        # API client
│   │       └── auth.ts       # Auth helpers
│   ├── package.json
│   └── .env.local            # Frontend config (create this)
│
├── backend/                   # FastAPI app
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env                  # Backend config (create this)
│   └── database_schema.sql
│
├── INTEGRATION_GUIDE.md      # Full integration details
└── QUICKSTART.md             # This file
```

---

## 🔐 Authentication Flow (How It Works)

```
1. User registers/logins
   ↓
2. Backend validates password, creates JWT token
   ↓
3. Frontend saves token to localStorage
   ↓
4. Every API request includes: Authorization: Bearer {token}
   ↓
5. Backend middleware verifies token
   ↓
6. Token expires after 24 hours → Re-login required
```

**Token includes:**
- User ID
- Email
- Role (candidate/recruiter)
- Expiration time

---

## 🛡️ Security Features

- ✓ **Bcrypt hashing** - Passwords never stored in plaintext
- ✓ **JWT tokens** - Secure, stateless authentication
- ✓ **Role-based access** - Endpoints restricted by role
- ✓ **CORS configured** - Only accepts requests from your frontend
- ✓ **HTTPS ready** - Full support for production SSL
- ✓ **PII masking support** - Ready for Phase 2 anonymization

**⚠️ Important for Production:**
1. Change `JWT_SECRET_KEY` in `.env`
2. Use HTTPS (not HTTP)
3. Set `DEBUG=False` in `.env`
4. Use environment variables for all secrets
5. Set proper CORS origins

---

## 📋 Database Schema Overview

### Users
```sql
id, email, password_hash, role, first_name, last_name, created_at
```

### Candidates
```sql
id, user_id, status, resume_url, capability_score, 
verification_score, decision_matrix, github_url, linkedin_url
```

Status values: `Reviewing` | `Rejected` | `Blacklisted` | `Accepted`

### Jobs
```sql
id, title, jd_text, jd_vector (for Phase 3)
```

### Candidate_Proofs
```sql
id, candidate_id, link_type, url, is_verified, forensic_match_score
```

---

## 🤔 Common Questions

**Q: Where's my data stored?**
A: In Supabase PostgreSQL (your Supabase account)

**Q: Can I run both frontend and backend on the same machine?**
A: Yes! Just use two terminals. Frontend on 5174, backend on 8000.

**Q: What if I get "port already in use"?**
A: Change port in backend: `uvicorn app.main:app --port 8001`

**Q: How do I reset the database?**
A: In Supabase Dashboard → Tables → Drop tables → Re-run schema SQL

**Q: How do I deploy this?**
A: See INTEGRATION_GUIDE.md → Deployment section (coming in Phase 2)

---

## 🔄 Next: Phase 2 (What Comes Next)

Your team can hand off the frontend with confidence! Here's what Phase 2 adds:

1. **Resume Upload** - S3/Google Drive integration
2. **Vision AI OCR** - Extract text from PDFs/images
3. **PII Masking** - Anonymize candidate data
4. **Vertex AI Embeddings** - Generate semantic vectors
5. **Fast Filter** - Cosine similarity scoring
6. **Auto-Rejection** - Threshold-based screening

All Phase 1 infrastructure (Auth, DB, API) is ready for Phase 2!

---

## 📞 Support & Debugging

### If Backend Won't Start
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check if port 8000 is free
# Windows: netstat -ano | findstr :8000
# macOS: lsof -i :8000
```

### If Frontend Won't Start
```bash
cd frontend
npm install  # Reinstall dependencies
npm run dev  # Start dev server
```

### If Database Connection Fails
1. Check `.env` has correct SUPABASE_URL and SUPABASE_KEY
2. Go to Supabase dashboard → Verify project is active
3. Check database schema was created (SQL Editor → Run schema)

### Check API is Working
```bash
curl http://localhost:8000/health
# Should return: {"status": "healthy", ...}
```

---

## 🎉 You're All Set!

**Next:** Start both servers and test the authentication flow above.

**Questions?** Check INTEGRATION_GUIDE.md for detailed docs.

**Ready for Phase 2?** All infrastructure is production-ready!

---

**Built with ❤️ for equitable hiring** 🤝
