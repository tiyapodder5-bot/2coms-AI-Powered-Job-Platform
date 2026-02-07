import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  // For development, use Gmail or any SMTP service
  // For production, use services like SendGrid, AWS SES, etc.
  
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
      }
    });
  }
  
  // Default to SMTP (for services like SendGrid, Mailgun, etc.)
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * Send status update email to candidate
 */
export const sendStatusUpdateEmail = async (candidateEmail, candidateName, newStatus, recruiterName) => {
  try {
    const transporter = createTransporter();

    const statusMessages = {
      'Applied': {
        subject: 'Application Received',
        message: 'We have received your application and our team is reviewing it.'
      },
      'Screening': {
        subject: 'Application Under Review',
        message: 'Your application is currently being screened by our recruitment team.'
      },
      'Interview': {
        subject: '🎉 Interview Invitation',
        message: 'Congratulations! We would like to invite you for an interview. Our team will contact you soon with the details.'
      },
      'Offer': {
        subject: '🎊 Job Offer',
        message: 'Great news! We are pleased to extend you a job offer. Our HR team will reach out with details.'
      },
      'Hired': {
        subject: '🎉 Welcome Aboard!',
        message: 'Congratulations! You have been selected for the position. Welcome to the team!'
      },
      'Rejected': {
        subject: 'Application Status Update',
        message: 'Thank you for your interest. Unfortunately, we have decided to move forward with other candidates. We wish you the best in your job search.'
      }
    };

    const statusInfo = statusMessages[newStatus] || statusMessages['Applied'];

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: candidateEmail,
      subject: statusInfo.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-badge { display: inline-block; padding: 10px 20px; background: #667eea; color: white; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Status Update</h1>
            </div>
            <div class="content">
              <p>Dear ${candidateName},</p>
              
              <p>${statusInfo.message}</p>
              
              <div class="status-badge">Status: ${newStatus}</div>
              
              ${recruiterName ? `<p><strong>Reviewed by:</strong> ${recruiterName}</p>` : ''}
              
              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br>Recruitment Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} ATS Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Status update email sent to ${candidateEmail}`);
    return { success: true };

  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    // Don't throw error - email failure shouldn't break the application
    return { success: false, error: error.message };
  }
};

/**
 * Send shortlist notification to candidate
 */
export const sendShortlistEmail = async (candidateEmail, candidateName, recruiterName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: candidateEmail,
      subject: '⭐ You\'ve Been Shortlisted!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .star { font-size: 48px; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Great News!</h1>
            </div>
            <div class="content">
              <div class="star">⭐</div>
              
              <p>Dear ${candidateName},</p>
              
              <p>We're excited to inform you that you've been shortlisted for further consideration!</p>
              
              <p>Your profile has caught our attention, and we believe you could be a great fit for our team.</p>
              
              ${recruiterName ? `<p><strong>Shortlisted by:</strong> ${recruiterName}</p>` : ''}
              
              <p>Our team will be in touch with you soon regarding the next steps.</p>
              
              <p>Best regards,<br>Recruitment Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ATS Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Shortlist email sent to ${candidateEmail}`);
    return { success: true };

  } catch (error) {
    console.error('❌ Error sending shortlist email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email to new recruiter
 */
export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: userEmail,
      subject: '🎉 Welcome to ATS Platform',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .features { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .feature-item { margin: 10px 0; padding-left: 25px; position: relative; }
            .feature-item:before { content: "✓"; position: absolute; left: 0; color: #667eea; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ATS Platform!</h1>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>
              
              <p>Welcome aboard! We're thrilled to have you join our recruitment platform.</p>
              
              <div class="features">
                <h3>Here's what you can do:</h3>
                <div class="feature-item">Track candidates with smart ATS scoring</div>
                <div class="feature-item">Manage application status pipeline</div>
                <div class="feature-item">Shortlist and compare candidates</div>
                <div class="feature-item">Post and manage job openings</div>
                <div class="feature-item">Add notes and collaborate with team</div>
              </div>
              
              <p>Start exploring and make your recruitment process smarter!</p>
              
              <p>Best regards,<br>ATS Platform Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ATS Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${userEmail}`);
    return { success: true };

  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    return { success: false, error: error.message };
  }
};
