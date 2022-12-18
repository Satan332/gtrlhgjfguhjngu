const { Client, Message, MessageEmbed} = require("discord.js");
const Kullanici = require('../../../Database/Schema/Users')
const Config = require('../../settings/Config.json')
require('djs-linereply');

module.exports = {
    Isim: "teyit",
    Komut: ["kayıtbilgi", "kayıtlar","kayıtlarım","kaydettiklerim","kayıt-info","teyit","teyitlerim"],
    Kullanim: "teyit <@Akronumia/ID>",
    Aciklama: "Belirtilen üye ve komutu kullanan üyenin teyit bilgilerini gösterir.",
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
    let kullanıcı = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    let uye = message.guild.member(kullanıcı);
    if (!uye) return message.channel.send(cevaplar.üyeyok);
    if(!message.member.roles.cache.has(Config.Permissions.Register) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
    let teyit = await Kullanici.findOne({ id: uye.id }) || [];
    let erkekTeyit = teyit.Teyitler.filter(v => v.Cinsiyet === "erkek").length
    let kizTeyit = teyit.Teyitler.filter(v => v.Cinsiyet === "kadın").length
    
    message.lineReplyNoMention(embed.setDescription(`${uye} (${uye.roles.highest})
    ─────────────────────
    \`➜\` Sunucu İsim: \`${message.guild.name}\`
    \`➜\` Discord İsim: \`${uye.user.tag}\`
    \`➜\` Discord ID: \`${uye.id}\`
    ─────────────────────
    \`💾\` Toplam **${erkekTeyit+kizTeyit}** kişiyi kaydetmiş.
    \`👨\` Toplam **${erkekTeyit}** kişiyi erkek olarak kaydetmiş.
    \`👩\` Toplam **${kizTeyit}** kişiyi kadın olarak kaydetmiş.`))
    }
};