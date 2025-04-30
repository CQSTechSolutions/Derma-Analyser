@echo off
echo Starting Derma Analyzer Application...

echo Starting Email Server...
start cmd /k "cd server && npm start"

echo Starting Frontend App...
start cmd /k "npm start"

echo Both servers are now running!
echo - Frontend: http://localhost:19000
echo - Backend: http://localhost:3000
echo.
echo Press any key to stop all servers...
pause > nul

echo Shutting down servers...
taskkill /f /im node.exe
echo Done! 