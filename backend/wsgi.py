"""
PythonAnywhere WSGI entry point.
"""
import sys
import os

project_home = '/home/codrithm/ems/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:////home/codrithm/ems/backend/coderithm_events.db")
os.environ.setdefault("SECRET_KEY", os.environ.get("SECRET_KEY", "CHANGE-ME"))
os.environ.setdefault("DEBUG", "False")
os.environ.setdefault("FRONTEND_URL", "https://codrithm.pythonanywhere.com")
os.environ.setdefault("APP_URL", "https://codrithm.pythonanywhere.com")

import sqlite3
db_path = '/home/codrithm/ems/backend/coderithm_events.db'
if not os.path.exists(db_path):
    open(db_path, 'w').close()

from a2wsgi import ASGIMiddleware
from app.main import app

application = ASGIMiddleware(app)
