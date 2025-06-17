const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 5000;

// Replace with your Paystack secret key
const PAYSTACK_SECRET_KEY = 'sk_live_ca1bb04025c10ec7474204949ce6d4811d1fb99f';

app.use(cors());
app.use(bodyParser.json());

app.post('/verify-payment', async (req, res) => {
    const { reference, bundle, phone } = req.body;

    try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }
        });

        if (response.data.data.status === "success") {
            console.log(`✅ Payment successful for phone: ${phone}, bundle: ${bundle}`);
            // Here you would activate bundle, log transaction, etc.

            res.json({ message: `Payment successful for ${bundle} on number ${phone}. Bundle activated.` });
        } else {
            res.status(400).json({ message: "Payment verification failed." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during verification." });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});