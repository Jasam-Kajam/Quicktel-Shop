// 1️⃣ Import necessary libraries
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// 2️⃣ Create express app
const app = express();
app.use(cors());
app.use(express.json());

// 3️⃣ Your Paystack secret key (VERY IMPORTANT)
const PAYSTACK_SECRET_KEY = 'sk_live_ca1bb04025c10ec7474204949ce6d4811d1fb99f';

// 4️⃣ Create API endpoint to verify payment
app.post('/verify-payment', async (req, res) => {
    // Receive these fields from frontend
    const { reference, bundle, email } = req.body;

    // Call Paystack API to verify payment
    try {
        const paystackResponse = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const verificationData = paystackResponse.data;

        // Check if Paystack says payment was successful
        if (verificationData.data.status === 'success') {
            console.log('✅ Payment verified!');
            console.log('Email:', email);
            console.log('Bundle purchased:', bundle);
            console.log('Amount paid:', verificationData.data.amount / 100);

            // Simulate activation (you will automate this later)
            console.log('Activating bundle...');

            // Send success response to frontend
            res.json({
                success: true,
                message: `Payment verified! Bundle '${bundle}' has been activated.`
            });
        } else {
            console.log('❌ Payment not successful');
            res.status(400).json({ success: false, message: 'Payment verification failed.' });
        }
    } catch (err) {
        console.error('⚠ Error verifying payment:', err.message);
        res.status(500).json({ success: false, message: 'Server error verifying payment.' });
    }
});

// 5️⃣ Start server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});