const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const pdf = require('html-pdf');
const fs = require('fs');
require('dotenv').config();

// For debugging - log environment variables
console.log('Environment variables:');
console.log('- EMAIL_USER:', process.env.EMAIL_USER ? `${process.env.EMAIL_USER.slice(0, 3)}...` : 'not set');
console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? 'is set' : 'not set');
console.log('- PORT:', process.env.PORT || '3000 (default)');

// IMPORTANT: Email configuration - Replace with your actual email details for testing
// Will be overridden by .env values if they exist
const DEFAULT_EMAIL = process.env.EMAIL_USER;
const DEFAULT_PASSWORD = process.env.EMAIL_PASS;

const app = express();

// Set up error handling for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Configure CORS to allow requests from ANY origin (for development only)
app.use(cors({
    origin: '*', // Allow all origins 
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware to catch JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON:', err.message);
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid JSON in request body' 
    });
  }
  next();
});

// Test route
app.get('/api/test', (req, res) => {
    console.log('Test route hit at:', new Date().toISOString());
    res.json({ 
      success: true,
      message: 'Server is running!',
      timestamp: new Date().toISOString() 
    });
});

// Create email transporter
const createTransporter = () => {
  // Use environment variables if available, otherwise use defaults
  const emailUser = process.env.EMAIL_USER || DEFAULT_EMAIL;
  const emailPass = process.env.EMAIL_PASS || DEFAULT_PASSWORD;
  
  console.log(`Creating transporter with email: ${emailUser.slice(0, 3)}...`);
  
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: emailUser,
        pass: emailPass
    },
    debug: true // Enable debug output
  });
};

// Test email configuration
app.get('/api/test-email-config', async (req, res) => {
  try {
    const transporter = createTransporter();
    console.log('Verifying email configuration...');
    const verification = await transporter.verify();
    
    console.log('Email configuration verified:', verification);
    
    res.json({
      success: true,
      message: 'Email configuration is valid',
      emailUser: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.slice(0, 3)}...` : DEFAULT_EMAIL.slice(0, 3) + '...'
    });
  } catch (error) {
    console.error('Email configuration error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      help: 'Check your EMAIL_USER and EMAIL_PASS in .env file'
    });
  }
});

// Send test email
app.get('/api/send-test-email', async (req, res) => {
  try {
    const testEmail = req.query.email || 'test@example.com';
    console.log(`Sending test email to ${testEmail}`);
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Derma Analyzer Test" <${process.env.EMAIL_USER || DEFAULT_EMAIL}>`,
      to: testEmail,
      subject: 'Test Email from Derma Analyzer',
      html: '<h1>Test Email</h1><p>This is a test email from Derma Analyzer server.</p>'
    };
    
    console.log('Sending test email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully! Message ID:', info.messageId);
    
    res.json({
      success: true,
      messageId: info.messageId,
      message: `Test email sent to ${testEmail}`
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// HTML template for email
const generateEmailHTML = (data) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(to right, #4F46E5, #7C3AED);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        .section {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .section-title {
            color: #4F46E5;
            font-size: 1.2em;
            margin-bottom: 10px;
            border-bottom: 2px solid #4F46E5;
            padding-bottom: 5px;
        }
        .treatment-list {
            list-style-type: none;
            padding-left: 0;
        }
        .treatment-item {
            padding: 10px;
            border-left: 3px solid #4F46E5;
            margin-bottom: 10px;
            background: white;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Skin Disease Detection Report</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
    </div>

    <div class="section">
        <div class="section-title">Disease Name</div>
        <p>${data.results && data.results[0] ? data.results[0] : 'Not available'}</p>
    </div>

    <div class="section">
        <div class="section-title">Description</div>
        <p>${data.results && data.results[1] ? data.results[1] : 'Not available'}</p>
    </div>

    <div class="section">
        <div class="section-title">Related Issues</div>
        <p>${data.results && data.results[2] ? data.results[2] : 'Not available'}</p>
    </div>

    <div class="section">
        <div class="section-title">Risk Factors</div>
        <p>${data.results && data.results[3] ? data.results[3] : 'Not available'}</p>
    </div>

    <div class="section">
        <div class="section-title">Recommended Treatments</div>
        <ul class="treatment-list">
            ${data.treatments && data.treatments.length ? data.treatments.map(treatment => `
                <li class="treatment-item">${treatment}</li>
            `).join('') : '<li class="treatment-item">No specific treatments recommended.</li>'}
        </ul>
    </div>

    <div class="footer">
        <p>This is an automated report from Derma Analyzer</p>
        <p>Please consult with a healthcare professional for medical advice</p>
    </div>
</body>
</html>
`;

// Generate PDF from HTML
const generatePDF = (html) => {
    return new Promise((resolve, reject) => {
        const options = {
            format: 'Letter',
            border: {
                top: "20px",
                right: "20px",
                bottom: "20px",
                left: "20px"
            },
            timeout: 30000 // 30 second timeout
        };

        pdf.create(html, options).toBuffer((err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
};

// Validate email function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

app.post('/api/send-report', async (req, res) => {
    console.log('Received email request', req.body);
    const timestamp = new Date().toISOString();
    console.log(`\n[${timestamp}] Received email request`);
    console.log('-'.repeat(50));
    
    try {
        const { email, reportData } = req.body;
        
        console.log('Request body:');
        console.log('- email:', email || 'not provided');
        console.log('- reportData present:', reportData ? 'yes' : 'no');
        
        // Validate request
        if (!email) {
            console.error('No email provided');
            return res.status(400).json({ 
                success: false, 
                error: 'Email is required' 
            });
        }

        if (!isValidEmail(email)) {
            console.error('Invalid email format:', email);
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }
        
        if (!reportData || !reportData.results) {
            console.error('No report data provided');
            return res.status(400).json({ 
                success: false, 
                error: 'Report data is required' 
            });
        }
        
        console.log('Generating email for:', email);
        console.log('Report data structure:');
        console.log('- results:', Array.isArray(reportData.results) ? `Array with ${reportData.results.length} items` : 'Not an array');
        if (Array.isArray(reportData.results)) {
            reportData.results.forEach((item, i) => {
                console.log(`  [${i}]: ${item ? (item.substring(0, 30) + '...') : 'undefined'}`);
            });
        }
        console.log('- treatments:', Array.isArray(reportData.treatments) ? `Array with ${reportData.treatments.length} items` : 'Not an array');
        
        // Generate HTML content
        const htmlContent = generateEmailHTML(reportData);
        console.log('HTML content generated successfully');
        
        // Skip PDF generation for reliability
        const skipPdf = true;
        
        if (!skipPdf) {
            try {
                // Generate PDF
                console.log('Generating PDF...');
                const pdfBuffer = await generatePDF(htmlContent);
                console.log('PDF generated successfully:', `${pdfBuffer.length} bytes`);

                const transporter = createTransporter();
                
                // Set up email data
                const mailOptions = {
                    from: `"Derma Analyzer" <${process.env.EMAIL_USER || DEFAULT_EMAIL}>`,
                    to: email,
                    subject: `Skin Disease Detection Report - ${reportData.results[0] || 'Analysis'}`,
                    html: htmlContent,
                    attachments: [
                        {
                            filename: 'skin-disease-report.pdf',
                            content: pdfBuffer,
                            contentType: 'application/pdf'
                        }
                    ]
                };

                console.log('Sending email with the following options:', {
                    from: mailOptions.from,
                    to: mailOptions.to,
                    subject: mailOptions.subject
                });

                // Send mail
                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent successfully! Message ID:', info.messageId);
                
                res.json({ 
                    success: true, 
                    messageId: info.messageId 
                });
            } catch (pdfError) {
                console.error('Error generating PDF:', pdfError);
                throw pdfError; // Let the fallback handle it
            }
        } else {
            // Directly send email without PDF (more reliable)
            console.log('Sending email without PDF attachment...');
            
            const transporter = createTransporter();
            
            const mailOptions = {
                from: `"Derma Analyzer" <${process.env.EMAIL_USER || DEFAULT_EMAIL}>`,
                to: email,
                subject: `Skin Disease Detection Report - ${reportData.results[0] || 'Analysis'}`,
                html: htmlContent
            };
            
            try {
                console.log('Sending mail with transporter...');
                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent successfully! Message ID:', info.messageId);
                
                res.json({ 
                    success: true,
                    messageId: info.messageId
                });
            } catch (emailError) {
                console.error('Error sending email with nodemailer:', emailError);
                res.status(500).json({ 
                    success: false, 
                    error: `Email sending failed: ${emailError.message}` 
                });
            }
        }
    } catch (error) {
        console.error('Error in email sending process:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Create a .env file if it doesn't exist
if (!fs.existsSync('.env')) {
    console.log('Creating .env file with default values');
    fs.writeFileSync('.env', `EMAIL_USER=${DEFAULT_EMAIL}\nEMAIL_PASS=${DEFAULT_PASSWORD}\nPORT=3000\n`);
    console.log('.env file created. Please update with your actual email credentials.');
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Server running on port ${PORT}`);
    console.log(`${'='.repeat(50)}`);
    console.log(`API endpoints:`);
    console.log(`- GET /api/test: Test if server is running`);
    console.log(`- GET /api/test-email-config: Test email configuration`);
    console.log(`- GET /api/send-test-email?email=your@email.com: Send a test email`);
    console.log(`- POST /api/send-report: Send email report`);
    console.log(`${'='.repeat(50)}`);
    console.log(`\nIMPORTANT: Set your email credentials in .env file or use the defaults for testing.`);
    console.log(`For Gmail, you need to generate an "App Password" if 2FA is enabled.`);
    console.log(`${'='.repeat(50)}\n`);
}); 