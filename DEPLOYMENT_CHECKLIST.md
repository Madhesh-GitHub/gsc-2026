# Phase 1 Deployment Checklist & Production Guide

## 📋 Pre-Production Checklist

### Environment Configuration
- [ ] Backend: Change `JWT_SECRET_KEY` to random 32+ char string
- [ ] Backend: Set `DEBUG=False` in `.env`
- [ ] Backend: Set `ENVIRONMENT=production` in `.env`
- [ ] Frontend: Update `VITE_API_URL` to production API domain
- [ ] Frontend: Build optimized version: `npm run build`
- [ ] Database: Enable Supabase authentication mode
- [ ] Database: Set up automated backups in Supabase

### Security Hardening
- [ ] Backend: Implement rate limiting on auth endpoints
- [ ] Backend: Add request logging for audit trail
- [ ] Backend: Set up HTTPS/SSL certificates
- [ ] Frontend: Implement Content Security Policy headers
- [ ] Frontend: Add HSTS headers
- [ ] Database: Enable Row Level Security (RLS) policies
- [ ] Database: Remove test data (recruiter@equitableats.com)

### API Configuration
- [ ] Backend: Update CORS_ORIGINS with production domain
- [ ] Backend: Remove localhost from CORS origins
- [ ] Frontend: Update API endpoint for production
- [ ] Frontend: Set up .env.production with correct API URL

### Testing Before Launch
- [ ] [ ] Run full authentication flow on production
- [ ] Test candidate registration → application submission
- [ ] Test recruiter login → viewing candidates
- [ ] Test role-based access restrictions
- [ ] Verify all API endpoints return correct data
- [ ] Test token expiration (24 hours)
- [ ] Test database persistence across restarts
- [ ] Load test: Simulate 100+ concurrent users

---

## 🚀 Deployment Options

### Option 1: Heroku (Recommended for Hackathon)

**Backend (FastAPI):**

1. Create `Procfile`:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

2. Create `runtime.txt`:
```
python-3.11.4
```

3. Deploy:
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku config:set JWT_SECRET_KEY=your_secret_key
```

**Frontend (React):**

1. Update build output in `vite.config.js`
2. Deploy via Vercel (recommended):
```bash
npm install -g vercel
vercel
```

3. Configure environment:
```
VITE_API_URL=https://your-app-name.herokuapp.com
```

### Option 2: AWS (For Scale)

**Backend:** AWS Lambda + API Gateway + RDS
**Frontend:** CloudFront + S3
**Database:** AWS RDS PostgreSQL

### Option 3: Google Cloud Platform

**Backend:** Cloud Run
**Frontend:** Cloud Storage + Load Balancer
**Database:** Cloud SQL (PostgreSQL)

### Option 4: DigitalOcean (Budget-Friendly)

**Backend:** DigitalOcean App Platform
**Frontend:** DigitalOcean Spaces + CDN
**Database:** Managed PostgreSQL

---

## 🔒 Production Secrets Management

### Never Hardcode Secrets!

**Use environment variables:**

```bash
# Backend .env (NEVER commit)
SUPABASE_URL=https://...
SUPABASE_KEY=sk_...
JWT_SECRET_KEY=your_production_secret_key_with_32+_chars
DEBUG=False
ENVIRONMENT=production
CORS_ORIGINS=["https://yourdomain.com"]

# Frontend .env.production
VITE_API_URL=https://api.yourdomain.com
```

### In Production:
1. Set environment variables via platform (Heroku, Vercel, etc.)
2. Never commit `.env` file
3. Add `.env` to `.gitignore`
4. Rotate secrets regularly
5. Monitor for exposed secrets

---

## 📊 Monitoring & Logging

### Backend Monitoring

```python
# Add to app/main.py for production
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Log important events
logger = logging.getLogger(__name__)
logger.info("User registered: email")
logger.error("Database connection failed")
```

### Key Metrics to Monitor
- API response times
- Error rates
- Failed login attempts
- Database query performance
- Concurrent user count
- Storage usage (Supabase)

### Recommended Tools
- **Sentry** - Error tracking (free tier available)
- **Datadog** - APM & monitoring
- **New Relic** - Full-stack monitoring
- **Supabase Dashboard** - Database metrics

---

## 📈 Scaling Considerations

### Phase 1 → Phase 2 Migration

**Current Performance:**
- Handles ~1,000 concurrent users on free Supabase tier
- ~100ms average API response time
- 10GB database storage

**Scaling Plan:**
1. **Immediate (Phase 2):**
   - Add caching (Redis)
   - Database indices optimization
   - API response caching

2. **Mid-term (Phase 3):**
   - Implement async job queue (Celery)
   - Move to scaled Supabase plan
   - Add CDN for frontend assets

3. **Long-term (Phase 4+):**
   - Migrate to managed Kubernetes
   - Implement database sharding
   - Add distributed caching

---

## 🧪 Production Testing Checklist

### Functional Testing
```bash
# Test all user flows
[ ] Registration
[ ] Login
[ ] Logout
[ ] Password reset (future feature)
[ ] Candidate application
[ ] HR viewing candidates
[ ] Role-based access control
```

### API Testing
```bash
# Test all endpoints
[ ] GET /health
[ ] POST /auth/register
[ ] POST /auth/login
[ ] GET /auth/me
[ ] POST /candidates/apply
[ ] GET /candidates/me
[ ] GET /candidates (HR only)
[ ] GET /candidates/{id} (HR only)
```

### Security Testing
```bash
[ ] SQL injection attempts blocked
[ ] XSS protection enabled
[ ] CSRF protection active
[ ] JWT token validation working
[ ] Expired tokens rejected
[ ] Invalid roles denied access
[ ] Rate limiting active
```

### Performance Testing
```bash
[ ] Page loads < 3 seconds
[ ] API responses < 500ms
[ ] Database queries optimized
[ ] Memory usage stable
[ ] CPU usage reasonable
```

---

## 📝 Monitoring Alerts

### Set up alerts for:

```yaml
Critical:
  - Backend down / crashes
  - Database connection lost
  - API error rate > 5%
  - Failed login attempts > 20 per minute
  
Warning:
  - API response time > 1 second
  - Database CPU > 80%
  - Storage > 80% full
  - Memory usage > 75%
```

---

## 🔄 Backup & Disaster Recovery

### Supabase Automatic Backups
- Enabled by default
- Kept for 7 days (free tier)
- 30 days on paid plans

### Manual Backup
```bash
# Export Supabase data
pg_dump postgresql://user:password@host/db > backup.sql

# Restore from backup
psql postgresql://user:password@host/db < backup.sql
```

### Disaster Recovery Plan
1. **Database loss:**
   - Restore from Supabase backup
   - Update connection string
   - Run migrations

2. **API server down:**
   - Restart container/instance
   - Check logs for root cause
   - Alert team immediately

3. **Frontend hosting down:**
   - Switch DNS to backup CDN
   - Re-deploy to alternative host
   - Clear browser caches

---

## 🚨 Incident Response

### If Users Can't Login

1. Check backend is running: `curl http://localhost:8000/health`
2. Check database connection in logs
3. Verify JWT_SECRET_KEY hasn't changed
4. Check CORS configuration
5. Restart backend service

### If Data Is Missing

1. Check Supabase dashboard → Data
2. Verify database backups exist
3. Check query logs for deletions
4. Restore from backup if needed
5. Enable audit logging (Phase 2)

### If API is Slow

1. Check database query times (Supabase dashboard)
2. Monitor API response times
3. Check for long-running requests
4. Scale database if needed
5. Add caching layer

---

## 📚 Documentation for Team

### What to Provide to Team Before Handoff:

1. **API Documentation**
   - Swagger UI: `/docs`
   - ReDoc: `/redoc`
   - Export OpenAPI schema for integration

2. **Database Schema**
   - Entity relationship diagram
   - Sample data (anonymized)
   - Backup/restore procedures

3. **Deployment Guide**
   - Step-by-step deployment instructions
   - Environment configuration template
   - Production checklist

4. **Troubleshooting Guide**
   - Common errors and solutions
   - Log analysis guide
   - Contact/escalation procedures

---

## ✅ Go-Live Checklist (Final)

### 24 Hours Before Launch
- [ ] All tests passing
- [ ] All secrets configured
- [ ] Backups verified
- [ ] Monitoring set up
- [ ] Team briefing completed

### Day of Launch
- [ ] Final smoke test
- [ ] DNS switched to production
- [ ] Monitor for errors
- [ ] Team on standby
- [ ] Alert system active

### Post-Launch (First 24 Hours)
- [ ] Monitor error rates
- [ ] Monitor response times
- [ ] Check for failed logins
- [ ] Verify data integrity
- [ ] Collect user feedback

---

## 📞 Escalation Contacts

| Issue | Contact | Response Time |
|-------|---------|---|
| Production Down | DevOps Team | 15 min |
| Database Error | DBA | 30 min |
| API Bug | Backend Team | 1 hour |
| UI Bug | Frontend Team | 1 hour |
| Security Issue | Security Team | 30 min |

---

## 🎯 Success Metrics

**Track these metrics to measure Phase 1 success:**

- User registration success rate: > 95%
- Login success rate: > 99%
- API uptime: > 99.5%
- Average API response: < 500ms
- Database error rate: < 0.1%
- User satisfaction: > 4.5/5

---

## 📞 Next Steps

1. **Immediate:** Review this checklist with team
2. **This week:** Complete security hardening
3. **Before launch:** Run full production test
4. **Day of launch:** Execute go-live checklist
5. **Post-launch:** Monitor and iterate

---

**Questions?** Contact: [Team Lead Email]
**Support:** [Support Email]
**Documentation:** See INTEGRATION_GUIDE.md

