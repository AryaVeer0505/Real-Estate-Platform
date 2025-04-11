require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmailForAddUser = async (email, password) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Dream Estates" <${process.env.GMAIL_ID}>`, 
    to: email,
    subject: "User Account Successfully Created",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #4CAF50;">Welcome</h2>
        <p>Dear User,</p>
        <p>Your account has been successfully created</p>
        <p>You can now log in using :-
        <br>Email ID == ${email}
        <br>
        password === ${password}.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>Dream Estates</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Add User email sent successfully");
  } catch (error) {
    console.error("Error sending Add User email:", error); 
    throw new Error("Failed to send Add User email");
  }
};

module.exports = sendEmailForAddUser;
