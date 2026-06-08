const { extractCodesFromText, isValidCodeFormat } = require('../services/codeCollector');
const { run, query } = require('../services/database');
const { applyBonusCode } = require('../services/stakeService');

function handleMessages(bot) {
  // Handle all messages
  bot.on('message', async (msg) => {
    // Skip command messages (handled by handleCommands)
    if (msg.text && msg.text.startsWith('/')) {
      return;
    }

    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text || '';

    try {
      // Ensure user exists in database
      await ensureUserExists(userId, msg.from.username);

      // Extract potential bonus codes from message
      const codes = extractCodesFromText(text);

      if (codes.length > 0) {
        // Found potential codes!
        console.log(`🎯 Found ${codes.length} potential code(s):`, codes);

        // Get user's stake.com settings
        const userSettings = await getUserSettings(userId);

        if (!userSettings.stake_user_id) {
          // User hasn't set up their account yet
          const response = `
⚠️ I found potential bonus codes: ${codes.join(', ')}

But I don't have your stake.com account information yet!

🔐 Please set up your account first:
/settings
          `;
          bot.sendMessage(chatId, response);
          return;
        }

        // User is set up - try to apply codes
        let appliedCount = 0;
        let failedCount = 0;
        const results = [];

        for (const code of codes) {
          try {
            console.log(`💾 Attempting to apply code: ${code}`);

            // Apply the code
            const result = await applyBonusCode(code, userSettings.stake_user_id);

            // Store in database
            await run(
              `INSERT INTO applied_codes (user_id, code, status, response) 
               VALUES ((SELECT id FROM users WHERE telegram_id = ?), ?, ?, ?)`,
              [userId, code, result.success ? 'success' : 'failed', JSON.stringify(result)]
            );

            if (result.success) {
              appliedCount++;
              results.push(`✅ ${code} - Applied successfully!`);
            } else {
              failedCount++;
              results.push(`❌ ${code} - Failed: ${result.error || 'Unknown error'}`);
            }
          } catch (error) {
            failedCount++;
            results.push(`❌ ${code} - Error: ${error.message}`);
          }
        }

        // Send summary
        const summary = `
🎉 Code Processing Complete!

✅ Applied: ${appliedCount}
❌ Failed: ${failedCount}

Details:
${results.join('\n')}
        `;
        bot.sendMessage(chatId, summary);

      } else if (text.length > 0) {
        // No codes found, but user sent a message
        const response = `
👋 Thanks for your message!

💬 I received: "${text}"

💡 I'm looking for bonus codes in your messages. When I find them, I'll automatically apply them to your stake.com account!

🔧 Make sure you've set up your account:
/settings
        `;
        bot.sendMessage(chatId, response);
      }
    } catch (error) {
      console.error('❌ Error handling message:', error);
      bot.sendMessage(chatId, `❌ Error: ${error.message}`);
    }
  });
}

// Helper function to ensure user exists in database
async function ensureUserExists(telegramId, username) {
  try {
    const user = await query(
      'SELECT id FROM users WHERE telegram_id = ?',
      [telegramId]
    );

    if (user.length === 0) {
      await run(
        'INSERT INTO users (telegram_id, username) VALUES (?, ?)',
        [telegramId, username || 'Unknown']
      );
    }
  } catch (error) {
    console.error('Error ensuring user exists:', error);
  }
}

// Helper function to get user settings
async function getUserSettings(telegramId) {
  try {
    const results = await query(
      `SELECT setting_key, setting_value FROM settings 
       WHERE user_id = (SELECT id FROM users WHERE telegram_id = ?)`,
      [telegramId]
    );

    const settings = {};
    results.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });

    return settings;
  } catch (error) {
    console.error('Error getting user settings:', error);
    return {};
  }
}

module.exports = { handleMessages };
