require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Import services
const { initDatabase } = require('./services/database');
const { initBot } = require('./bot');

// Initialize application
async function start() {
  try {
    console.log('🚀 Starting Collectusmuchus bot...');

    // Initialize database
    console.log('📦 Initializing database...');
    await initDatabase();
    console.log('✅ Database initialized');

    // Check for required environment variables
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set in .env file');
    }

    // Initialize Telegram bot
    console.log('🤖 Initializing Telegram bot...');
    const bot = initBot(process.env.TELEGRAM_BOT_TOKEN);
    console.log('✅ Bot initialized successfully');
    console.log('✨ Bot is running and ready to receive messages...');

  } catch (error) {
    console.error('❌ Failed to start bot:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

// Start the application
start();
