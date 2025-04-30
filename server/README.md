# Derma Analyzer Backend Server

This is the backend server for the Derma Analyzer application. It provides email functionality to send skin analysis reports to users.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory with the following content:
```
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-app-password
PORT=3000
```

**Note about Email Password**: 
- You need to use an "App Password" if you have 2-factor authentication enabled on your Google account.
- To generate an App Password:
  1. Go to your Google Account > Security
  2. Under "Signing in to Google," select "App passwords"
  3. Generate a new app password for "Mail" and use it in the .env file

3. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### GET /api/test
Test if the server is running.

### POST /api/send-report
Send an email report with the skin analysis results.

#### Request Body
```json
{
  "email": "recipient@example.com",
  "reportData": {
    "results": [
      "Disease Name",
      "Description text",
      "Symptoms text",
      "Causes text",
      "Treatment text"
    ],
    "treatments": [
      "Treatment suggestion 1",
      "Treatment suggestion 2"
    ]
  }
}
```

#### Response
Success:
```json
{
  "success": true,
  "messageId": "email-message-id"
}
```

Error:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Troubleshooting

If you encounter "Failed to fetch" errors:
1. Make sure the server is running on port 3000
2. Check that your frontend is using the correct URL (http://localhost:3000) for API calls
3. Verify that the CORS settings in server.js allow requests from your frontend
4. Check the console logs for more detailed error information 