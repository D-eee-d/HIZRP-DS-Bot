const {bot} = require('../main');
const config = require("../config.json");
const text = require("../language/ru.json");
const lib = require("../lib/functions");

bot.on('message', async msg => {
	if(msg.author.bot) return;
    if(msg.channel.type  == "dm") msg.reply(`${text.dm_message}`);

    if(msg.channel.id === config.bot.commandstaff || msg.channel.id === config.bot.commandmoder){
        let prefix = config.bot.prefix;
        let args = msg.content.slice(prefix.length).trim().split(' ');
        let cmd = args.shift().toLowerCase();
        let command;

        if (bot.commands.has(cmd)) {
            command = bot.commands.get(cmd); 
        }
        else {
            command = bot.commands.get(bot.aliases.get(cmd));
        }

        if(command){
            command.run(bot, msg, args)
            msg.delete()
        } 
    }
    else lib.CheckMessage(bot,msg)
});
