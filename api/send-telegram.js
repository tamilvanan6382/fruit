export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { name, email, message } = req.body;

    // --- TELEGRAM CONFIG ---
    // 1. Create a bot via @BotFather on Telegram -> Get Token
    // 2. Message your bot -> Get your Chat ID (via @userinfobot or getUpdates)

    const botToken = '8208572285:AAFc852ARPC8WPLgjYQLq8Y8JmBY7QdOd1o';
    const chatId = '1957565921';

    const text = `🍎 *Freshly Order*\n\n*Name:* ${name}\n*Email:* ${email}\n*Message:* ${message}`;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}&parse_mode=Markdown`;

    try {
        await fetch(url);
        return res.status(200).json({ success: true, method: 'Telegram' });
    } catch (e) {
        return res.status(500).json({ error: 'Failed to send to Telegram' });
    }
}
