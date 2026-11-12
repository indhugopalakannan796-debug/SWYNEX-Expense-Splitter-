
# SWYNEX Backend

This directory contains the backend API for the AI-powered expense splitting application.

## Technologies
- Python
- FastAPI
- SQLite
- SQLAlchemy

## Setup

1. Create a virtual environment:

   python -m venv venv

2. Activate it on Windows:

   venv\Scripts\activate

3. Install dependencies:

   pip install -r requirements.txt

4. Start the development server:

   uvicorn main:app --reload

## API Documentation

After starting the server, visit:

http://127.0.0.1:8000/docs

## Health Check

GET /api/health
