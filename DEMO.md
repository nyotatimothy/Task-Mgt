# Demo Script (1–2 min)

## Start
Backend:
  cd backend
  ASPNETCORE_ENVIRONMENT=Development ASPNETCORE_URLS=http://localhost:5175 dotnet run
Frontend:
  cd frontend
  npm i
  npm run dev -- --port 5173

## Flow
1) Login as admin@example.com / Admin123! (or register new)
2) Create a task ("Write README"), Priority 3, assign to user
3) Move status Todo → InProgress → Done
4) Filter by assignee and search "readme"
5) Open a second tab to see realtime update (if hub is connected)

## Useful URLs
UI:  http://localhost:5173
API: http://localhost:5175/swagger

## Notes
- Status guard enforced: Todo→InProgress→Done (same→same allowed)
- If realtime is flaky, the UI refetches after writes (on purpose)
- TODO (next pass): drag-and-drop, pagination, activity log
