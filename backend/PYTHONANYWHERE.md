# PythonAnywhere Deployment Guide

## Step 1: Create Account
- Go to https://www.pythonanywhere.com/pricing/
- Sign up (free **Hacker** tier)

---

## Step 2: Clone Your Repo
Open **Bash console** from the dashboard:
```bash
cd ~
git clone https://github.com/codrithm-dev/Codrithm_EventMS.git mysite
```

---

## Step 3: Install Dependencies
```bash
cd ~/mysite/backend
python3.10 -m venv ../venv
source ../venv/bin/activate
pip install -r requirements.txt
```

---

## Step 4: Create Web App
1. Go to **Web** tab
2. Click **"Add a new web app"**
3. Choose **"Manual configuration"**
4. Choose **Python 3.10**

---

## Step 5: Set Paths (Web tab)

| Setting | Value |
|---------|-------|
| **Source code** | `/home/yourusername/mysite/backend` |
| **Working directory** | `/home/yourusername/mysite/backend` |

> Replace `yourusername` with your actual PythonAnywhere username

---

## Step 6: Edit WSGI File

1. In **Web** tab → click the **WSGI file path** (blue link)
2. **Delete everything** and paste this:

```python
import sys
import os

project_home = '/home/yourusername/mysite/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./coderithm_events.db")
os.environ.setdefault("SECRET_KEY", "CHANGE-ME")
os.environ.setdefault("DEBUG", "False")

from a2wsgi import ASGIMiddleware
from app.main import app

application = ASGIMiddleware(app)
```

3. Click **Save**

> ⚠️ Replace `yourusername` with your actual username

---

## Step 7: Add Environment Variables (Web tab)

1. Scroll down to **"Environment variables"** section
2. Click **"Add a new variable"** for each one below
3. Add these **exactly**:

### Required Variables

| # | Key | Value | Notes |
|---|-----|-------|-------|
| 1 | `DATABASE_URL` | `sqlite+aiosqlite:///./coderithm_events.db` | SQLite database |
| 2 | `SECRET_KEY` | *(see below)* | JWT secret key |
| 3 | `DEBUG` | `False` | Disable debug mode |
| 4 | `FRONTEND_URL` | `https://yourusername.pythonanywhere.com` | Your app URL |
| 5 | `APP_URL` | `https://yourusername.pythonanywhere.com` | Your app URL |

### Optional Variables (add later if needed)

| # | Key | Value | Notes |
|---|-----|-------|-------|
| 6 | `RESEND_API_KEY` | *(from resend.com)* | For email notifications |
| 7 | `CLOUDINARY_CLOUD_NAME` | *(from cloudinary.com)* | For banner uploads |
| 8 | `CLOUDINARY_API_KEY` | *(from cloudinary.com)* | For banner uploads |
| 9 | `CLOUDINARY_API_SECRET` | *(from cloudinary.com)* | For banner uploads |

### How to Generate SECRET_KEY

Run this in Bash console to generate a random key:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```
Copy the output and paste it as the value for `SECRET_KEY`.

---

## Step 8: Final Settings (Web tab)

| Setting | Value |
|---------|-------|
| **Python file** | `/home/yourusername/mysite/backend/wsgi.py` |
| **Working directory** | `/home/yourusername/mysite/backend` |
| **Python version** | 3.10 |

---

## Step 9: Reload & Test

1. Click the big green **"Reload"** button
2. Wait 10-15 seconds
3. Visit: `https://yourusername.pythonanywhere.com/docs`

You should see Swagger API docs!

---

## Quick Visual Guide

### Adding Env Vars (PythonAnywhere Dashboard)
```
Web Tab
  └── Environment variables
        ├── [Key]              [Value]
        ├── DATABASE_URL    →  sqlite+aiosqlite:///./coderithm_events.db
        ├── SECRET_KEY      →  abc123xyz...
        ├── DEBUG           →  False
        ├── FRONTEND_URL    →  https://yourusername.pythonanywhere.com
        └── APP_URL         →  https://yourusername.pythonanywhere.com
```

---

## Troubleshooting

### Error: ModuleNotFoundError
```
ModuleNotFoundError: No module named 'app'
```
**Fix:** Make sure Source code points to `/home/yourusername/mysite/backend`

---

### Error: 502 Bad Gateway
**Fix:** Check Error logs (Web tab → Logs section)
- Usually means env vars are missing or WSGI path is wrong

---

### Error: Database not found
**Fix:** Make sure `DATABASE_URL` env var is set exactly:
```
sqlite+aiosqlite:///./coderithm_events.db
```

---

### Static files not loading
**Fix:** In Web tab → **Static files**, add:
| URL | Directory |
|-----|-----------|
| `/static/` | `/home/yourusername/mysite/backend/static` |

---

## File Structure on PythonAnywhere
```
~/mysite/
├── backend/
│   ├── app/
│   │   ├── main.py          ← FastAPI app
│   │   ├── models/           ← Database models
│   │   ├── schemas/          ← Pydantic schemas
│   │   ├── api/v1/           ← API routes
│   │   ├── services/         ← Business logic
│   │   └── core/             ← Auth, email, QR
│   ├── wsgi.py              ← WSGI entry point
│   ├── requirements.txt
│   └── .env.example
└── venv/                     ← Virtual environment
```

---

## Free Tier Limits
- App sleeps after **30 min** idle (wakes in ~5 sec on first request)
- **No Celery/Redis** (email still works via Resend API)
- **512 MB** storage
- **100 seconds** CPU/day
- Your app URL: `https://yourusername.pythonanywhere.com`

---

## Frontend Integration

Your frontend team deploys on **Vercel** or **Netlify** (free).

Set this in frontend `.env.production`:
```bash
# For Vite/React
VITE_API_URL=https://yourusername.pythonanywhere.com

# For Next.js
NEXT_PUBLIC_API_URL=https://yourusername.pythonanywhere.com
```

Then call API like:
```javascript
const res = await fetch(`${API_URL}/api/v1/events`);
```

---

## After Deploy Checklist
- [ ] Visit `https://yourusername.pythonanywhere.com/docs` → Swagger loads
- [ ] Visit `https://yourusername.pythonanywhere.com/health` → returns `{"status":"ok"}`
- [ ] Test register: POST to `/api/v1/auth/register`
- [ ] Test login: POST to `/api/v1/auth/login`
- [ ] Test events: GET to `/api/v1/events`
