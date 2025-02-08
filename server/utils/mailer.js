// utils/mailer.js
const nodemailer = require("nodemailer");

// Create a transporter using your SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtpout.secureserver.net",
  port: process.env.SMTP_PORT || 456,
  secure: false, // Set to true if using SSL/TLS
  auth: {
    user: process.env.SMTP_USER || "no-reply@instructedu.in",
    pass: process.env.SMTP_PASS || "@Instruct.team0018",
  },
});

// sendMail is an async helper that returns a promise
const sendMail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.SMTP_USER || "no-reply@instructedu.in",
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendMail };
