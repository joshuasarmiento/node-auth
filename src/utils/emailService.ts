import nodemailer from 'nodemailer';
import { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS } from '../secrets';

// Define a type for supported email services
type EmailService = 'gmail' | 'outlook' | 'yahoo' | 'mailgun' | 'sendgrid';

// Create a mapping of email services to their SMTP settings
const smtpSettings: Record<EmailService, { host: string; port: number; secure: boolean }> = {
  gmail: { host: 'smtp.gmail.com', port: 587, secure: false },
  outlook: { host: 'smtp-mail.outlook.com', port: 587, secure: false },
  yahoo: { host: 'smtp.mail.yahoo.com', port: 587, secure: false },
  mailgun: { host: 'smtp.mailgun.org', port: 587, secure: false },
  sendgrid: { host: 'smtp.sendgrid.net', port: 587, secure: false },
};

// Function to create and configure the email transporter
const createEmailTransporter = () => {
  const emailService = EMAIL_SERVICE as EmailService || 'gmail';
  const emailUser = EMAIL_USER
  const emailPass = EMAIL_PASS

  if (!emailService || !emailUser || !emailPass) {
    throw new Error('Email configuration is missing or incomplete.');
  }

  const settings = smtpSettings[emailService];

  if (!settings) {
    throw new Error(`Unsupported email service: ${emailService}`);
  }

  return nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

// Create the transporter
const transporter = createEmailTransporter();

// Function to send an email
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Vue Auth" <${EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default transporter;