@echo off
echo Starting server and client...

start cmd /k "powershell -Command "Write-Host 'SERVER' -ForegroundColor Green; cd server && npm run dev""
start cmd /k "powershell -Command "Write-Host 'CLIENT' -ForegroundColor Blue; cd client && npm run dev""