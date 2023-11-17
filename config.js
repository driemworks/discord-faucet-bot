"use strict";
const config = {
    // the command to get tokens from the faucet
    drip: '!drip',
    prefix: '/',
    // the token symbol
    symbol: 'ETF',
    // decimals in the token
    decimals: 12,
    // an rpc node
    ws: 'wss://etf1.idealabs.network:443',
    // the ss58 address type
    address_type: 42,
    // the amount to send per drip
    amount: 100,
    // The time limit for sending requests is in hours.
    limit: 12
};

export default config;