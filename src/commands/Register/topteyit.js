const { Client, Message, MessageEmbed} = require("discord.js");
const Kullanici = require('../../../Database/Schema/Users')
const Config = require('../../settings/Config.json')
require('djs-linereply');

module.exports = {
    Isim: "topteyit",
    Komut: ["Topteyit"],
    Kullanim: "topteyit",
    Aciklama: "Sunucu genelindeki teyit sıralamasını gösterir.",
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
    let embed = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor(Config.Bot.Color).setFooter(Config.Bot.Footer,`${client.users.cache.get(Config.Permissions.Sahip).avatarURL({ dynamic: true })}`).setTimestamp()
    if(!message.member.roles.cache.has(Config.Permissions.Register) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
    const all = await Kullanici.find().sort({ Toplamteyit: "descending" });
    let teyit = all.map((value, index) => `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(value.id)} toplam teyitleri \`${value.Teyitler.filter(v => v.Cinsiyet === "erkek").length + value.Teyitler.filter(v => v.Cinsiyet === "kadın").length}\` (\`${value.Teyitler.filter(v => v.Cinsiyet === "erkek").length || 0}\` erkek, \`${value.Teyitler.filter(v => v.Cinsiyet === "kadın").length || 0}\` kadın)`).slice(0, 20)
    message.lineReplyNoMention(embed.setDescription(`${teyit.join("\n") || "Teyit verisi bulunamadı!"}`));
    }
};
