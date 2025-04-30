# Derma Analyzer - Skin Disease Detection App

A mobile application that identifies and analyzes skin conditions using AI. The app allows users to take pictures of skin conditions and receive analysis and treatment suggestions.

## Features

- Skin disease detection using AI
- Detailed analysis of skin conditions including descriptions, symptoms, causes, and treatments
- Email reports for sharing results
- User authentication
- Camera integration for capturing images

## Setup Instructions

### Frontend (Mobile App)

1. Install dependencies:
```bash
npm install
```

2. **IMPORTANT**: Update the backend URL in `services/emailService.ts`:
   - For using an emulator with a local server: `http://10.0.2.2:3000` (Android) or `http://localhost:3000` (iOS)
   - For a physical device with a local server: `http://YOUR_COMPUTER_IP:3000` (e.g., `http://192.168.1.100:3000`)
   - For a deployed backend: use the full URL of your deployed server

3. Start the development server:
```bash
npm start
```

This will start the Expo server and provide options to run the app on a simulator or physical device.

### Backend (Email Server)

1. Navigate to the server directory:
```bash
cd server
```

2. Install server dependencies:
```bash
npm install
```

3. Email setup options:

   a. **Using Environment Variables** (recommended):
   - Create a `.env` file in the server directory with your email credentials:
     ```
     EMAIL_USER=your-gmail-address@gmail.com
     EMAIL_PASS=your-app-password
     PORT=3000
     ```

   b. **Using the start scripts**:
   - Edit `start-server.bat` (Windows) or `start-server.sh` (Mac/Linux) with your email credentials
   - Run the script to start the server with proper environment variables

   c. **Direct code modification**:
   - Open `server.js` and update the `DEFAULT_EMAIL` and `DEFAULT_PASSWORD` variables

4. Start the server using one of these methods:
   - Standard start: `npm start`
   - Development mode with auto-reload: `npm run dev`
   - Using the start script: `./start-server.sh` or `start-server.bat`

## Gmail Setup for Email Functionality

To use Gmail for sending emails:

1. Use a Gmail account
2. Turn on 2-Step Verification for your Google account (if not already enabled)
3. Generate an App Password:
   - Go to your Google Account → Security
   - Under "Signing in to Google" select "App passwords"
   - Select "Mail" and "Other" (name it "Derma Analyzer")
   - Copy the 16-character password
4. Use this App Password in the EMAIL_PASS environment variable

## Testing Email Functionality

1. Start the server
2. Visit http://localhost:3000/api/test to check if the server is running
3. Visit http://localhost:3000/api/test-email-config to verify email settings
4. Try sending a test email: http://localhost:3000/api/send-test-email?email=your@email.com

## Known Issues Fixed

1. **"Failed to Fetch" Error**: The application was showing "Failed to fetch" errors even though data was being received. This has been fixed by:
   - Improving error handling in API calls
   - Adding proper validation of responses
   - Providing better error messages

2. **Email Functionality**: The email service was not working properly. This has been fixed by:
   - Creating a robust backend server for email handling
   - Adding proper error handling and detailed logging
   - Implementing fallback mechanisms when PDF generation fails
   - Supporting both backend API and on-device mail composer

## Troubleshooting Email Issues

If emails are not being sent:

1. **Check Server Connection**:
   - Verify the server is running (http://localhost:3000/api/test)
   - Check that the frontend is using the correct URL (update in services/emailService.ts)

2. **Check Email Configuration**:
   - Verify email settings (http://localhost:3000/api/test-email-config)
   - Make sure you're using an App Password for Gmail
   - Check server logs for authentication errors

3. **Network Issues**:
   - If using an emulator, ensure it can access localhost (10.0.2.2 for Android)
   - For physical devices, use your computer's IP address instead of localhost

4. **Fallback Option**:
   - The app will attempt to use the device's mail composer if the backend fails

## Using the App

1. Login or register a new account
2. Use the camera or gallery to select an image of a skin condition
3. Click "Analyze Image" to get the AI analysis
4. Review the results including description, symptoms, causes, and treatments
5. Use the "Email Report" button to send the results to your email

## Technologies Used

- React Native with Expo
- Node.js for the backend server
- Express.js for API endpoints
- Nodemailer for email functionality
- HTML-PDF for generating PDF reports
