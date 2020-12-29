const {bot} = require('../main');
const config = require("../config.json");

bot.on('voiceStateUpdate', (oldState, newState) => {

    if(newState.channelID != null){
        if(newState.channel.parentID === config.ChannelCreate.CategoryID && newState.channelID === config.ChannelCreate.ChannelID){
            newState.guild.channels.create(`🦊 | Канал: #${newState.member.user.discriminator}`, {
                type: `voice`,
                parent: newState.channel.parent,
                permissionOverwrites: [
                    {
                        id: newState.member.id,
                        allow: ['MANAGE_CHANNELS'],
                    },
                ]
            }).then(channel => {
                newState.member.edit({channel: channel})
            })
        }
    }

    if(oldState.channelID != null){
        if(oldState.channel.parentID === config.ChannelCreate.CategoryID && oldState.channelID != config.ChannelCreate.ChannelID){
            if(oldState.channel.members.size === 0 ){
                oldState.channel.delete()
            }
        }
    }
});