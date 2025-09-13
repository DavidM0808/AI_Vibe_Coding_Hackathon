# React Frontend

A React frontend application for the AI Vibe Coding Hackathon project.

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Features

- React 18 with functional components
- Modern CSS styling
- Axios for API communication
- Testing setup with Jest and React Testing Library

## API Integration

The frontend is configured to communicate with the FastAPI backend running on `http://localhost:8000`. Make sure the backend is running before testing API functionality.