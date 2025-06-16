// backend.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const africastalking = require('africastalking');

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Africa's Talking credentials
const africastalkingAPI = africastalking({
  apiKey: 'atsk_fd734fe5664d26d6ceab49795e7f707343c597e9a60702a07b08f6032273531346d02e33', // ← replace with your actual key
  username: 'sandbox', // ← use 'sandbox' for testing or your production username
});

// SMS service
const sms = africastalkingAPI.SMS;

// Route to send SMS
app.post('/send-sms', async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ success: false, error: 'Phone and message required' });
  }

  const options = {
    to: [phone],
    message: message,
    from: 'Quicktel' // Optional: must be approved by Africa's Talking
  };

  try {
    const response = await sms.send(options);
    res.json({ success: true, message: 'SMS sent successfully', response });
  } catch (err) {
    console.error('SMS Error:', err);
    res.status(500).json({ success: false, error: 'Failed to send SMS' });
  }
});

// Root test
app.get('/', (req, res) => {
  res.send('Quicktel SMS backend is running!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});