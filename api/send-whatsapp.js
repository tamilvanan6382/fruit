export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { name, email, message } = req.body;

    // User's Number
    const phone = '6382131178';

    // Construct the message
    const text = `🍎 Freshly Order!%0A-----------%0AName: ${name}%0AEmail: ${email}%0AMessage: ${message}`;

    // CallMeBot API (Free WhatsApp Gateway)
    // You likely need an API Key, but sometimes it works with just phone if authorized. 
    // Usually url is: https://api.callmebot.com/whatsapp.php?phone=[phone]&text=[text]&apikey=[your_apikey]

    // --- OPTION 1: CallMeBot (Free, Good for Personal Use) ---
    // Get API Key: Send "I allow callmebot to send me messages" to +34 644 10 55 84
    const callMeBotKey = '123456'; // REPLACE THIS
    const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${text}&apikey=${callMeBotKey}`;

    // --- OPTION 2: Twilio (Professional, Production Standard) ---
    // Requires: npm install twilio
    // const accountSid = process.env.TWILIO_SID;
    // const authToken = process.env.TWILIO_AUTH_TOKEN;
    // const client = require('twilio')(accountSid, authToken);

    try {
        // Uncomment to use Twilio:
        /*
        await client.messages.create({
           from: 'whatsapp:+14155238886', // Twilio Sandbox Number
           to: `whatsapp:+91${phone}`,
           body: `New Order from ${name}:\n${message}`
        });
        */

        // Defaulting to CallMeBot for now:
        await fetch(callMeBotUrl);

        return res.status(200).json({ success: true });
    } catch (e) {
        // console.error(e);
        return res.status(500).json({ error: 'Failed to send' });
    }
}
