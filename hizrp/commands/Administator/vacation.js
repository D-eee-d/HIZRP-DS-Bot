const config = require('../../config.json');
const BDConnect = require('../../lib/BD/BDmodule');
const BD = new BDConnect();

module.exports.run = async (bot, msg, args) => {

    let flag = false

    for(let id in config.AdminRoles.Owner){
        role = msg.member.roles._roles.find(role => id)
        if(role != undefined){
            flag = true
        }
    }

    if(!flag){
        return
    }

    if (args[0] === undefined || args[1] === undefined){
        msg.channel.send("Что-то пошло не по плану...\n-> /отпуск [SteamID] [Время в днях]")
        return 0
    }

    steamid = args[0]
    day = parseInt(args[1])

    BD.call(`SELECT name FROM astats WHERE id = '${steamid}'`,async function(err,results){
        if(err){console.log(err)}
        else{
            if(results[0] === undefined){
                await msg.channel.send(`Администратор с SteamID '${steamid}' не найден`);
            }
            else{
                var timestamp = new Date()
                timestamp.setDate(timestamp.getDate() + day)
                
                BD.call(`UPDATE astats set otpusk = '${timestamp}' WHERE id = '${steamid}'`,function(err,results){
                    if(err) console.log(err)
                })

                await msg.channel.send(`Вы отправили в отпуск '${results[0].name}' на ${args[1]} дней`);
            }
        }
    })
};

module.exports.help = {
    name: 'отпуск',
    aliases: []
};
