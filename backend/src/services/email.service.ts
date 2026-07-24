export class EmailService {
  static async sendRegistrationOtp(email: string, otp: string, name: string): Promise<void> {
    // Development mode logging and simulation
    console.log('\n==================================================');
    console.log('📧 [EMAIL DISPATCH SIMULATOR]');
    console.log(`To: ${name} <${email}>`);
    console.log('Subject: WadiGo Account Verification Code');
    console.log(`Body: Your 6-digit verification code is: ${otp}`);
    console.log('Code expires in 10 minutes.');
    console.log('==================================================\n');
  }
}
