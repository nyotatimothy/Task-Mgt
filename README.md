# Task Management System

A modern task management application built with .NET 8 Web API backend and React 18 frontend.

**Stack**: .NET 8 Web API + EF Core (SQLite) + JWT Authentication, React 18 + TypeScript + Vite

## 🚀 Quick Start

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

## 🔐 Test Credentials

| Role  | Email             | Password   |
|-------|-------------------|------------|
| Admin | admin@example.com | Admin123!  |
| User  | user@example.com  | User123!   |

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

## ✅ What Works Now

**Backend:**
- ✅ JWT Authentication (register/login)
- ✅ User management with roles (USER/ADMIN)
- ✅ Task CRUD operations
- ✅ Task status transitions (Todo → InProgress → Done)
- ✅ Task filtering by status and assignee
- ✅ Permission-based access control
- ✅ Swagger API documentation
- ✅ Database seeding with sample data
- ✅ CORS enabled for frontend

**Frontend:**
- ✅ React 18 + TypeScript + Vite
- ✅ Authentication flow (login/register/logout)
- ✅ Protected routes with JWT
- ✅ 3-column kanban board (Todo/InProgress/Done)
- ✅ Task create/edit modal with full form
- ✅ Task filtering by status, assignee, and text search
- ✅ Real-time connection status indicator
- ✅ Task deletion with confirmation
- ✅ Priority visualization and assignee display
- ✅ SignalR realtime updates (auto-refetch on task changes)

## 🔄 Status Transition Rules

Tasks follow a strict workflow:
- **Todo** → **InProgress** ✓
- **InProgress** → **Done** ✓
- **Done** → ❌ (No further transitions)
- Backward transitions are not allowed

## 📝 TODOs

1. **Drag & Drop**: Implement drag-and-drop between columns with @dnd-kit/core
2. **Pagination**: Add server-side pagination + query params for search
3. **Activity Log**: Track task changes and user activities

## 🔄 Realtime Updates

The application uses **SignalR** for real-time task synchronization:
- ✅ Server broadcasts task changes to all connected clients
- ✅ Frontend automatically refetches tasks when changes occur
- ✅ Connection status indicator (🟢 Live / 🔴 Offline)
- ✅ Graceful fallback to manual refetch if SignalR connection fails
- ✅ Automatic reconnection with visual feedback

## 🚦 Routes

- `/login` - User login page
- `/register` - User registration page  
- `/app` - Protected task board (requires authentication)
- `/` - Redirects to `/app`
