/**
 * Server Connection Test Script
 * Run this with: node test-connection.js
 * 
 * This script will test if the server is running and properly handling requests.
 */

const http = require('http');

const SERVER_PORT = process.env.PORT || 3000;
const SERVER_HOST = 'localhost';

console.log(`=== EMAIL SERVER CONNECTION TEST ===`);
console.log(`Testing server at ${SERVER_HOST}:${SERVER_PORT}...`);

// Helper to make a simple GET request
function makeRequest(path, description) {
  return new Promise((resolve, reject) => {
    console.log(`\nTesting: ${description}`);
    
    const options = {
      hostname: SERVER_HOST,
      port: SERVER_PORT,
      path: path,
      method: 'GET',
      timeout: 3000
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const statusColor = res.statusCode === 200 ? '\x1b[32m' : '\x1b[31m'; // Green or Red
        console.log(`Status: ${statusColor}${res.statusCode}\x1b[0m`);
        
        try {
          const jsonResponse = JSON.parse(data);
          console.log('Response:', JSON.stringify(jsonResponse, null, 2));
          resolve({ success: true, status: res.statusCode, data: jsonResponse });
        } catch (e) {
          console.log('Response (not JSON):', data);
          resolve({ success: true, status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('\x1b[31mERROR:\x1b[0m', error.message);
      
      if (error.code === 'ECONNREFUSED') {
        console.log('\x1b[31mThe server is not running or is not accessible.\x1b[0m');
        console.log('Make sure to:');
        console.log('1. Start the server with: node server.js');
        console.log('2. Ensure the server is running on port', SERVER_PORT);
      }
      
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      console.error('\x1b[31mRequest timed out\x1b[0m');
      reject(new Error('Request timed out'));
    });
    
    req.end();
  });
}

// Run all tests
async function runTests() {
  try {
    // Basic server ping
    await makeRequest('/api/test', 'Basic server test');
    
    // Email configuration test
    await makeRequest('/api/test-email-config', 'Email configuration test');
    
    // Test email (replace with a valid email if you want to send a test email)
    const testEmail = 'test@example.com'; // Replace with a real email to actually send a test
    await makeRequest(`/api/send-test-email?email=${testEmail}`, `Test email to ${testEmail}`);
    
    console.log('\n\x1b[32m✓ All tests completed!\x1b[0m');
    console.log('The server appears to be running correctly.');
    
  } catch (error) {
    console.error('\n\x1b[31m✗ Tests failed!\x1b[0m');
    console.error('Error details:', error.message);
    console.log('\nFor mobile app connection, make sure:');
    console.log('1. In services/emailService.ts, BACKEND_URL is set properly:');
    console.log('   - For Android emulator: http://10.0.2.2:3000');
    console.log('   - For iOS simulator: http://localhost:3000');
    console.log('   - For physical device: http://YOUR_COMPUTER_IP:3000');
    console.log('2. Your device/emulator can access the server');
  }
}

runTests().catch(console.error); 