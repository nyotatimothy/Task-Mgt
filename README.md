# Task Management System

A modern task management application built with .NET 8 Web API backend and React 18 frontend.

**Stack**: .NET 8 Web API + EF Core (SQLite) + JWT Authentication, React 18 + TypeScript + Vite

## Quick Start

### Option 1: Dev Scripts (Recommended)
```bash
# Linux/Mac
./run-dev.sh

# Windows
./run-dev.ps1
```

### Option 2: Manual Start
#### Backend API
```bash
cd backend
dotnet run
```
**API**: http://localhost:5175/swagger

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
**Web**: http://localhost:5173

## Test Credentials

**Admin**: admin@example.com / Admin123!  
**User**: user@example.com / User123!

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks?status=&assignee=` - List tasks with filters
- `POST /api/tasks` - Create task
- `GET /api/tasks/{id}` - Get task by ID
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Users
- `GET /api/users` - List users (for assignee selection)

## Features

**Backend:**
- JWT Authentication with role-based access
- Task CRUD with status workflow (Todo → InProgress → Done)
- Real-time updates via SignalR
- Swagger API documentation
- SQLite database with sample data

**Frontend:**
- React 18 + TypeScript + Vite
- Protected routes and authentication
- 3-column kanban board with filtering
- Real-time task synchronization
- Create/edit task modal

##  Status Transition Rules

Tasks follow a strict workflow:
- **Todo** → **InProgress** ✓
- **InProgress** → **Done** ✓
- **Done** → ❌ (No further transitions)
- Backward transitions are not allowed

## TODOs

1. Drag & drop between columns
2. Server-side pagination  
3. Activity log for task changes

## Real-time Updates

Uses SignalR for live task synchronization with automatic fallback to manual refresh.

## Routes

- `/login` - User login page
- `/register` - User registration page  
- `/app` - Protected task board (requires authentication)
- `/` - Redirects to `/app`
