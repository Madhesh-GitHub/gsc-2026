# Phase 1 Complete - Frontend + Backend Integration Guide

## 📦 What's Included

### ✅ Backend (FastAPI)
- User authentication (register/login)
- Role-based access control (Candidate/Recruiter)
- JWT token management
- Candidate application submission
- PostgreSQL integration via Supabase
- API documentation (Swagger)
- CORS configuration for frontend

### ✅ Frontend (React + Vite)
- Authentication pages (Login/Register)
- AuthContext for state management
- Protected routes with role-based access
- Integration with FastAPI backend
- Material Design UI components
- Responsive navigation with user menu

---

## 🚀 Quick Start (Full Setup)

### Step 1: Setup Backend

```bash
cd backend
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### Step 2: Configure Supabase

1. **Get your Supabase URL & Keys:**
   - Go to https://app.supabase.com
   - Find Settings → API
   - Copy the URL and Anon Key

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env`:**
   ```env
   SUPABASE_URL=https://nnrbvnbbqevziuhknram.supabase.co
   SUPABASE_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   JWT_SECRET_KEY=your_secret_key_change_this
   ```

### Step 3: Initialize Database Schema

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **Create new query**
3. Copy entire contents of `backend/database_schema.sql`
4. Paste and click **Run**
5. ✓ Tables created

**Test account created automatically:**
- Email: `recruiter@equitableats.com`
- Password: `recruiter123`
- Role: `recruiter`

### Step 4: Start Backend

```bash
# From backend/ directory
python main.py
```

**Backend running at:** http://localhost:8000
- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Step 5: Setup Frontend

```bash
cd frontend

# Create .env.local
echo "VITE_API_URL=http://localhost:8000" > .env.local

# Install dependencies (already done, but refresh if needed)
npm install

# Start dev server
npm run dev
```

**Frontend running at:** http://localhost:5174

---

## 🔐 Authentication Flow

### 1️⃣ User Registration

```
Frontend: /auth/register
  ↓
POST /auth/register
  ↓
Backend: Hash password, create user in Supabase
  ↓
Return JWT token + user data
  ↓
Frontend: Save token to localStorage
```

**Test it:**
1. Go to http://localhost:5174/auth/register
2. Create account:
   - Email: `candidate@test.com`
   - Password: `SecurePass123`
   - Role: `candidate`
3. Click "Create Account" → Redirects to home

### 2️⃣ User Login

```
Frontend: /auth/login
  ↓
POST /auth/login
  ↓
Backend: Verify password, create JWT
  ↓
Return token + user data
  ↓
Frontend: Save token, update AuthContext
```

**Test it:**
1. Register account above
2. Logout
3. Go to http://localhost:5174/auth/login
4. Sign in with email/password

### 3️⃣ Protected Routes

```
Route Access Check:
  - Is user logged in? (Check localStorage token)
  - Is user authenticated? (Verify JWT)
  - Does user have required role? (Check role)
  ↓
  ✓ All good → Render page
  ✗ Not authorized → Redirect to login
```

**Route Protection:**

| Route | Role | Access |
|-------|------|--------|
| `/` | Any | Public |
| `/apply` | Candidate | Protected |
| `/tracker` | Candidate | Protected |
| `/hr` | Recruiter | Protected |
| `/demo` | Any | Public |
| `/auth/login` | None | Public |
| `/auth/register` | None | Public |

---

## 🔗 API Integration Points

### Frontend → Backend Communication

#### 1. Authentication
```javascript
// Register
POST /auth/register
Body: {
  email, password, first_name, last_name, role
}
Response: { access_token, token_type, user }

// Login
POST /auth/login
Body: { email, password }
Response: { access_token, token_type, user }

// Get current user
GET /auth/me
Headers: { Authorization: Bearer {token} }
Response: { id, email, first_name, last_name, role, created_at }
```

#### 2. Candidate Routes
```javascript
// Submit application
POST /candidates/apply
Headers: { Authorization: Bearer {token} }
Body: {
  resume_url: "https://...",
  github_url: "https://github.com/...",
  linkedin_url: "https://linkedin.com/..."
}
Response: { id, user_id, status, resume_url, ... }

// Get own application
GET /candidates/me
Headers: { Authorization: Bearer {token} }
Response: { id, status, capability_score, verification_score, decision_matrix }
```

#### 3. Recruiter Routes
```javascript
// List candidates
GET /candidates?status=Reviewing
Headers: { Authorization: Bearer {token} }
Response: [{ id, user_id, status, ... }]

// Get candidate details
GET /candidates/{candidate_id}
Headers: { Authorization: Bearer {token} }
Response: { id, status, decision_matrix, ... }

// Get proofs
GET /candidate-proofs/candidate/{candidate_id}
Headers: { Authorization: Bearer {token} }
Response: [{ id, url, is_verified, forensic_match_score, ... }]
```

---

## 🗂️ Project Structure

```
GSC 2026/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── App.jsx             # Main app with routing
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state management
│   │   ├── components/
│   │   │   ├── TopNavigation.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── utils/
│   │   │   ├── api.ts          # API client (axios)
│   │   │   └── auth.ts         # Auth helpers
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ApplyPage.jsx
│   │   │   ├── TrackerPage.jsx
│   │   │   ├── HRPage.jsx
│   │   │   └── DemoPage.jsx
│   │   └── layouts/
│   │       └── MainLayout.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── backend/                    # FastAPI + Supabase
│   ├── app/
│   │   ├── main.py            # FastAPI app
│   │   ├── config.py          # Settings
│   │   ├── models/
│   │   │   └── database.py    # DB models
│   │   ├── schemas/
│   │   │   └── base.py        # Pydantic schemas
│   │   ├── routes/
│   │   │   ├── auth.py        # Auth endpoints
│   │   │   ├── candidates.py  # Candidate endpoints
│   │   │   └── proofs.py      # Verification endpoints
│   │   ├── middleware/
│   │   │   └── auth.py        # JWT middleware
│   │   └── utils/
│   │       ├── supabase_client.py
│   │       └── security.py
│   ├── main.py                # Entry point
│   ├── requirements.txt
│   ├── database_schema.sql    # PostgreSQL schema
│   ├── .env.example
│   └── README.md
```

---

## 🧪 Testing the Full Flow

### Test Scenario: Candidate Registration → Application

1. **Start both servers:**
   ```bash
   # Terminal 1 (Backend)
   cd backend && python main.py
   
   # Terminal 2 (Frontend)
   cd frontend && npm run dev
   ```

2. **Register as Candidate:**
   - Go to http://localhost:5174/auth/register
   - Email: `alice@example.com`
   - Password: `SecurePass123`
   - Role: `candidate`
   - Submit → Saved to Supabase, JWT token created

3. **Access Candidate Portal:**
   - Redirected to home page (authenticated)
   - NavBar shows "Alice" + logout button
   - Click "Apply" → Can access /apply (role-based)

4. **Submit Application:**
   - Fill in resume URL, GitHub, LinkedIn
   - Click "Submit Application"
   - POST to backend → Saved to candidates table
   - See confirmation message

5. **View Application Status:**
   - Click "Tracker" → /tracker (protected for candidates)
   - See application status, timeline
   - If rejected, see "Defensible Decision Matrix"

### Test Scenario: HR Login & View Candidates

1. **Login as Recruiter:**
   - Go to http://localhost:5174/auth/login
   - Email: `recruiter@equitableats.com`
   - Password: `recruiter123`

2. **Access HR Dashboard:**
   - NavBar shows "Sarah Johnson" (Recruiter)
   - Click "HR Dashboard" → /hr (role-protected)
   - See list of candidates
   - Click candidate → View scores, decision matrix, proofs

---

## 🔒 Security Checklist

- [x] Passwords hashed with bcrypt
- [x] JWT tokens with expiration (24 hours)
- [x] Role-based access control
- [x] Protected API endpoints
- [x] CORS configured
- [x] PII not logged
- [ ] Change JWT_SECRET_KEY in production
- [ ] Use HTTPS in production
- [ ] Set DEBUG=False in production
- [ ] Implement rate limiting (Phase 2)

---

## 🐛 Troubleshooting

### "Cannot POST /auth/register"
- Backend not running? Start it: `python main.py`
- Wrong API URL? Check `.env.local` has correct `VITE_API_URL`

### "Supabase connection error"
- Check `.env` has correct credentials
- Verify database tables exist (run schema SQL)
- Check network access isn't blocked

### "CORS error"
- Backend CORS must include frontend origin
- Check `app/config.py` CORS_ORIGINS list
- Should include `http://localhost:5174`

### "Token expired"
- Logout and login again
- Token expires after 24 hours (configurable)

### "Access Denied" on protected route
- Not authenticated? Go to login
- Wrong role? Recruiters can't access /apply, etc.

---

## 📝 Phase 1 ✓ Completed

**Infrastructure & Database Schema**
- [x] FastAPI backend scaffold
- [x] Supabase PostgreSQL setup
- [x] Database schema (users, candidates, jobs, proofs)
- [x] JWT authentication system
- [x] Role-based access control
- [x] Frontend React setup with Auth
- [x] API integration (Frontend ↔ Backend)

**Ready for Phase 2:**
- Resume upload & Vision AI OCR
- PII masking
- Vertex AI embeddings
- Fast filter (similarity matching)
- Auto-rejection logic

---

## 🔜 Next Steps

1. **Test current setup** - Follow "Testing the Full Flow" above
2. **Verify Supabase tables** - Check data is saving
3. **Test token expiration** - Logout after 24 hours
4. **Review API docs** - Go to http://localhost:8000/docs
5. **Prepare Phase 2** - Resume processing pipeline

---

## 📧 Questions?

1. Check API docs: http://localhost:8000/docs
2. Check frontend console: Browser DevTools → Console
3. Check backend logs: Terminal where `python main.py` runs
4. Review code: Check route/schema files for full implementation

