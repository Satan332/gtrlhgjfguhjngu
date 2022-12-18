const { Message, MessageEmbed } = require("discord.js");
const Config = require('../settings/Config.json')
/**
* @param {Message} message 
*/

module.exports = (message) => {
  if (message.author.bot || !message.content.startsWith(Config.System.Prefix) || !message.channel || message.channel.type == "dm") return;
  let args = message.content.substring(Config.System.Prefix.length).split(" ");
  let komutcuklar = args[0];
  let bot = message.client;
  args = args.splice(1);
  let calistirici;
  if (bot.komut.has(komutcuklar)) {
    calistirici = bot.komut.get(komutcuklar);
    calistirici.onRequest(bot, message, args);
  } else if (bot.komutlar.has(komutcuklar)) {
    calistirici = bot.komutlar.get(komutcuklar);
    calistirici.onRequest(bot, message, args);
  }
}

module.exports.config = {
  Event: "message"
}