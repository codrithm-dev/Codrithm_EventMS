# Codrithm Event Management Platform

Event discovery, registration, and management platform built with Next.js frontend and FastAPI backend.

## Project Structure

```
├── frontend/          # Next.js + TypeScript + Tailwind CSS
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/           # FastAPI + SQLAlchemy + SQLite
│   ├── app/
│   ├── wsgi.py
│   ├── requirements.txt
│   └── ...
└── README.md
```

## Local Development

### Backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Docs

Once backend is running: http://localhost:8000/docs

## Deploy

- **Backend**: See `backend/PYTHONANYWHERE.md`
- **Frontend**: Deploy to Vercel/Netlify, set `NEXT_PUBLIC_API_URL` to your backend URL
