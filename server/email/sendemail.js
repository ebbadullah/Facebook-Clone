import transporter from "./mailer.js";
import { generateOTPTemplate, generateWelcomeTemplate } from "./email_template.js";

export async function sendOTP(email, otp) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "OTP for Email Verification",
      html: generateOTPTemplate(otp),
    });
    console.log(`OTP 
      
      sent to user: ${email}`);
    return true;
  } catch (error) {
    console.log("Error sending OTP:", error);
    return false;
  }
}

export async function sendWelcomeEmail(email, username) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Welcome to Our Platform!",
      html: generateWelcomeTemplate(username),
    });
    console.log(`Welcome email sent to user: ${email}`);
    return true;
  } catch (error) {
    console.log("Error sending welcome email:", error);
    return false;
  }
}
