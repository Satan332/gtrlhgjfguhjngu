const { Message, MessageEmbed } = require("discord.js");
const Config = require('../settings/Config.json')
/**
* @param {Message} message 
*/

module.exports = (message) => {
  
    if (message.content.toLowerCase() === "tag" || message.content.toLowerCase() === "!tag" || message.content.toLowerCase() === ".tag") {
        message.lineReply(`\`Savage, savage, ', #1947\``);
    }

}

module.exports.config = {
  Event: "message"
}