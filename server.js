const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const chalk = require('chalk');

const app = express();
const PORT = 5000;

// Load environment variables for security (best practice)
require('dotenv').config();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_live_ca1bb04025c10ec7474204949ce6d4811d1fb99f';

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Health check route
app.get('/', (req, res) => {
    res.send('🚀 Quicktel Backend API is running...');
});

// Payment verification route
app.post('/verify-payment', async (req, res) => {
    const { reference, bundle, phone } = req.body;

    console.log(chalk.blue(`🔍 Verifying payment for ${chalk.yellow(phone)} for bundle: ${chalk.green(bundle)}`));

    try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }
        });

        const data = response.data.data;

        if (data.status === "success") {
            console.log(chalk.green(`✅ Payment successful! Reference: ${reference}`));
            console.log(chalk.magenta(`📦 Bundle activated: ${bundle} for ${phone}`));

            // Here you can trigger your actual bundle activation logic (e.g. Safaricom API, SMS delivery, etc)

            res.json({
                status: "success",
                message: `Payment successful for ${bundle} on ${phone}. Bundle activated!`,
                amount: data.amount / 100
            });
        } else {
            console.log(chalk.red(`❌ Payment verification failed for reference: ${reference}`));
            res.status(400).json({ status: "failed", message: "Payment verification failed." });
        }
    } catch (err) {
        console.error(chalk.red('🔥 Server Error:'), err.message);
        res.status(500).json({ status: "error", message: "Internal server error during verification." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(chalk.bgGreen.black(`🚀 QUICKTEL Backend is live on port ${PORT}`));
});