const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/send-email', async (req, res) => {
    const { name, phone, email, subject, message } = req.body;
  
    const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
  
    const mailToYou = {
      from: email,
      to: process.env.EMAIL_USER, 
      subject: `Contact Form Submission: ${subject}`,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`,
    };
  
    const mailToUser = {
      from:`"ArtNova" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'We received your message!',
      text: `Hi ${name},\n\nThank you for reaching out to us. We’ve received your message and will respond within 24 hours.\n\nYour message:\n"${message}"\n\n- Team`,
    };
  
    try {
   
      await transporter.sendMail(mailToYou);
     
      await transporter.sendMail(mailToUser);
  
      res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
      console.error('Error sending emails:', error);
      res.status(500).json({ error: 'Failed to send emails' });
    }
  });
  module.exports = router;