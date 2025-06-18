const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const africastalking = require('africastalking');
const chalk = require('chalk');
const figlet = require('figlet');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Paystack Secret Key
const PAYSTACK_SECRET_KEY = 'sk_live_46bd28ec294704ab8eb8fa0b5fe80558eb5b5ffc';

// Africa's Talking credentials
const africasTalking = africastalking({
    apiKey: 'atsk_fd734fe5664d26d6ceab49795e7f707343c597e9a60702a07b08f6032273531346d02e33',
    username: 'sandbox',
});

// Pretty banner on startup
figlet('Quicktel Backend', (err, data) => {
    if (!err) {
        console.log(chalk.blue(data));
        console.log(chalk.green('🚀 Backend running on port: ') + chalk.yellow(PORT));
    }
});

app.post('/verify-payment', async (req, res) => {
    const { reference, bundle, phone } = req.body;

    console.log(chalk.cyan(`🔎 Verifying payment for reference: ${reference}`));

    try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.status && data.data.status === 'success') {
            console.log(chalk.green(`✅ Payment verified for ${chalk.yellow(phone)}: ${chalk.magenta(bundle)}`));

            // Simulate bundle activation
            console.log(chalk.blueBright(`📶 Activating bundle: ${bundle} for ${phone}`));

            // Send SMS confirmation
            const sms = africasTalking.SMS;
            await sms.send({
                to: `+254${phone.substring(1)}`, 
                message: `Hello ${phone}, your Quicktel ${bundle} bundle has been activated. Enjoy!`
            });

            console.log(chalk.greenBright(`📩 Confirmation SMS sent to ${phone}`));

            res.json({ message: '✅ Payment successful and bundle activated!' });
        } else {
            console.log(chalk.red('❌ Payment verification failed.'));
            res.status(400).json({ message: '❌ Payment verification failed.' });
        }
    } catch (error) {
        console.error(chalk.bgRed('❌ Server error verifying payment:'), error);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.listen(PORT);