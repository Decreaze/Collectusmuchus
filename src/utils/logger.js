const fs = require('fs');
const path = require('path');

const LOG_DIR = './logs';
const DEBUG = process.env.DEBUG === 'true';

// Create logs directory if it doesn't exist
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logFile = path.join(LOG_DIR, `bot-${new Date().toISOString().split('T')[0]}.log`);

function getTimestamp() {
  return new Date().toISOString();
}

function writeToFile(message, level) {
  const logMessage = `[${getTimestamp()}] [${level}] ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
}

const logger = {
  info: (message) => {
    const msg = `ℹ️ ${message}`;
    console.log(msg);
    writeToFile(message, 'INFO');
  },
  error: (message) => {
    const msg = `❌ ${message}`;
    console.error(msg);
    writeToFile(message, 'ERROR');
  },
  warn: (message) => {
    const msg = `⚠️ ${message}`;
    console.warn(msg);
    writeToFile(message, 'WARN');
  },
  debug: (message) => {
    if (DEBUG) {
      const msg = `🐛 ${message}`;
      console.log(msg);
      writeToFile(message, 'DEBUG');
    }
  },
  success: (message) => {
    const msg = `✅ ${message}`;
    console.log(msg);
    writeToFile(message, 'SUCCESS');
  }
};

module.exports = logger;
