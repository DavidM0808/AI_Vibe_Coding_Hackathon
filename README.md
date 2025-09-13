# AI Vibe Coding Hackathon Project

A full-stack web application with React frontend and FastAPI backend.

## Project Structure

```
AI_Vibe_Coding_Hackathon/
├── frontend/          # React frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
├── backend/           # FastAPI backend application
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── LICENSE
└── README.md
```

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   # venv\Scripts\activate   # On Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   python main.py
   ```

   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## Technology Stack

### Frontend
- **React 18** - Modern React with functional components
- **Axios** - HTTP client for API communication
- **CSS3** - Modern styling
- **Jest & React Testing Library** - Testing framework

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation using Python type hints
- **CORS Middleware** - Cross-origin resource sharing

## API Documentation

Once the backend is running, you can access:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Development

1. Start the backend server first (port 8000)
2. Start the frontend development server (port 3000)
3. The frontend is configured to communicate with the backend via CORS

## Available API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/hello` - Hello message
- `POST /api/echo` - Echo service

## Contributing

Please read the individual README files in the `frontend/` and `backend/` directories for detailed setup and development instructions.

## License

This project is licensed under the terms specified in the LICENSE file.
This repository contains work for the AI Vibe Coding Hackathon in San Francisco, on Sept 13th, 2025.
