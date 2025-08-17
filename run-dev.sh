#!/bin/bash

echo "🚀 Starting Task Management Development Environment"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Start backend
echo -e "${BLUE}Starting backend API on http://localhost:5175...${NC}"
cd backend
export PATH="$PATH:$HOME/.dotnet:$HOME/.dotnet/tools"
export DOTNET_ROOT="$HOME/.dotnet"
ASPNETCORE_ENVIRONMENT=Development ASPNETCORE_URLS=http://localhost:5175 dotnet run &
BACKEND_PID=$!
cd ..

echo "Backend PID: $BACKEND_PID"
sleep 3

# Start frontend
echo -e "${BLUE}Starting frontend UI on http://localhost:5173...${NC}"
cd frontend
npm run dev -- --port 5173 &
FRONTEND_PID=$!
cd ..

echo "Frontend PID: $FRONTEND_PID"
sleep 3

echo ""
echo -e "${GREEN}🎉 Development servers started!${NC}"
echo ""
echo "📱 UI:  http://localhost:5173"
echo "🔗 API: http://localhost:5175/swagger"
echo ""
echo "🔐 Test Credentials:"
echo "   Admin: admin@example.com / Admin123!"
echo "   User:  user@example.com / User123!"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap 'echo ""; echo "Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT
wait
