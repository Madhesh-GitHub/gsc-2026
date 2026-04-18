# ⚡ Quick Reference - Start Here!

## 🚀 Get Everything Running in 3 Steps

### Step 1: Backend (Terminal 1)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows OR source venv/bin/activate

pip install -r requirements.txt

# Create .env file
copy .env.example .env

# EDIT .env with your Supabase credentials:
# SUPABASE_URL=https://nnrbvnbbqevziuhknram.supabase.co
# SUPABASE_KEY=your_anon_key
# SUPABASE_SERVICE_KEY=your_service_key
# JWT_SECRET_KEY=your_random_secret_string

python main.py
```

**Output should show:**
```
✓ Supabase client initialized
✓ Application started successfully
VITE v8... ready in 746 ms
  Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Database Setup (1 time only)
1. Go to: https://nnrbvnbbqevziuhknram.supabase.co
2. Click: **SQL Editor** → **New query**
3. Paste: Contents of `backend/database_schema.sql`
4. Click: **Run** ✓
5. **Done!** Tables created in Supabase

### Step 3: Frontend (Terminal 2)
```bash
cd frontend

echo VITE_API_URL=http://localhost:8000 > .env.local

npm run dev
```

**Output should show:**
```
VITE v8.0.8 ready in 500 ms

➜ Local: http://localhost:5174/
```

---

## ✅ Verify It Works

1. Open browser: **http://localhost:5174**
2. Click "Register" (top right)
3. Fill in:
   - Email: `test@example.com`
   - Password: `TestPass123` (8+ chars)
   - First Name: `Test`
   - Last Name: `User`
   - Role: `Candidate`
4. Click "Create Account"
5. **You're logged in!** ✓

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5174 | React app |
| Backend | http://localhost:8000 | API server |
| API Docs | http://localhost:8000/docs | Swagger UI |
| API ReDoc | http://localhost:8000/redoc | Alternative docs |
| Supabase | https://app.supabase.com | Database dashboard |

---

## 📝 Test Account (Pre-created)

```
Email: recruiter@equitableats.com
Password: recruiter123
Role: Recruiter
```

Use this to test recruiter features like `/hr` dashboard.

---

## 🔧 Troubleshooting Quick Fixes

### "ModuleNotFoundError: No module named 'fastapi'"
```bash
pip install -r requirements.txt
```

### "Port 8000 already in use"
```bash
# Find what's using it
netstat -ano | findstr :8000

# Use different port
python main.py --port 8001
# Then update frontend: VITE_API_URL=http://localhost:8001
```

### "Supabase connection error"
1. Check `.env` has correct URL and keys
2. Verify Supabase project is active
3. Run database schema (step 2 above)

### "CORS error" in browser
1. Check backend is running
2. Check frontend `.env.local` has `VITE_API_URL=http://localhost:8000`
3. Restart frontend: `npm run dev`

### "Can't connect to database"
1. Is schema SQL executed? (Check Supabase SQL Editor)
2. Do keys in `.env` match Supabase dashboard?
3. Try creating new Supabase project if stuck

---

## 📂 Key Files to Know

```
backend/
├── main.py                 ← Run this!
├── app/routes/auth.py      ← Login/register logic
├── app/routes/candidates.py ← Application endpoints
└── database_schema.sql     ← Run in Supabase

frontend/
├── src/App.jsx             ← Router setup
├── src/context/AuthContext.jsx ← Auth state
└── src/utils/api.ts        ← API client
```

---

## 🎯 What You Can Do Now

### As Candidate
- [x] Register account
- [x] Login/logout
- [x] View "Apply" page
- [x] View "Tracker" page
- [x] Cannot access "/hr" (recruiter only)

### As Recruiter
- [x] Login as `recruiter@equitableats.com`
- [x] View "HR Dashboard"
- [x] Cannot access "/apply" (candidate only)

### Full Flow
- [x] Register → Login → Submit Application → View Status

---

## 🚀 Production Deployment

**Later, before going live:**

Read: `DEPLOYMENT_CHECKLIST.md`

Key steps:
1. Change `JWT_SECRET_KEY` to something random
2. Set `DEBUG=False` in backend
3. Deploy backend (Heroku/AWS/GCP)
4. Deploy frontend (Vercel/Netlify)
5. Update `VITE_API_URL` to production API
6. Run security checklist

---

## 💡 Pro Tips

### Keep Things Simple
- Use test@example.com for local testing
- Use Supabase free tier (works fine for Phase 1-2)
- Keep 2 terminals open (backend + frontend)

### Common Tasks
```bash
# Restart backend
# Terminal 1: Ctrl+C, then: python main.py

# Restart frontend  
# Terminal 2: Ctrl+C, then: npm run dev

# View API documentation
# Open: http://localhost:8000/docs

# Check database
# Go to: https://app.supabase.com → Database
```

### Development Tips
- Frontend auto-reloads on save (hot reload)
- Backend has auto-reload (--reload flag)
- API docs update automatically
- Check browser console for errors (F12)

---

## 📞 Debugging Strategy

1. **Is backend running?** Check http://localhost:8000/health
2. **Is database working?** Check Supabase dashboard
3. **Is frontend starting?** Check terminal for errors
4. **API not working?** Check http://localhost:8000/docs
5. **Authentication failing?** Check `.env` setup
6. **Getting CORS error?** Check frontend `VITE_API_URL`

---

## ✨ Next: Phase 2

Once this is solid, next phase adds:
1. Resume upload (Google Drive/S3)
2. Vision AI for text extraction
3. Semantic embeddings
4. Smart filtering
5. Decision matrices

**But Phase 1 is complete and working!**

---

## 📚 Documentation Files

- **QUICKSTART.md** - 5-minute setup (this gives more detail)
- **INTEGRATION_GUIDE.md** - Complete integration walkthrough
- **DEPLOYMENT_CHECKLIST.md** - Going to production
- **PHASE_1_SUMMARY.md** - Everything that was built

---

**🎉 You're ready! Start those servers and test it out!**

Questions? Check the docs or look at http://localhost:8000/docs

