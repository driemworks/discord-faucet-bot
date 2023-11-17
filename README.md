# Discord Bot Token Faucet

This is a discord bot for a basic token faucet for substrate based chains.

## Setup

- Configure the faucet parameters by modifying `config.js`.
Create a .env file and specify  the fields:

``` 
MNEMONIC="<the mnemonic for the faucet wallet>"
DISCORD_BOT_TOKEN="<your discord bot token>"
```

Run with 

``` sh
npm i
npm run start
```