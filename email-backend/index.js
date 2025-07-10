const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

app.post('/send-email', upload.single('file'), async (req, res) => {
  const email = req.body.email;
  const file = req.file;
  const dateTime = req.body.dateTime;

  if (!email || !file || !dateTime) {
    return res.status(400).send({ message: 'Email, file, and dateTime are required' });
  }

  const scheduledTime = new Date(dateTime).getTime();
  const currentTime = new Date().getTime();
  const delay = scheduledTime - currentTime;

  if (delay < 0) {
    return res.status(400).send({ message: 'Scheduled time must be in the future' });
  }

  // Setup Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kumarsaran2004@gmail.com',       // <-- your Gmail
      pass: 'vnrbzxxrujygjfyh',         // <-- your App Password
    },
  });

  const mailOptions = {
    from: 'kumarsaran2004@gmail.com',
    to: email,
    subject: 'Here is your scheduled PDF file!',
    text: 'Please find the attached PDF file.',
    attachments: [
      {
        filename: file.originalname,
        path: file.path,
      },
    ],
  };

  // Schedule the email
  setTimeout(async () => {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${email} at scheduled time`);
    } catch (error) {
      console.error('Failed to send scheduled email:', error);
    }
  }, delay);

  res.send({ message: 'Email scheduled successfully!' });
});

app.listen(5000, () => console.log('Server running on port 5000'));
