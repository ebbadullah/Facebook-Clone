import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.log("Error with mailer config:", error);
  } else {
    console.log("Ready");
  }
});

export default transporter;
