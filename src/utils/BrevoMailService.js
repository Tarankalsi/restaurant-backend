const nodemailer = require('nodemailer');
const { Resend } = require('resend');
require('dotenv').config();

// const transporter = nodemailer.createTransport({
//   host: 'smtp-relay.brevo.com', 
//   port: 587,
//   auth: {
//     user: process.env.BREVO_USER, // Your Brevo SMTP username
//     pass: process.env.BREVO_PASS  // Your Brevo SMTP password
//   }
// });

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, template) => {
  try {
    // const mailOptions = {
    //   from: process.env.BREVO_USER, // Sender address
    //   to: to, // List of recipients
    //   subject: subject, // Subject line
    //   html: template
    // };

    // const info = await transporter.sendMail(mailOptions);
    const info = await resend.emails.send({
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      html: template
    });
    console.log('Email sent:', info);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendEmail };