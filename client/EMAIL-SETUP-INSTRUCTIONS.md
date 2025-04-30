# Email Functionality Setup Instructions

## 1. Set up Gmail for App Password

1. Use a Gmail account
2. Turn on 2-Step Verification for your Google account
   - Go to Google Account → Security
   - Enable 2-Step Verification if not already enabled
3. Generate an App Password:
   - Go to Google Account → Security
   - Under "Signing in to Google," select "App passwords"
   - Select "Mail" and "Other" (name it "Derma Analyzer")
   - Copy the 16-character password (this will be your EMAIL_PASS)

## 2. Update Email Credentials

Choose one of these methods to set your email credentials:

### Option A: Edit the .env file (Recommended)

1. Create or edit the `.env` file in the server directory:
```
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-16-character-app-password
PORT=3000
```

### Option B: Edit start-server scripts

1. Edit the `start-server.bat` (Windows) file:
   - Replace `your-email@gmail.com` with your actual Gmail address
   - Replace `your-app-password` with your 16-character app password

2. Edit the `start-server.sh` (Mac/Linux) file:
   - Replace `your-email@gmail.com` with your actual Gmail address
   - Replace `your-app-password` with your 16-character app password

### Option C: Update server.js directly

1. Open `server.js`
2. Find the section with `DEFAULT_EMAIL` and `DEFAULT_PASSWORD` variables
3. Replace the values with your actual Gmail credentials

## 3. Update Frontend URL

In `services/emailService.ts`, make sure the `BACKEND_URL` is set correctly:

- For Android Emulator: `http://10.0.2.2:3000`
- For iOS Simulator: `http://localhost:3000`
- For physical device: `http://YOUR_COMPUTER_IP:3000` (e.g., `http://192.168.1.100:3000`)
- For web browser: `http://localhost:3000` (but note that email functionality in web browsers is limited)

## 4. Start the Server

```bash
cd server
```

Then choose one of these methods:
```bash
# Method 1: Use npm start
npm start

# Method 2: Use the start scripts
./start-server.sh    # Mac/Linux
start-server.bat     # Windows

# Method 3: Run directly with node
node server.js
```

## 5. Test the Email Functionality

### Method 1: Use the Connection Test Script (Recommended)

```bash
cd server
node test-connection.js
```

This script will:
- Test if the server is running
- Check email configuration
- Send a test email (if desired)
- Provide helpful diagnostics

### Method 2: Use the Test Endpoints

1. Visit http://localhost:3000/api/test to verify the server is running
2. Visit http://localhost:3000/api/test-email-config to verify email settings
3. Visit http://localhost:3000/api/send-test-email?email=your@email.com to send a test email

### Method 3: Use the Email Test Script

```bash
cd server
# Set your test recipient email
set TEST_EMAIL=your-test-email@example.com  # Windows
export TEST_EMAIL=your-test-email@example.com  # Mac/Linux

# Run the test script
node test-email.js
```

## 6. Using Email in Web Browsers

Email functionality in web browsers works differently:

1. The app will automatically detect web browsers and use the device's email client instead of the backend server
2. When you click "Email Report", it will open your default email app with the report pre-filled
3. You do not need the server running for this mode to work
4. **Note**: This fallback experience is not as seamless as the backend email functionality, but it ensures emails can still be sent

## 7. Troubleshooting

If emails are not being sent:

1. **Check Gmail Settings**:
   - Make sure 2-Step Verification is enabled
   - Make sure you're using an App Password, not your regular Gmail password
   - Check that your Gmail account doesn't have security restrictions

2. **Check Server Connection**:
   - Run `node test-connection.js` to verify server is working
   - Make sure the server is running
   - Check server logs for any authentication errors

3. **Check Network**:
   - If using an emulator, make sure it can access your localhost
   - For physical devices, use your computer's IP address instead of localhost
   - Try disabling firewalls temporarily to test connectivity

4. **See Logs**:
   - Check the server console for detailed error messages
   - The server has extensive logging to help diagnose issues

5. **Icon Issues**:
   - If you see "X is not a valid icon name" errors, they have been fixed but are unrelated to email functionality 