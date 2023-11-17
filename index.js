import "dotenv/config.js";
import { Client, GatewayIntentBits } from 'discord.js';
// @ts-ignore
import { LRUCache } from "lru-cache";
import Faucet from './faucet.js';
import { EventEmitter } from 'events'
import { rword } from 'rword';

/// options for the LRU cache
const options = {
  max: 500,

  // for use with tracking overall storage size
  maxSize: 5000,
  sizeCalculation: (value, key) => {
    return 1
  },

  // for use when you need to clean up something when objects
  // are evicted from the cache
  dispose: (value, key) => {
    freeFromMemoryOrWhatever(value)
  },

  // how long to live in ms
  ttl: 1000 * 60 * 5,

  // return stale items before removing from cache?
  allowStale: false,

  updateAgeOnGet: false,
  updateAgeOnHas: false,

  // async method to use for cache.fetch(), for
  // stale-while-revalidate type of behavior
  fetchMethod: async (
    key,
    staleValue,
    { options, signal, context }
  ) => {},
}

const cache = new LRUCache(options);
const client = new Client({ intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.MessageContent,
] });
import config from './config.js';
const faucet = new Faucet(config);

const eventEmitter = new EventEmitter();

/**
 * The 'ready' endpoint
 * 
 * initializes the faucet
 * 
 */
client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await faucet.init();
});

/**
 * The 'messageCreate' endpoint
 * 
 * `ping`: basic liveness check
 * `config.drip`: the drip command, executes the faucet
 * 
 */
client.on('messageCreate', async message => {
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  switch (args[0]) {
    case "ping":
      message.reply("Pong!");
      break;
    case config.drip: 
        if (!cache.has(message.author.id)) {
          // generate a random number
          let processId = rword.generate(3).join("-");
          console.log('Starting process with id: ' + processId);
          await faucet.drip(args[1], processId, eventEmitter);
          eventEmitter.on(processId, async out => {
            await message.reply(out);
          })
          cache.set(message.author.id, 1, 1000 * 60 * 60 * config.limit);
        } else {
          await message.reply(
            `Please wait for ${config.limit} hours between token requests from the same account!`
          );
        }
        break;
    default:
        break;
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);