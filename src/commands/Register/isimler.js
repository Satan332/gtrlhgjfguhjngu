const { Client, Message, MessageEmbed} = require("discord.js");
const Kullanici = require('../../../Database/Schema/Users')
const Config = require('../../settings/Config.json')
require('djs-linereply');

module.exports = {
    Isim: "isimler",
    Komut: ["isimsorgu"],
    Kullanim: "isimler <@Akronumia/ID>",
    Aciklama: "Belirlenen üyenin önceki isim ve yaşlarını gösterir.",
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
    let kullanıcı = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    let uye = message.guild.member(kullanıcı);
    if (!uye) return message.channel.send(cevaplar.üyeyok);
    let isimveri = await Kullanici.findOne({ id: uye.id }) || [];
    if(isimveri.Isimler) {
    let isimler = isimveri.Isimler.length > 0 ? isimveri.Isimler.reverse().map((value, index) => `\`${index + 1}.\` \`${Config.Guild.Tag} ${value.Isim} | ${value.Yas}\` (${value.islembilgi}) Yetkili: ${value.Yetkili ? "<@"+ value.Yetkili + ">" : ""}`).join("\n") : "";
	message.channel.send(embed.setDescription(`${uye} (\`${uye.user.tag}\`) kişisinin toplamda **${isimveri.Isimler.length || 0}** isim kayıtı bulundu.\n\n${isimler}`));
    } else {
        message.lineReplyNoMention(`${uye} ${uye.user.tag} kişisinin isim kayıtı bulunamadı.`);
     }
    }
};
