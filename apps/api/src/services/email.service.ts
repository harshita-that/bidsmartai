import { Resend } from 'resend';
import { logger } from '../utils/logger.js';

const resend = new Resend(process.env['RESEND_API_KEY'] ?? 're_placeholder');
const fromEmail = process.env['EMAIL_FROM'] ?? 'noreply@bidsmart.ai';

export const emailService = {
  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;
    
    try {
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'BidSmart - Password Reset',
        html: `
          <p>You requested a password reset.</p>
          <p>Click the link below to reset your password. This link is valid for 1 hour.</p>
          <a href="${resetUrl}">Reset Password</a>
        `,
      });
      logger.info({ email }, 'Password reset email sent');
    } catch (err) {
      logger.error({ err, email }, 'Failed to send password reset email');
      throw err;
    }
  }
};
