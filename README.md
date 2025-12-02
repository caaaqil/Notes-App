# Full Stack Notes App

A simple full-stack notes application built with React, Node.js, Express, and MongoDB.

## Features
- Create, Read, Update, Delete (CRUD) notes
- Markdown support
- Categorize notes by folder
- Search and Pagination
- Responsive UI

## Prerequisites
- Node.js (v18+)
- MongoDB (local or via Docker)

## Quick Start (Docker)

1.  **Start Backend & Database**
    ```bash
    docker-compose up --build
    ```

2.  **Start Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

3.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## Manual Setup

### Backend

1.  Navigate to `backend/`
2.  Install dependencies: `npm install`
3.  Create `.env` file (copy from `.env.example`):
    ```bash
    cp .env.example .env
    ```
4.  Start server: `npm run dev`
    - Server runs on `http://localhost:5000`

### Frontend

1.  Navigate to `frontend/`
2.  Install dependencies: `npm install`
3.  Start dev server: `npm run dev`
    - App runs on `http://localhost:5173`

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### API Endpoints
- `GET /api/notes` - List notes
- `POST /api/notes` - Create note
- `GET /api/notes/:id` - Get note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/folders/list` - List folders
# Notes-App
