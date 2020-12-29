const discord = require("discord.js");
const config = require('../../config.json');
const BDConnect = require('../../lib/BD/BDmodule');
const BD = new BDConnect();

module.exports.run = async (bot, msg, args) => {

    let flag = false

    for(let id in config.AdminRoles.Nabor){
        role = msg.member.roles._roles.find(role => id)
        if(role != undefined){
            flag = true
        }
    }

    if(!flag){
        return
    }

    BD.call("SELECT id,name, role, hours_day, balls, otpusk FROM astats WHERE 1 ORDER BY role",async function(err,results){
        if(err) console.log(err)
        else{
            let K_info = "",St_info = "",A_info = "",M_info = "",H_info = "";

            for(var i in results){
                results[i].hours_day = Math.trunc(results[i].hours_day / 60)

                if(results[i].otpusk != 0){
                    dateotpusk = new Date(results[i].otpusk)   
                    Day = dateotpusk.getDate()
                    Month =  dateotpusk.getMonth()
                }

                switch(results[i].role){
                    case 'Куратор': 
                        if(results[i].otpusk != 0){
                            K_info +=  `${results[i].name}[${results[i].id}] | В отпуске до ${Day}.${Month} | Баланс: ${results[i].balls} 💊 \n`
                        }
                        else{
                            K_info +=  `${results[i].name}[${results[i].id}] | Отыграл: ${results[i].hours_day}⌚ | Баланс: ${results[i].balls} 💊 \n`
                        }
                    break
                    case 'Старший администратор': 
                        if(results[i].otpusk != 0){
                            St_info +=  `${results[i].name}[${results[i].id}] | В отпуске до ${Day}.${Month} | Баланс: ${results[i].balls} 💊 \n`
                        }
                        else{
                            St_info +=  `${results[i].name}[${results[i].id}] | Отыграл: ${results[i].hours_day}⌚ | Баланс: ${results[i].balls} 💊 \n`
                        }
                    break
                    case 'Администратор': 
                        if(results[i].otpusk != 0){
                            A_info +=  `${results[i].name}[${results[i].id}] | В отпуске до ${Day}.${Month} | Баланс: ${results[i].balls} 💊 \n`
                        }
                        else{
                            A_info +=  `${results[i].name}[${results[i].id}] | Отыграл: ${results[i].hours_day}⌚ | Баланс: ${results[i].balls} 💊 \n`
                        }
                    break
                    case 'Модератор': 
                        if(results[i].otpusk != 0){
                            M_info +=  `${results[i].name}[${results[i].id}] | В отпуске до ${Day}.${Month} | Баланс: ${results[i].balls} 💊 \n`
                        }
                        else{
                            M_info +=  `${results[i].name}[${results[i].id}] | Отыграл: ${results[i].hours_day}⌚ | Баланс: ${results[i].balls} 💊 \n`
                        }
                    break
                    case 'Помощник': 
                        if(results[i].otpusk != 0){
                            H_info +=  `${results[i].name}[${results[i].id}] | В отпуске до ${Day}.${Month} | Баланс: ${results[i].balls} 💊 \n`
                        }
                        else{
                            H_info +=  `${results[i].name}[${results[i].id}] | Отыграл: ${results[i].hours_day}⌚ | Баланс: ${results[i].balls} 💊 \n`
                        }
                    break
                }
            }

            embed = new discord.MessageEmbed()
            .setAuthor("Статистика: ")
            .setColor(0x00AE86)
            .setFooter(`Вызвал ${msg.author.username}`)
            .setTimestamp()

            if(K_info != ""){
                embed.addField("Куратор:\n",K_info,false)
            }
            if(St_info != ""){
                embed.addField("Старшие администраторы:\n",St_info,false)
            }
            if(A_info != ""){
                embed.addField("Администраторы:\n",A_info,false)
            }
            if(M_info != ""){
                embed.addField("Модераторы:\n",M_info,false)
            }
            if(H_info != ""){
                embed.addField("Помощники:\n",H_info,false)
            }

            await msg.channel.send(embed=embed)
        }
    })
};

module.exports.help = {
    name: 'astats',
    aliases: []
};
