// Discord bot
// Requires read and message management perms in the channel specified in config.

// Initialisation

const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config({ path: require("find-config")(".env") } );
const token = process.env.BOT_TOKEN;
const config = require("./config.json");

const url = "mongodb://localhost:27017/maddosh-counter";
const { MongoClient } = require("mongodb");
myMongoClient = new MongoClient(url);


// init testing db -- change on deployment
async function init_db() {
	try {
		await myMongoClient.connect();
		console.log("Initialising...");
		let dbo = myMongoClient.db("maddosh-counter");
		const aggCursor = dbo.collection("messages").aggregate([{ $out: "messages-test" }]); // assumes that messages-test is already a db!!! don't be stupid like i was
		for await (const doc of aggCursor) {
			console.log(doc);
		}
	} finally {
		console.log("Initialised")
	  	await myMongoClient.close();
	}
}

async function get_latest_num() {
	let latest;
	try {
		console.log("Getting latest_num...");
		await myMongoClient.connect();
		const collection = myMongoClient.db("maddosh-counter").collection("messages-test");
		latest = await collection.find().sort({_id:-1}).limit(1).toArray();
	} finally {
		console.log("Got latest_num");
		await myMongoClient.close();
		return [ parseInt(latest[0]["Content"], 10), latest[0]["AuthorID"] ];
	}
}

async function add_num(message) {
	try {
		const num = message.content;
		console.log(`Adding ${num} to db...`);
		await myMongoClient.connect();
		const collection = await myMongoClient.db("maddosh-counter").collection("messages-test");
		const attachments = reactions = [];
		await message.attachments.each((s, a, c) => { attachments.push(a.url) });
		await message.reactions.cache.each((s, mr, r) => { reactions.push(`${mr.name} (${mr.count})`) });
		const entry = {			
			AuthorID: message.author.id,
			Author: message.author.tag,
			Date: message.createdTimestamp,
			Content: num,
			Attachments: attachments,
			Reactions: reactions
		}
		await collection.insertOne(entry);
	} finally {
		console.log(`Added ${message.content}`);
		await myMongoClient.close();
	}
}

async function throw_counting_error(message, correct_num) {
	message.author.createDM().then(async (channel) => {
		await channel.send(`The next number should be **${correct_num}**! I've deleted your number, but if this is a mistake, please contact Bowen.`);
	});
	message.delete();
}

async function throw_user_error(message) {
	message.author.createDM().then(async (channel) => {
		await channel.send(`You can't count twice in a row! I've deleted your number, but if this is a mistake, please contact Bowen.`);
	});
	message.delete();
}

// ty SO

const isNumeric = n => { return !isNaN(parseFloat(n)) && isFinite(n); }

init_db()
	.then(async () => {
		let [ latest_num, latest_author ] = await get_latest_num();
		const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

		client.on("messageCreate", async (message) => {
			if (message.author.bot) return false;
			if (message.channel.id !== config["counting-channel"]) return false;
			if (latest_author === message.author.id) {
				await throw_user_error(message);
				return false;
			}
			if (!isNumeric(message.content) || parseInt(message.content, 10) != latest_num + 1) {
				await throw_counting_error(message, latest_num + 1);
				return false;
			}
			await add_num(message);
			[ latest_num, latest_author ] = await get_latest_num(); // sanity check
			return true;
		});

		client.once("ready", () => {
			console.log("Ready!");
		});

		client.login(token);
	})
	.catch(console.dir);