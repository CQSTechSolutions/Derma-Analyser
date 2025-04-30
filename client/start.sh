#!/bin/bash

echo "Starting Derma Analyzer Application..."

# Start the backend server
echo "Starting Email Server..."
cd server && npm start &
SERVER_PID=$!

# Return to the main directory
cd ..

# Start the frontend
echo "Starting Frontend App..."
npm start &
FRONTEND_PID=$!

echo "Both servers are now running!"
echo "- Frontend: http://localhost:19000"
echo "- Backend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Cleanup on exit
trap "kill $SERVER_PID $FRONTEND_PID; echo 'Servers stopped'; exit" INT TERM

# Wait for user to press Ctrl+C
wait 