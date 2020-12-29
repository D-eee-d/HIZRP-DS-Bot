const discord = require("discord.js");
const bot = new discord.Client({
  disableEveryone: true
});

const lib = require("./lib/functions");
const token = require("./config.json").bot.token;

bot.commands = new discord.Collection();
bot.aliases = new discord.Collection();
bot.afk = new Map();

lib.setup(bot);

module.exports.bot = bot;

bot.login(token);