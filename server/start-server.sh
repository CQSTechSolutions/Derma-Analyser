#!/bin/bash

echo "Starting Derma Analyzer Email Server..."

echo "Setting environment variables for email..."
# Replace these with your actual Gmail credentials
export EMAIL_USER="your-email@gmail.com"
export EMAIL_PASS="your-app-password"
export PORT=3000

echo "Environment variables set:"
echo "EMAIL_USER=$EMAIL_USER"
echo "EMAIL_PASS=******* (hidden)"
echo "PORT=$PORT"

echo "Starting server..."
node server.js 