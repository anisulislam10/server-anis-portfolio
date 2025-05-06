// /controllers/contactController.js
import sendEmail from '../config/sendEmail.config.js';
import Contact from '../models/contact.model.js';

export const contactFormHandler = async (req, res) => {
  const { fullname, email, subject, yourMessage } = req.body;

  if (!fullname || !email || !subject || !yourMessage) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Save message to DB
    const contact = new Contact({ fullname, email, subject, yourMessage });
    await contact.save();

    // Send email
    await sendEmail({
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${yourMessage}</p>
      `
    });

    res.status(200).json({ message: 'Message sent and saved successfully!' });
  } catch (error) {
    console.error('Error in contact form:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
