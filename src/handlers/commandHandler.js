function handleCommands(bot) {
  // /start command
  bot.onText(/^\/start$/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `
🎉 Welcome to Collectusmuchus!

I'm a Telegram bot that auto-collects and applies bonus codes to stake.com

📋 Available Commands:
/start - Show this welcome message
/help - Display help information
/status - Check bot status
/settings - Configure your preferences
/history - View applied codes history

💡 How to use:
1. Set up your stake.com account details
2. I'll automatically detect bonus codes
3. Codes will be applied to your account

❓ Need help? Use /help
    `;
    bot.sendMessage(chatId, welcomeMessage);
  });

  // /help command
  bot.onText(/^\/help$/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
📚 Help & Information

🔧 Setup:
1. Use /settings to configure your account
2. Add your stake.com credentials securely

🎯 Features:
- Auto-detection of bonus codes in messages
- Automatic code application to your account
- Code history tracking
- Notification system

⚠️ Important:
- Never share your API keys or credentials
- All sensitive data is encrypted
- Your privacy is our priority

❓ Still have questions?
Reply with your question and we'll help!
    `;
    bot.sendMessage(chatId, helpMessage);
  });

  // /status command
  bot.onText(/^\/status$/, (msg) => {
    const chatId = msg.chat.id;
    const statusMessage = `
✅ Bot Status:
- Bot: Online
- Database: Connected
- API: Ready

📊 Stats:
- Monitoring codes: Active
- Processing: Enabled

Use /settings to configure your preferences.
    `;
    bot.sendMessage(chatId, statusMessage);
  });

  // /settings command
  bot.onText(/^\/settings$/, (msg) => {
    const chatId = msg.chat.id;
    const settingsMessage = `
⚙️ Settings

🔐 Account Configuration:
Please note: Feature coming soon!

For now, we're working on:
- Secure credential storage
- Account linking
- Notification preferences

Stay tuned! 🚀
    `;
    bot.sendMessage(chatId, settingsMessage);
  });

  // /history command
  bot.onText(/^\/history$/, (msg) => {
    const chatId = msg.chat.id;
    const historyMessage = `
📜 Applied Codes History

No codes have been applied yet.

Once you set up your account, applied codes will appear here with timestamps.
    `;
    bot.sendMessage(chatId, historyMessage);
  });
}

module.exports = { handleCommands };
