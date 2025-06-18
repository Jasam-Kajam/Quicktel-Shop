const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const africastalking = require('africastalking');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Paystack Secret Key (Production key)
const PAYSTACK_SECRET_KEY = 'sk_live_ca1bb04025c10ec7474204949ce6d4811d1fb99f';

// Africa's Talking credentials
const africasTalking = africastalking({
    apiKey: 'atsk_fd734fe5664d26d6ceab49795e7f707343c597e9a60702a07b08f6032273531346d02e33',
    username: 'sandbox',
});

app.post('/verify-payment', async (req, res) => {
    const { reference, bundle, phone } = req.body;

    try {
        // Verify payment with Paystack
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.status && data.data.status === 'success') {
            console.log(`✅ Payment verified for ${phone}: ${bundle}`);

            // Simulate bundle activation
            console.log(`📶 Activating bundle: ${bundle} for ${phone}`);

            // Format phone number safely
            let formattedPhone;
            if (phone.startsWith('0')) {
                formattedPhone = `+254${phone.substring(1)}`;
            } else if (phone.startsWith('+254')) {
                formattedPhone = phone;
            } else {
                formattedPhone = `+254${phone}`;
            }

            // Send SMS confirmation
            try {
                const sms = africasTalking.SMS;
                await sms.send({
                    to: formattedPhone, 
                    message: `Hello ${phone}, your Quicktel ${bundle} bundle has been activated. Enjoy!`
                });
                console.log(`✅ SMS sent to ${formattedPhone}`);
            } catch (smsError) {
                console.error('❌ Error sending SMS:', smsError);
            }

            res.json({ message: '✅ Payment successful and bundle activated!' });
        } else {
            console.error('❌ Payment verification failed:', data);
            res.status(400).json({ message: '❌ Payment verification failed.' });
        }
    } catch (error) {
        console.error('❌ Error verifying payment:', error);
        res.status(500).json({ message: '❌ Server error.' });
    }
});

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));