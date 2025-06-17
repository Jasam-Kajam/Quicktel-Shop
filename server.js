const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// === Replace with your real Paystack Secret Key ===
const PAYSTACK_SECRET_KEY = 'sk_live_ca1bb04025c10ec7474204949ce6d4811d1fb99f';

app.post('/verify-payment', async (req, res) => {
    const { reference, bundle, email } = req.body;

    try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
            }
        });

        const data = response.data;
        if (data.data.status === 'success') {
            console.log(`✅ Payment verified for ${email}, bundle: ${bundle}`);

            // Simulate bundle activation
            console.log(`Activating bundle [${bundle}] for ${email}`);

            res.json({ success: true, message: `Payment successful! Bundle '${bundle}' activated.` });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Verification error:', error.response?.data || error.message);
        res.status(500).json({ success: false, message: 'Server error verifying payment' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Quicktel Paystack server running on port ${PORT}`);
});