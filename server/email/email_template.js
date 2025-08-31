export function generateOTPTemplate(otp) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Email Verification</h2>
      <p>Your OTP for verification is:</p>
      <div style="background: #f4f4f4; padding: 10px; margin: 10px 0; font-size: 24px; letter-spacing: 2px; text-align: center;">
        ${otp}
      </div>
      <p>This OTP will expire in 10 minutes.</p>
      <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
    </div>
  `;
}


export function generateWelcomeTemplate(username) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Our Platform!</h2>
      <p>Dear ${username},</p>
      <p>Your account has been successfully verified and created.</p>
      <p>Thank you for joining us!</p>
      <p style="color: #666; font-size: 14px;">Start exploring our platform now.</p>
    </div>
  `;
}