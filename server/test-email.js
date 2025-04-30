const nodemailer = require('nodemailer');

// Replace these with your email credentials
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your-app-password';
const TEST_RECIPIENT = process.env.TEST_EMAIL || 'test-recipient@example.com';

console.log('Starting email test...');
console.log(`Using email: ${EMAIL_USER}`);

async function testEmail() {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      },
      debug: true
    });
    
    console.log('Verifying connection...');
    const verifyResult = await transporter.verify();
    console.log('Connection verified:', verifyResult);
    
    console.log(`Sending test email to ${TEST_RECIPIENT}...`);
    
    const mailOptions = {
      from: `"Test Sender" <${EMAIL_USER}>`,
      to: TEST_RECIPIENT,
      subject: 'Test Email from Derma Analyzer',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email sent at: ${new Date().toISOString()}</p>
        <p>If you're receiving this, the email functionality is working!</p>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

testEmail()
  .then(result => {
    console.log('Test completed with result:', result ? 'SUCCESS' : 'FAILURE');
    process.exit(result ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 