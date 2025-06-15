const http = require('http');
const https = require('https');

const PORT = 3000;
const AFRICASTALKING_USERNAME = 'sandbox';
const AFRICASTALKING_API_KEY = 'atsk_fd734fe5664d26d6ceab49795e7f707343c597e9a60702a07b08f6032273531346d02e33';

const paid = new Set();

function sendSms(to, message) {
  const postData = new URLSearchParams({
    username: AFRICASTALKING_USERNAME,
    to,
    message,
    from: 'Quicktel'
  }).toString();

  const options = {
    hostname: 'api.africastalking.com',
    path: '/version1/messaging',
    method: 'POST',
    headers: {
      'apiKey': AFRICASTALKING_API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, res => {
    res.on('data', d => process.stdout.write(d));
  });

  req.on('error', error => console.error('SMS error:', error));
  req.write(postData);
  req.end();
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Quicktel Bundles - Till Payment</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(to right, #6a11cb, #2575fc);
      color: #fff;
      padding: 20px;
      text-align: center;
    }
    .container {
      background: rgba(0,0,0,0.4);
      max-width: 700px;
      margin: auto;
      padding: 20px;
      border-radius: 12px;
    }
    input {
      width: 100%;
      padding: 12px;
      margin: 10px 0;
      border-radius: 8px;
      border: none;
      font-size: 16px;
    }
    .bundle-option {
      margin: 8px;
      padding: 12px;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      color: white;
    }
    .bundle-option:hover {
      filter: brightness(90%);
    }
    .category-title {
      font-family: 'Times New Roman', Times, serif;
      font-weight: bold;
      font-size: 22px;
      margin-top: 30px;
    }
    .daily { background: #00c853; }
    .weekly { background: #2196f3; }
    .monthly { background: #9c27b0; }
    .allinone { background: #fb8c00; }
    #status {
      margin-top: 20px;
      font-weight: bold;
    }
    .whatsapp-button {
      display: inline-block;
      margin-top: 30px;
      background-color: #25D366;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-size: 18px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Quicktel Bundles</h1>
    <p>Select a bundle below. You'll be guided to pay and receive your bundle instantly!</p>

    <form id="bundleForm">
      <input type="tel" id="phone" placeholder="Enter MPESA phone (e.g. 2547...)" required />
    </form>

    <div class="category-title">Daily Bundles</div>
    <div class="bundle-option daily" data-value="5" data-label="20 SMS">20 SMS - KSh 5</div>
    <div class="bundle-option daily" data-value="10" data-label="200 SMS">200 SMS - KSh 10</div>
    <div class="bundle-option daily" data-value="20" data-label="Unlimited SMS">Unlimited SMS - KSh 20</div>
    <div class="bundle-option daily" data-value="50" data-label="100MB (7 days)">100MB - KSh 50</div>
    <div class="bundle-option daily" data-value="100" data-label="200MB (7 days)">200MB - KSh 100</div>
    <div class="bundle-option daily" data-value="250" data-label="500MB (7 days)">500MB - KSh 250</div>
    <div class="bundle-option daily" data-value="500" data-label="1000MB (7 days)">1000MB - KSh 500</div>
    <div class="bundle-option daily" data-value="10" data-label="100 mins Voice">100 mins Voice - KSh 10</div>

    <div class="category-title">Weekly Bundles</div>
    <div class="bundle-option weekly" data-value="20" data-label="100 SMS">100 SMS - KSh 20</div>
    <div class="bundle-option weekly" data-value="30" data-label="1000 SMS">1000 SMS - KSh 30</div>
    <div class="bundle-option weekly" data-value="50" data-label="Unlimited SMS">Unlimited SMS - KSh 50</div>
    <div class="bundle-option weekly" data-value="100" data-label="500MB + WhatsApp">500MB - KSh 100</div>
    <div class="bundle-option weekly" data-value="250" data-label="1.5GB + WhatsApp">1.5GB - KSh 250</div>
    <div class="bundle-option weekly" data-value="500" data-label="3.5GB + WhatsApp">3.5GB - KSh 500</div>

    <div class="category-title">Monthly Bundles</div>
    <div class="bundle-option monthly" data-value="100" data-label="400MB">400MB - KSh 100</div>
    <div class="bundle-option monthly" data-value="250" data-label="1GB">1GB - KSh 250</div>
    <div class="bundle-option monthly" data-value="500" data-label="2GB">2GB - KSh 500</div>
    <div class="bundle-option monthly" data-value="1000" data-label="8GB">8GB - KSh 1,000</div>
    <div class="bundle-option monthly" data-value="2000" data-label="17GB">17GB - KSh 2,000</div>
    <div class="bundle-option monthly" data-value="3000" data-label="27GB">27GB - KSh 3,000</div>
    <div class="bundle-option monthly" data-value="5000" data-label="47GB">47GB - KSh 5,000</div>
    <div class="bundle-option monthly" data-value="10000" data-label="100GB">100GB - KSh 10,000</div>

    <div class="category-title">All in One Bundles</div>
    <div class="bundle-option allinone" data-value="1000" data-label="8GB + 1000 SMS">8GB + 1000 SMS - KSh 1,000</div>
    <div class="bundle-option allinone" data-value="2000" data-label="17GB + 2000 SMS">17GB + 2000 SMS - KSh 2,000</div>
    <div class="bundle-option allinone" data-value="3000" data-label="27GB + 3000 SMS">27GB + 3000 SMS - KSh 3,000</div>
    <div class="bundle-option allinone" data-value="5000" data-label="47GB + 5000 SMS">47GB + 5000 SMS - KSh 5,000</div>
    <div class="bundle-option allinone" data-value="10000" data-label="100GB + 10,000 SMS">100GB + 10,000 SMS - KSh 10,000</div>

    <div id="status"></div>

    <a href="https://wa.me/254113048974" target="_blank" class="whatsapp-button">📱 Chat on WhatsApp</a>
  </div>

  <script>
    const bundleOptions = document.querySelectorAll('.bundle-option');
    const phoneInput = document.getElementById('phone');
    const statusDiv = document.getElementById('status');

    function pollPayment(phone, amount, label) {
      statusDiv.textContent = "⏳ Checking for payment confirmation...";
      const polling = setInterval(async () => {
        try {
          const res = await fetch('/check-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, amount, label })
          });
          const data = await res.json();
          if (data.success) {
            clearInterval(polling);
            statusDiv.innerHTML = `✅ ${label} activated successfully!`;
          }
        } catch (err) {
          console.error('Error polling:', err);
        }
      }, 4000);
    }

    bundleOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        const amount = btn.dataset.value;
        const label = btn.dataset.label;
        const phone = phoneInput.value.trim();

        if (!/^2547\\d{8}$/.test(phone)) {
          alert("Enter a valid MPESA number (e.g. 2547XXXXXXXX)");
          return;
        }

        const newTab = window.open('', '_blank');
        newTab.document.write(\`
          <html>
            <head><title>Pay via Till</title></head>
            <body style="font-family: Arial; background: #f9f9f9; text-align: center; padding: 40px;">
              <h2>Complete Payment</h2>
              <p>You're purchasing: <strong>\${label}</strong></p>
              <p>Amount: <strong>KSh \${amount}</strong></p>
              <p>Please pay to the MPESA Till Number:</p>
              <div style="font-size: 26px; margin: 20px; background: #e0e0e0; padding: 15px; border-radius: 8px;">8644442</div>
              <p>Using your number: <strong>\${phone}</strong></p>
              <p>After payment, return to the previous tab.</p>
            </body>
          </html>
        \`);

        statusDiv.innerHTML = \`🟢 Waiting for payment of KSh \${amount} from \${phone} for \${label}...\`;
        pollPayment(phone, amount, label);
      });
    });
  </script>
</body>
</html>`;

http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(html);
  }

  if (req.method === 'POST' && req.url === '/check-payment') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { phone, amount, label } = JSON.parse(body);
        const transactionKey = `${phone}-${amount}-${label}`;

        if (!paid.has(transactionKey)) {
          const isPaid = Math.random() < 0.5;
          if (!isPaid) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false }));
          }
          paid.add(transactionKey);
        }

        sendSms(phone, \`QUICKTEL: Your \${label} worth KSh \${amount} has been activated. Enjoy!\`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400);
        res.end('Invalid request');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, () => {
  console.log(\`✅ Quicktel server running at http://localhost:\${PORT}\`);
});