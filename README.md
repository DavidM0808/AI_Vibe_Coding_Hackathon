# AI Vibe Coding Hackathon Project

A full-stack web application with multiple frontend and backend implementations.

## Project Structure

```
AI_Vibe_Coding_Hackathon/
├── frontend/          # React JavaScript frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
├── frontend-ts/       # React TypeScript frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── backend/           # FastAPI backend
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── backend-django/    # Django REST API backend
│   ├── myproject/
│   ├── api/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── LICENSE
└── README.md
```

## Available Implementations

### React TypeScript + Django (Recommended)
- **Frontend**: React with TypeScript for type safety
- **Backend**: Django REST Framework for robust API development
- **Location**: `frontend-ts/` and `backend-django/`

### React JavaScript + FastAPI
- **Frontend**: React with JavaScript
- **Backend**: FastAPI for high-performance API
- **Location**: `frontend/` and `backend/`

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn
- pip

### Quick Start (React TypeScript + Django)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd AI_Vibe_Coding_Hackathon
   ```

2. Set up the Django backend:
   ```bash
   cd backend-django
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   python manage.py migrate
   python manage.py runserver
   ```

3. Set up the React TypeScript frontend (in a new terminal):
   ```bash
   cd frontend-ts
   npm install
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Alternative Setup (React JavaScript + FastAPI)

1. Set up the FastAPI backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   cp .env.example .env
   uvicorn main:app --reload
   ```

2. Set up the React frontend (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Technology Stack

### React TypeScript + Django Implementation

**Frontend (frontend-ts/)**
- React.js with TypeScript
- HTML5/CSS3
- TypeScript for type safety
- Axios for API calls
- Modern React hooks and functional components

**Backend (backend-django/)**
- Django 4.2.7
- Django REST Framework
- Python 3.8+
- SQLite (development) / PostgreSQL (production)
- Django CORS Headers
- Environment variable management

### React JavaScript + FastAPI Implementation

**Frontend (frontend/)**
- React.js
- HTML5/CSS3
- JavaScript (ES6+)
- Axios for API calls

**Backend (backend/)**
- FastAPI
- Python
- Pydantic for data validation
- Uvicorn ASGI server

## API Documentation

### Django REST API (backend-django/)

Once the Django backend is running, you can access:

- **API Root**: `http://localhost:8000/api/`
- **Django Admin**: `http://localhost:8000/admin/`
- **Health Check**: `http://localhost:8000/api/health/`

#### Available Endpoints

**Health & Utility**
- `GET /api/` - API root with endpoint list
- `GET /api/health/` - Health check endpoint
- `GET /api/hello/` - Simple hello message
- `POST /api/echo/` - Echo back the sent message

**Messages**
- `GET /api/messages/` - List all messages
- `POST /api/messages/` - Create a new message
- `GET /api/messages/{id}/` - Retrieve a specific message
- `PUT /api/messages/{id}/` - Update a specific message
- `DELETE /api/messages/{id}/` - Delete a specific message

**Categories**
- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create a new category
- `GET /api/categories/{id}/` - Retrieve a specific category
- `PUT /api/categories/{id}/` - Update a specific category
- `DELETE /api/categories/{id}/` - Delete a specific category

### FastAPI Documentation (backend/)

Once the FastAPI backend is running, you can access:

- **Interactive API docs**: `http://localhost:8000/docs`
- **Alternative API docs**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

#### Available Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /items` - Get all items
- `POST /items` - Create new item
- `GET /items/{item_id}` - Get specific item
- `PUT /items/{item_id}` - Update specific item
- `DELETE /items/{item_id}` - Delete specific item

## Development

1. Start the backend server first (port 8000)
2. Start the frontend development server (port 3000)
3. The frontend is configured to communicate with the backend via CORS

## Contributing

Please read the individual README files in the `frontend/` and `backend/` directories for detailed setup and development instructions.

## License

This project is licensed under the terms specified in the LICENSE file.
This repository contains work for the AI Vibe Coding Hackathon in San Francisco, on Sept 13th, 2025.
