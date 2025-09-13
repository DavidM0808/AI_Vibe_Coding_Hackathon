from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import uvicorn

# Create FastAPI instance
app = FastAPI(
    title="FastAPI Backend",
    description="A simple FastAPI backend application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Message(BaseModel):
    message: str

class HealthResponse(BaseModel):
    status: str
    message: str

# Routes
@app.get("/", response_model=Dict[str, str])
async def root():
    return {"message": "Welcome to FastAPI Backend!"}

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="healthy", message="API is running successfully")

@app.get("/api/hello", response_model=Message)
async def hello():
    return Message(message="Hello from FastAPI!")

@app.post("/api/echo", response_model=Message)
async def echo(data: Message):
    return Message(message=f"Echo: {data.message}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)