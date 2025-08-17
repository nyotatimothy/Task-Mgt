# Task Management System (WIP)
Stack: .NET 8 Web API + EF Core (SQLite) + JWT, React 18 + Vite.

## Run
Backend: `cd backend && ASPNETCORE_URLS=http://localhost:5175 dotnet run`  
Frontend: `cd frontend && npm i && npm run dev -- --port 5173`

API: http://localhost:5175/swagger  
Web: http://localhost:5173

## Notes
- First pass focuses on auth + tasks CRUD + 3-column board.
- TODO: seed data, status guard, filters, SignalR.
