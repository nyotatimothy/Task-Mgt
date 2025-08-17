#!/usr/bin/env bash
set -e
API=${API:-http://localhost:5175}
email=${1:-admin@example.com}
pass=${2:-Admin123!}
TOKEN=$(curl -s -X POST "$API/api/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"$email\",\"password\":\"$pass\"}" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
test -n "$TOKEN" || { echo "login failed"; exit 1; }
echo "token: ${TOKEN:0:24}..."
echo "users:"
curl -s -H "Authorization: Bearer $TOKEN" "$API/api/users" | head -c 200; echo
echo "tasks (first 400 chars):"
curl -s -H "Authorization: Bearer $TOKEN" "$API/api/tasks" | head -c 400; echo
