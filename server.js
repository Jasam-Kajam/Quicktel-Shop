// server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your real Paystack secret key
const PAYSTACK_SECRET_KEY = 'sk_live_ca1bb04025c10ec7474204949ce6d4811d1fb99f';

app.post('/verify-payment', async (req, res) => {
    const { reference, bundle, phone } = req.body;

    try {
        const paystackResponse = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const data = paystackResponse.data;

        if (data.data.status === 'success') {
            console.log('✅ Payment verified');
            console.log('Phone:', phone);
            console.log('Bundle:', bundle);
            console.log('Amount:', data.data.amount / 100);
            console.log(`Activating bundle for ${phone}...`);

            res.json({
                success: true,
                message: `Payment successful! Bundle '${bundle}' activated for ${phone}.`
            });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed.' });
        }
    } catch (err) {
        console.error('Error verifying payment:', err.message);
        res.status(500).json({ success: false, message: 'Server error verifying payment.' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});