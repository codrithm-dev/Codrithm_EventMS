# PythonAnywhere Deployment Guide

## Step-by-Step Setup

### 1. Create PythonAnywhere Account
- Go to https://www.pythonanywhere.com/pricing/ (free "Hacker" tier)
- Sign up with your email

### 2. Upload Your Code
**Option A: Git (recommended)**
```bash
# On PythonAnywhere Bash console:
cd ~
git clone https://github.com/yourusername/yourrepo.git mysite
cd mysite/backend
```

**Option B: File Upload**
1. Go to "Files" tab in PythonAnywhere dashboard
2. Create folder: `mysite`
3. Upload everything from your `backend/` folder into `~/mysite/`

### 3. Set Up Virtual Environment
```bash
cd ~/mysite
python3.10 -m venv venv
source venv/bin/activate
cd backend
pip install -r requirements.txt
```

### 4. Configure Web App
1. Go to **Web** tab in PythonAnywhere dashboard
2. Click **Add new web app**
3. Choose **Manual configuration** → **Python 3.10**
4. Set these values:

**Source code:** `/home/yourusername/mysite/backend`

**Working directory:** `/home/yourusername/mysite/backend`

**WSGI configuration file:** `/home/yourusername/mysite/wsgi.py`

### 5. Set Environment Variables
In the **Web** tab, scroll to **Environment variables** and add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `sqlite+aiosqlite:///./coderithm_events.db` |
| `SECRET_KEY` | (generate a random string, e.g. `python3 -c "import secrets; print(secrets.token_urlsafe(32))"`) |
| `DEBUG` | `False` |
| `FRONTEND_URL` | `https://yourusername.pythonanywhere.com` |
| `APP_URL` | `https://yourusername.pythonanywhere.com` |
| `RESEND_API_KEY` | (optional, for emails) |

### 6. Set WSGI Path
In the Web tab → **WSGI configuration file**, edit it to:
```python
import sys
import os

project_home = '/home/yourusername/mysite'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./coderithm_events.db")
os.environ.setdefault("SECRET_KEY", "your-secret-key")
os.environ.setdefault("DEBUG", "False")

from a2wsgi import ASGIMiddleware
from app.main import app

application = ASGIMiddleware(app)
```

### 7. Reload Your App
Click the **Reload** button on the Web tab.

### 8. Test
Visit: `https://yourusername.pythonanywhere.com/docs`

You should see the Swagger API docs!

---

## File Structure on PythonAnywhere
```
~/mysite/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── api/
│   │   ├── services/
│   │   └── core/
│   ├── wsgi.py
│   ├── requirements.txt
│   └── .env
└── venv/
```

## Troubleshooting

**Error: ModuleNotFoundError**
- Make sure `Source code` in Web tab points to `~/mysite/backend`

**Error: Database not found**
- Check `DATABASE_URL` environment variable is set correctly

**Static files not loading**
- Add to Web tab → Static files:
  - URL: `/static/`
  - Directory: `/home/yourusername/mysite/backend/static`

**502 Bad Gateway**
- Check Error logs in Web tab
- Make sure all environment variables are set

## Limitations (Free Tier)
- App sleeps after 30 min of inactivity (wakes on first request, ~5-10 sec)
- No background tasks (Celery won't work — skip Redis/Celery on free tier)
- 512 MB storage limit
- CPU: 100 seconds/day

## Notes for Your Team (Frontend Integration)
The API base URL for your frontend will be:
```
https://yourusername.pythonanywhere.com/api/v1/
```

All endpoints work the same as local. Just change the base URL in your frontend API config.
