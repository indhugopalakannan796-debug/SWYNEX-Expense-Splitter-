
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI application
app = FastAPI(
    title="SWYNEX Expense Splitter API",
    description="AI-powered receipt-based expense splitting application",
    version="1.0.0"
)

# Allow frontend communication during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def home():
    return {
        "message": "Welcome to SWYNEX Expense Splitter API",
        "status": "Running"
    }

# Health check endpoint
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "application": "SWYNEX Expense Splitter"
    }

# Application information endpoint
@app.get("/api/info")
def application_info():
    return {
        "project": "SWYNEX Expense Splitter",
        "version": "1.0.0",
        "description": "AI-powered shared expense management"
    }
