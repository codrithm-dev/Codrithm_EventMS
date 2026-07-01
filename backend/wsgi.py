"""
PythonAnywhere WSGI entry point.
Path: /home/yourusername/mysite/wsgi.py
"""
import sys
import os

# Add your project directory to sys.path
project_home = os.path.expanduser("~/mysite")
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set environment variables
os.environ.setdefault("DATABASE_URL", "sqlite:///./coderithm_events.db")
os.environ.setdefault("SECRET_KEY", "change-this-in-production")
os.environ.setdefault("DEBUG", "False")

from a2wsgi import ASGIMiddleware
from app.main import app

application = ASGIMiddleware(app)
