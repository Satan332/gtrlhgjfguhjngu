const { Client, Message, MessageEmbed} = require("discord.js");
const Kullanici = require('../../../Database/Schema/Users')
const Config = require('../../settings/Config.json')
require('djs-linereply');

module.exports = {
    Isim: "say",
    Komut: ["Say"],
    Kullanim: "say",
    Aciklama: "",
    Kategori: "Moderation",
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!message.member.roles.cache.has(Config.Permissions.Register) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return

    let Tag = message.guild.members.cache.filter(member => member.user.username.includes("Savage")).size;
    let Tags = message.guild.members.cache.filter(member => member.user.username.includes("'")).size;
    let Etiket = message.guild.members.cache.filter(member => member.user.discriminator.includes("1947")).size;
    let Toplam = Tag + Tags + Etiket;

    embed = new MessageEmbed()
    .setDescription(`
    \`•\` Seste toplam **${message.guild.members.cache.filter(s => s.voice.channel).size}** kullanıcı var.
    \`•\` Toplam **${Toplam}** kişi tagımıza sahip.
    \`•\` Sunucumuzda toplam **${message.guild.memberCount}** üye var.
    \`•\` Sunucumuza toplam **${message.guild.premiumSubscriptionCount}** takviye yapılmış.`)
    message.channel.send(embed)
   }
 }