const TelegramBot = require('node-telegram-bot-api');
const { handleCommands } = require('./handlers/commandHandler');
const { handleMessages } = require('./handlers/messageHandler');

function initBot(token) {
  // Create bot instance with polling
  const bot = new TelegramBot(token, { polling: true });

  // Set up command handlers
  handleCommands(bot);

  // Set up message handlers
  handleMessages(bot);

  // Error handling
  bot.on('polling_error', (error) => {
    console.error('❌ Polling error:', error.code, error.message);
  });

  return bot;
}

module.exports = { initBot };
