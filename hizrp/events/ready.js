const {bot} = require('../main');
const lib = require("../lib/functions");
const config = require("../config.json");

bot.on("ready", async () => {

    console.log('********************************************')
    console.log('*                BOT IS READY              *')
    console.log('********************************************')

    console.log(`* ${bot.user.username} is ready for action!`);

    if (config.activity.status == true) {
        bot.user.setActivity(`${config.activity.name}`, { type: `${config.activity.option}`})
            .then(presence => console.log(`* Activity set to ${presence.activities[0].name}`))
            .catch(console.error);
    } 

    console.log('********************************************')

    setInterval(function(){
        lib.ParsingOnline(bot);
    },1 * 60 * 1000);  // кд в 1 минуту
    
    setInterval(function(){
        lib.ParsingAdminActiviti();
    },5 * 30 * 1000);  // кд в 5 минуту  

    setInterval(function(){
        lib.СheckPrimeTime();
    },60 * 30 * 1000);
});
