const { createTransport } = require("nodemailer");
require("dotenv").config();

const sendEmail = async ({ email, subject, message }) => {
  const transporter = createTransport({
    host: "smtp@gmail.com",
    port: 465,
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    to: email,
    from: process.env.EMAIL,
    subject: subject,
    text: message,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
