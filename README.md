# Task Management System

A modern task management application built with .NET 8 Web API backend and React 18 frontend.

**Stack**: .NET 8 Web API + EF Core (SQLite) + JWT Authentication, React 18 + TypeScript + Vite

## 🚀 Quick Start

### Backend API
```bash
cd backend
dotnet run
```
**API**: http://localhost:5175/swagger

### Frontend (TODO)
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

- ✅ JWT Authentication (register/login)
- ✅ User management with roles (USER/ADMIN)
- ✅ Task CRUD operations
- ✅ Task status transitions (Todo → InProgress → Done)
- ✅ Task filtering by status and assignee
- ✅ Permission-based access control
- ✅ Swagger API documentation
- ✅ Database seeding with sample data
- ✅ CORS enabled for frontend

## 🔄 Status Transition Rules

Tasks follow a strict workflow:
- **Todo** → **InProgress** ✓
- **InProgress** → **Done** ✓
- **Done** → ❌ (No further transitions)
- Backward transitions are not allowed

## 📝 TODOs

1. **Frontend**: 3-column kanban board (Todo/InProgress/Done) with drag-and-drop
2. **Pagination**: Add pagination to task listings
3. **Activity Log**: Track task changes and user activities
