# PowerShell script for Windows development environment

Write-Host "🚀 Starting Task Management Development Environment" -ForegroundColor Yellow
Write-Host ""

# Start backend
Write-Host "Starting backend API on http://localhost:5175..." -ForegroundColor Blue
Set-Location backend
$env:ASPNETCORE_ENVIRONMENT = "Development"
$env:ASPNETCORE_URLS = "http://localhost:5175"
$backendProcess = Start-Process "dotnet" -ArgumentList "run" -PassThru -NoNewWindow
Set-Location ..

Write-Host "Backend PID: $($backendProcess.Id)"
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting frontend UI on http://localhost:5173..." -ForegroundColor Blue
Set-Location frontend
$frontendProcess = Start-Process "npm" -ArgumentList "run", "dev", "--", "--port", "5173" -PassThru -NoNewWindow
Set-Location ..

Write-Host "Frontend PID: $($frontendProcess.Id)"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🎉 Development servers started!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 UI:  http://localhost:5173"
Write-Host "🔗 API: http://localhost:5175/swagger"
Write-Host ""
Write-Host "🔐 Test Credentials:"
Write-Host "   Admin: admin@example.com / Admin123!"
Write-Host "   User:  user@example.com / User123!"
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host ""
    Write-Host "Stopping servers..."
    Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
}
