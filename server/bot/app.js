// Discord bot

const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ path: require('find-config')('.env') } );
const token = process.env.BOT_TOKEN;

console.log(process.env)

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
	console.log('Ready!');
});

client.login(token);