const config = require('../../config.json');

module.exports.run = async (bot, msg, args) => {

    let flag = false

    for(let id in config.AdminRoles.Discord){
        role = msg.member.roles._roles.find(role => id)
        if(role != undefined){
            flag = true
        }
    }

    if(!flag){
        return
    }

    if(args[1] === undefined){
        msg.reply("Вы не указали причину!!")
        return 0
    }

    const user = msg.mentions.users.first();
    if (user) {
        const member = msg.guild.member(user);
        const role = msg.guild.roles.cache.find(role => role.id === config.AdminRole.voicemute);

        if (member) {
            member.roles.add(role)
            .then(msg.channel.send(`Администратор <@${msg.author.id}> снял **блокировку микрофона** <@${member.id}> по причине: '${args[1]}'`))
            .catch(console.error)
        } else {
            msg.reply("Участника нету на сервере!");
        }
    }
    else {
        msg.reply("Вы не указали кого нужно замутить");
    }
};

module.exports.help = {
    name: 'voicemute',
    aliases: []
};
