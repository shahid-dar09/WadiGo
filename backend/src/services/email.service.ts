import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(env.SMTP_PORT || '587', 10),
    secure: env.SMTP_PORT === '465',
    auth: env.SMTP_USER && env.SMTP_PASS ? {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    } : undefined,
  });

  static async sendRegistrationOtp(email: string, otp: string, name: string): Promise<void> {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>WadiGo Email Verification</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0; }
          .container { max-width: 580px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #1E1B4B 0%, #4C1D95 50%, #7C3AED 100%); padding: 35px 30px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 800; tracking-tight; }
          .header p { margin: 8px 0 0; font-size: 13px; color: #C4B5FD; opacity: 0.9; }
          .content { padding: 35px 30px; color: #334155; }
          .greeting { font-size: 16px; font-weight: 700; color: #1E1B4B; margin-bottom: 12px; }
          .message { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 25px; }
          .otp-box { background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%); border: 2px dashed #7C3AED; border-radius: 16px; padding: 25px; text-align: center; margin: 25px 0; }
          .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 12px; color: #4C1D95; margin: 0; }
          .expiry { font-size: 12px; color: #6D28D9; margin-top: 10px; font-weight: 600; }
          .footer { background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Wadi<span style="color: #FB7185;">Go</span></h1>
            <p>AI-Powered Hyperlocal Commerce Platform</p>
          </div>
          <div class="content">
            <div class="greeting">Hello ${name || 'Valued Customer'},</div>
            <div class="message">
              Thank you for signing up for WadiGo! Please use the following 6-digit verification code to activate your account and access your hyperlocal dashboard.
            </div>
            
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <div class="expiry">⏱️ Valid for 10 minutes</div>
            </div>

            <div class="message" style="font-size: 12px; color: #64748b;">
              If you did not initiate this request, please ignore this email or contact support. Do not share this code with anyone.
            </div>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} WadiGo Engineering · Hyperlocal Shopping Engine
          </div>
        </div>
      </body>
      </html>
    `;

    // Console log fallback for instant visibility during dev
    console.log('\n==================================================');
    console.log('📧 [EMAIL DISPATCHER]');
    console.log(`To: ${name} <${email}>`);
    console.log(`OTP Code: ${otp}`);
    console.log('==================================================\n');

    // Attempt real email send if SMTP configured, else use test/fallback
    if (env.SMTP_USER && env.SMTP_PASS) {
      try {
        await this.transporter.sendMail({
          from: env.SMTP_FROM,
          to: `"${name}" <${email}>`,
          subject: `${otp} is your WadiGo Verification Code`,
          text: `Hello ${name},\n\nYour 6-digit verification code is: ${otp}\n\nThis code expires in 10 minutes.`,
          html: htmlTemplate,
        });
        console.log(`✅ Verification email successfully sent to ${email} via SMTP`);
      } catch (err: any) {
        console.error('❌ Failed to send SMTP email:', err.message || err);
      }
    } else {
      console.log('ℹ️ Tip: Configure SMTP_USER and SMTP_PASS in .env to send real emails to inbox.');
    }
  }
}
