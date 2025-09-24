import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP connection error:", error);
  } else {
    console.log("SMTP connection ready:", success);
  }
});

export default transporter;
