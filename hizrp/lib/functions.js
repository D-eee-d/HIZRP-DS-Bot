const cheerio = require("cheerio");
const request = require("request");
const config = require("../config.json");
const BDConnect = require('./BD/BDmodule');
const BD = new BDConnect();

const fs = require("fs");
const path = require("path");

//
//      Для запуска бота
//

function find_nested(dir, pattern) {

    let results = [];

    fs.readdirSync(dir).forEach(inner_dir => {

        inner_dir = path.resolve(dir, inner_dir);
        const stat = fs.statSync(inner_dir);

        if (stat.isDirectory()) {
            results = results.concat(find_nested(inner_dir, pattern));
        }

        if (stat.isFile() && inner_dir.endsWith(pattern)) {
            results.push(inner_dir);
        }

    });
    
    return results;
}

const cmd_files = find_nested("./commands/", ".js");

module.exports.setup = (bot) => {

    console.log('********************************************')
    console.log('*                SETUP BOT ON              *')
    console.log('********************************************')

    if (cmd_files.length <= 0) return console.log("* There are no commands to load...");
    cmd_files.forEach(file => {
        const props = require(file);
        bot.commands.set(props.help.name, props);
        props.help.aliases.forEach(alias => {
            bot.aliases.set(alias, props.help.name);
        });
    });
    console.log(`* Loading ${cmd_files.length} commands.`);

    console.log('********************************************')

    fs.readdir("./events/", (err, files) => {   
        if (err) console.error(err);           
        let jsfiles = files.filter(f => f.split(".").pop() === "js");   
        if (jsfiles.length <= 0) return console.log("*\t There are no events to load...");
        console.log(`* Loading ${jsfiles.length} events.`);
        console.log('********************************************')
        jsfiles.forEach((f, i) => {
            require(`../events/${f}`);
            console.log(`* ${i + 1}: ${f} loaded!`);
        });
    });
};

//
//              Для mysql
//

function updateinfo(steamid,name,role,status){
    name = name.replace(`(${steamid})`,"")

    BD.call(`SELECT hours_day,balls FROM astats WHERE id = '${steamid}'`,function(err,results){
        if(err){console.log(err)}
        else{
            if(results[0] === undefined){
               BD.call(`INSERT INTO astats (id,name,role) VALUES ('${steamid}','${name}','${role}');`,function(err,results){
                    if(err) console.log(err)
                })
            }
            else{
                var timestamp = new Date().getHours()
                if(status === 'Сейчас в сети' && timestamp <= 23 && timestamp >= 6){
                    results[0].hours_day += 5
                    BD.call(`UPDATE astats set hours_day = ${results[0].hours_day},otpusk = 0 WHERE id = '${steamid}'`,function(err,results){
                        if(err) console.log(err)
                    })
                }
            }
        }
    })
}

function deleteuser(SteamIDList){
    BD.call(`SELECT id FROM astats`,function(err,results){
        if(err) console.log(err)
        else{
            for(var i = 0 in results){
                var FindSteamID = false
                for(var j = 0 in SteamIDList){
                    if(SteamIDList[j] === results[i].id){
                        FindSteamID = true
                    }
                }
                if(FindSteamID === false){
                    BD.call(`DELETE FROM astats WHERE id = '${results[i].id}'`,function(err,results){
                        if(err) console.log(err)
                    })
                }
            }
        }
    })
}

module.exports.СheckPrimeTime = (bot) => {
    var timestamp = new Date().getHours()

    if (timestamp >= 23){
        BD.call(`SELECT id, hours_day, balls, otpusk FROM astats`,function(err,results){
            if(err) console.log(err)
            else{
                for(var i = 0 in results){

                    var datastamp = new Date()
                    var otpuskstamp = new Date(results[i].otpusk)

                    if(results[i].hours_day >= 240){
                        results[i].balls += 5
                        results[i].otpusk = 0
                    }
                    else if(datastamp >= otpuskstamp){
                        results[i].balls -= 5
                    }
                    else{
                        results[i].balls -= 10
                        results[i].otpusk = 0
                    }

                    BD.call(`UPDATE astats set hours_day = 0,balls = ${results[i].balls} ,otpusk = ${results[i].otpusk} WHERE id = '${results[i].id}'`,function(err,results){
                        if(err) console.log(err)
                    })
                }
            }
        })
    }
}

//
//              Для парсинга
//

module.exports.ParsingOnline = (bot) => {
    request(config.Parser.urlonline, function(err, res, body){
        if(err) { console.log(err) }
        else{ 
            $ = cheerio.load(body);
            var online = $(`#main-container > div.content.content-boxed > div > div > div > div.block-content > div > div.col-xl-7 > div > div.col-md-12 > div:nth-child(1) > div.block-content > table > tbody > tr:nth-child(3) > td:nth-child(2)`).text().trim()
            online = online.slice(0, online.indexOf('/'));

            var guild = bot.guilds.cache.find(guild => guild.id === config.Guild.GuildID)  

            guild.edit({
                name: `${config.Guild.GuildName} ${online}`
            })
        }
    })

    request(config.Parser.topmoney, function(err, res, body){
        if(err) { console.log(err) }
        else{ 
            $ = cheerio.load(body);
            var user = $(`body > div:nth-child(2) > div.block-90-offset-005 > table > tbody > tr:nth-child(2) > td:nth-child(2)`).text().trim()
            user = user.slice(0, user.indexOf('(STEAM_'))
    
            var guild = bot.guilds.cache.find(guild => guild.id === config.Guild.GuildID)                
            var channel = guild.channels.cache.find(channel => channel.id === config.Guild.TopMoney)
            
            channel.edit({
                name: `${config.Guild.TopMoneyName} ${user}`
            })
        }
    })

    request(config.Parser.tophours, function(err, res, body){
        if(err) { console.log(err) }
        else{ 
            $ = cheerio.load(body);
            var user = $(`body > div > div:nth-child(1) > div.block-90-offset-005 > table > tbody > tr:nth-child(2) > td:nth-child(2)`).text().trim()
            user = user.slice(0, user.indexOf('(STEAM_'))
    
            var guild = bot.guilds.cache.find(guild => guild.id === config.Guild.GuildID)                
            var channel = guild.channels.cache.find(channel => channel.id === config.Guild.TopHours)
            
            channel.edit({
                name: `${config.Guild.TopHoursName} ${user}`
            })
        }
    })
};

module.exports.ParsingAdminActiviti = () =>{
    request(config.Parser.urladmin, function(err, res, body){
        if(err) { console.log(err) }
        else{ 
            $ = cheerio.load(body);

            const SteamIDList = [];
    
            $('td a').each(function(i, elem) {
                SteamIDList[i] = $(this).text();
            });
    
            var ind = 0;
            const InfoAdminList = [];
    
            $('tbody tr td').each(function(i, elem) {
                InfoAdminList[ind] = $(this).text()
                ind += 1
                if(ind === 5){
                    updateinfo(SteamIDList[InfoAdminList[0]-1],InfoAdminList[1],InfoAdminList[2],InfoAdminList[4])
                    ind = 0
                }
            });
    
            deleteuser(SteamIDList)
        }
    })
};

module.exports.CheckMessage = (bot,msg) =>{

    switch(msg.channel.id){
        case config.ModeratedChannel.video:
            if(!msg.content.includes('www.')){
                msg.delete()
            }
        break
        case config.ModeratedChannel.foto: 
            if(msg.nonce != null && !msg.content.includes('www.')){
                msg.delete()
            }
        break
        case config.ModeratedChannel.bugs:
            msg.delete()
            var channel = msg.guild.channels.cache.find(channel => channel.id === config.ModeratedChannel.savebugs)

            if(msg.nonce === null){
                for (var attach of msg.attachments) {
                    channel.send({
                        embed: {
                            color: 'PURPLE',
                            author: {
                                name: `${msg.author.tag} | ${msg.author.id}`,
                                icon_url: msg.author.avatarURL(),
                            },
                        description: "```" + msg.content + "```",
                        image: {
                            url: attach[1].attachment
                          },
                        }
                    })
                }
            }
            else{
                channel.send({
                    embed: {
                        color: 'PURPLE',
                        author: {
                            name: `${msg.author.tag} | ${msg.author.id}`,
                            icon_url: msg.author.avatarURL(),
                        },
                    description: "```" + msg.content + "```",
                    }
                })
            }
        break
    }
}