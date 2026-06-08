function handleMessages(bot) {
  // Handle all other messages
  bot.on('message', (msg) => {
    // Skip command messages (handled by handleCommands)
    if (msg.text && msg.text.startsWith('/')) {
      return;
    }

    const chatId = msg.chat.id;
    const text = msg.text || '';

    // Example: Simple echo response for non-command messages
    if (text.length > 0) {
      const response = `
👋 Thanks for your message!

💬 I received: "${text}"

💡 To get started, use /help for available commands or /settings to configure your account.
      `;
      bot.sendMessage(chatId, response);
    }
  });
}

module.exports = { handleMessages };
