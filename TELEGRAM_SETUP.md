# 🤖 How to Setup Telegram Notifications (Step-by-Step)

Follow these simple steps to get your **Bot Token** and **Chat ID** for free notifications.

## Phase 1: Create the Bot 🛠️

1. **Open Telegram** on your phone or computer.
2. Search for **`@BotFather`** in the search bar (Look for the blue verified checkmark).
3. Click **Start** (or type `/start`).
4. Send the command: `/newbot`
5. **BotFather** will ask for a name. Type a display name (e.g., `Freshly Store Admin`).
6. **BotFather** will ask for a username. It **must** end in `bot` (e.g., `FreshlyShop_YourName_Bot`).
7. **Done!** BotFather will send you a message with your **HTTP API Token**.
   - It looks like this: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
   - 👉 **Copy this Token.**

## Phase 2: Get Your Chat ID 🆔

1. In Telegram, search for your new bot (by the username you just created) and click **Start**.
   - *Important: You must start a chat with your bot first!*
2. Now, search for another bot called **`@userinfobot`**.
3. Click **Start**.
4. It will immediately reply with your details. Look for **Id**.
   - It corresponds to a number like: `987654321`
   - 👉 **Copy this ID.**

## Phase 3: Connect to Freshly 🍎

1. Open the file `api/send-telegram.js` in your project folder.
2. Find the lines that look like this:

```javascript
const botToken = 'YOUR_BOT_TOKEN_HERE'; 
const chatId = 'YOUR_CHAT_ID_HERE';
```

3. Paste your values:

```javascript
const botToken = '123456789:ABCdefGHIjklMNOpqrsTUVwxyz'; // From Phase 1
const chatId = '987654321'; // From Phase 2
```

4. Save the file.

## Phase 4: Test It 🚀

1. Update your `script.js` to point to the telegram API (if you haven't already):
   - Change `fetch('/api/send-whatsapp', ...)` to `fetch('/api/send-telegram', ...)`
2. Go to your website footer.
3. Fill out the contact form and click "Send".
4. You should receive a message on Telegram instantly! 🎉
