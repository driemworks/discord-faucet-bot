# Discord Bot Token Faucet

This is a discord bot for a basic token faucet for substrate based chains.

## Setup

First create a discord bot and connect it to a server. Make sure to copy its token.

Configure the faucet parameters by modifying `config.js`.

Create a .env file and specify  the fields:

``` sh
MNEMONIC="<the mnemonic for the faucet wallet>"
DISCORD_BOT_TOKEN="<your discord bot token>"
```

Run with 

``` sh
npm i
npm run start
```

Now you can navigate to your discord channel and use your bot.