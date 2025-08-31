import transporter from "./nodemail.js";
import { generateOTPTemplate, generateWelcomeTemplate } from "./email_template.js";

export async function sendOTP(email, otp) {
  try {
    let mailOptions = {
      from: `"Facebook" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP for Email Verification",
      html: generateOTPTemplate(otp),
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.log("Error sending email:", error);
    return false;
  }
}

export async function sendWelcomeEmail(email, username) {

  
  try {
    let mailOptions = {
      from: `"Facebook" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Our Platform!",
      html: generateWelcomeTemplate(username),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.log("Error sending welcome email:", error);
    return false;
  }
}