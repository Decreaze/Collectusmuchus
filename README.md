# Collectusmuchus

A Telegram bot for auto-collecting and applying bonus codes to stake.com accounts.

## Features

- 🤖 Telegram bot integration
- 💰 Automatic bonus code detection
- 🎯 Auto-apply codes to stake.com
- 📊 Track applied codes and history
- ⏰ Scheduled bonus code checking
- 🔔 User notifications

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Telegram Bot Token (from @BotFather)
- Stake.com API access (if applicable)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Decreaze/Collectusmuchus.git
cd Collectusmuchus
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

## Configuration

### Get Your Telegram Bot Token

1. Open Telegram and search for @BotFather
2. Send `/start` and follow the instructions
3. Create a new bot and copy the token
4. Paste the token in your `.env` file

### Stake.com API Configuration

Add your stake.com API credentials to the `.env` file:
```
STAKE_API_KEY=your_api_key
STAKE_API_URL=https://api.stake.com
```

## Usage

### Development Mode

```bash
npm run dev
```

This will start the bot with auto-reload on file changes (requires nodemon).

### Production Mode

```bash
npm start
```

## Project Structure

```
Collectusmuchus/
├── src/
│   ├── index.js              # Main bot entry point
│   ├── bot.js                # Telegram bot configuration
│   ├── handlers/             # Command and message handlers
│   │   ├── commandHandler.js
│   │   └── messageHandler.js
│   ├── services/             # Business logic
│   │   ├── stakeService.js   # Stake.com API interactions
│   │   ├── codeCollector.js  # Code detection and collection
│   │   └── database.js       # Database operations
│   └── utils/                # Utility functions
│       └── logger.js
├── data/                     # Database files (gitignored)
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## Bot Commands

- `/start` - Start the bot and see welcome message
- `/help` - Get help information
- `/status` - Check bot status
- `/settings` - Configure your preferences
- `/history` - View applied codes history

## Roadmap

- [ ] Implement Telegram bot commands
- [ ] Create bonus code parser
- [ ] Build stake.com API integration
- [ ] Set up SQLite database
- [ ] Add automatic code application
- [ ] Create user management system
- [ ] Add error logging and monitoring
- [ ] Deploy to cloud service

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
