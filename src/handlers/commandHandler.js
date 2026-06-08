const { run, query } = require('../services/database');

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
1. Use /settings to add your stake.com account
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
2. Add your stake.com user ID
3. That's it!

🎯 Features:
- Auto-detection of bonus codes in messages
- Automatic code application to your account
- Code history tracking
- Real-time notifications

💡 How It Works:
1. Send me any message with bonus codes
2. I'll automatically detect them
3. I'll apply them to your stake.com account
4. I'll notify you of success/failure

⚠️ Important:
- Never share your API keys or credentials
- All data is stored securely
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
- Auto-apply: Ready

Use /settings to configure your preferences.
    `;
    bot.sendMessage(chatId, statusMessage);
  });

  // /settings command - NEW INTERACTIVE VERSION
  bot.onText(/^\/settings$/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const settingsMessage = `
⚙️ Settings & Configuration [UPDATED]

🔐 Account Setup:
To enable auto-applying bonus codes, I need your stake.com user ID.

📝 Steps:
1. Reply to this message with: setup YOUR_STAKE_USER_ID
   Example: setup 12345678

2. Once configured, I'll automatically:
   ✅ Detect bonus codes in messages
   ✅ Apply them to your account
   ✅ Notify you of results

💡 Where to find your User ID:
1. Log in to stake.com
2. Go to your profile/account settings
3. Look for your User ID or Account ID
4. Send it to me with: setup YOUR_ID

📊 Check your settings:
Reply with: status_settings
    `;
    bot.sendMessage(chatId, settingsMessage);
  });

  // /history command
  bot.onText(/^\/history$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    try {
      // Get applied codes from database
      const codes = await query(
        `SELECT code, applied_at, status FROM applied_codes 
         WHERE user_id = (SELECT id FROM users WHERE telegram_id = ?)
         ORDER BY applied_at DESC LIMIT 20`,
        [userId]
      );

      if (codes.length === 0) {
        const historyMessage = `
📜 Applied Codes History

No codes have been applied yet.

Once you set up your account (/settings), applied codes will appear here with timestamps.
        `;
        bot.sendMessage(chatId, historyMessage);
      } else {
        const codesList = codes.map(c => {
          const status = c.status === 'success' ? '✅' : '❌';
          const date = new Date(c.applied_at).toLocaleString();
          return `${status} ${c.code} - ${date}`;
        }).join('\n');

        const historyMessage = `
📜 Applied Codes History

Total codes: ${codes.length}

${codesList}
        `;
        bot.sendMessage(chatId, historyMessage);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      bot.sendMessage(chatId, `❌ Error fetching history: ${error.message}`);
    }
  });

  // Handle setup command (setup USER_ID)
  bot.onText(/^setup\s+(\d+)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const stakeUserId = match[1];

    try {
      // Ensure user exists
      const user = await query(
        'SELECT id FROM users WHERE telegram_id = ?',
        [userId]
      );

      if (user.length === 0) {
        await run(
          'INSERT INTO users (telegram_id, username) VALUES (?, ?)',
          [userId, msg.from.username || 'Unknown']
        );
      }

      // Get the user's database ID
      const userRecord = await query(
        'SELECT id FROM users WHERE telegram_id = ?',
        [userId]
      );
      const userDbId = userRecord[0].id;

      // Save or update stake user ID
      const existing = await query(
        'SELECT id FROM settings WHERE user_id = ? AND setting_key = ?',
        [userDbId, 'stake_user_id']
      );

      if (existing.length > 0) {
        await run(
          'UPDATE settings SET setting_value = ? WHERE user_id = ? AND setting_key = ?',
          [stakeUserId, userDbId, 'stake_user_id']
        );
      } else {
        await run(
          'INSERT INTO settings (user_id, setting_key, setting_value) VALUES (?, ?, ?)',
          [userDbId, 'stake_user_id', stakeUserId]
        );
      }

      const confirmMessage = `
✅ Account Setup Complete!

🎯 Your stake.com User ID: ${stakeUserId}

🚀 You're all set! Now:
1. Send me any message with bonus codes
2. I'll automatically detect and apply them
3. You'll get notifications for each code

💡 Example: Send "My bonus code is STAKE2024"
       `;
      bot.sendMessage(chatId, confirmMessage);
      console.log(`✅ User ${userId} set up with stake ID: ${stakeUserId}`);
    } catch (error) {
      console.error('Error setting up user:', error);
      bot.sendMessage(chatId, `❌ Error setting up account: ${error.message}`);
    }
  });

  // Handle status_settings command
  bot.onText(/^status_settings$/i, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    try {
      const results = await query(
        `SELECT setting_key, setting_value FROM settings 
         WHERE user_id = (SELECT id FROM users WHERE telegram_id = ?)`,
        [userId]
      );

      if (results.length === 0) {
        bot.sendMessage(chatId, `
⚙️ Your Settings:

❌ No account configured yet!

Set up your account: /settings
        `);
      } else {
        let settingsText = `
⚙️ Your Settings:

`;
        results.forEach(row => {
          settingsText += `✅ ${row.setting_key}: ${row.setting_value}\n`;
        });

        settingsText += `
🔧 To change settings, use /settings again\n        `;
        bot.sendMessage(chatId, settingsText);
      }
    } catch (error) {
      console.error('Error getting settings:', error);
      bot.sendMessage(chatId, `❌ Error: ${error.message}`);
    }
  });
}

module.exports = { handleCommands };
