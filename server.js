const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files

// API Endpoint to send SMS
app.post('/api/send-sms', (req, res) => {
    const { name, email, message } = req.body;
    const adminPhone = '6382131178';

    console.log(`\n[BACKEND] Received SMS Request`);
    console.log(`To: ${adminPhone}`);
    console.log(`Message Body:`);
    console.log(`----------------`);
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Content: ${message}`);
    console.log(`----------------`);

    // In a real production app, you would use Twilio or SNS here.
    // Example: client.messages.create({ ... })

    console.log(`[BACKEND] SMS sent successfully to ${adminPhone} (Simulated)`);

    res.json({ success: true, message: 'SMS sent successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Ready to handle form submissions...');
});
