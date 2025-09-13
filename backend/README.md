# FastAPI Backend

A FastAPI backend application for the AI Vibe Coding Hackathon project.

## Prerequisites

- Python 3.8 or higher
- pip package manager

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your configuration settings if needed.

## Running the Application

1. Start the FastAPI server:
   ```bash
   python main.py
   ```
   or
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. The API will be available at `http://localhost:8000`

3. Interactive API documentation (Swagger UI) is available at `http://localhost:8000/docs`

4. Alternative API documentation (ReDoc) is available at `http://localhost:8000/redoc`

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint
- `GET /api/hello` - Simple hello message
- `POST /api/echo` - Echo back the sent message

## Project Structure

```
backend/
├── main.py
├── requirements.txt
├── .env.example
└── README.md
```

## Features

- FastAPI framework with automatic API documentation
- CORS middleware configured for frontend integration
- Pydantic models for request/response validation
- Health check endpoint
- Environment variable support
- Uvicorn ASGI server

## Development

- The server runs with auto-reload enabled in development mode
- CORS is configured to allow requests from `http://localhost:3000` (React frontend)
- All API endpoints are prefixed with `/api/` for better organization