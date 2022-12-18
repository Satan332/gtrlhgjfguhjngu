const {MessageEmbed} = require("discord.js");
const Kullanici = require('../../../Database/Schema/Users')
const Config = require('../../settings/Config.json')
require('djs-linereply');
module.exports = {
    Isim: "kayıtsız",
    Komut: ["unregisted"],
    Kullanim: "kayıtsız <@Akronumia/ID>",
    Aciklama: "Belirlenen üyeyi kayıtsız üye olarak belirler.",
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
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!message.member.roles.cache.has(Config.Permissions.Register) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${Config.System.Prefix}${module.exports.Isim} <@Akronumia/ID>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    if(uye.roles.cache.has(Config.Role.Unregistered)) return message.channel.send(cevaplar.kayıtsız)
    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.channel.send(cevaplar.sebep);
    uye.setNickname(`${uye.user.username.includes(Config.Guild.Tag) ? Config.Guild.Tag : (Config.Guild.SecondryTag ? Config.Guild.SecondryTag : (Config.Guild.Tag || ""))} İsim | Yaş`)
    uye.rolTanımla(Config.Role.Unregistered)
    if(uye.voice.channel) uye.voice.kick()
    let data = await Kullanici.findOne({id: uye.id});
    if(data) {
    await Kullanici.updateOne({ id: uye.id }, { $push: { "Isimler": { Yetkili: message.member.id, Zaman: Date.now(), Isim: data.Isim, Yas: data.Yas, islembilgi: "Kayıtsıza Atıldı" } } }, { upsert: true }).exec();
    await Kullanici.updateOne({ id: uye.id }, { $set: { "Cinsiyet": new String } }, { upsert: true }).exec();
    };
    message.guild.kanalBul("kayıtsız-log").send(embed.setDescription(`${uye} isimli üye ${message.author} tarafından \`${tarihsel(Date.now())}\` tarihinde \`${sebep}\` nedeniyle kayıtsız üye olarak belirlendi.`))
    message.lineReply(`${uye} Adlı kullanıcı, ${message.author} tarafından, \`${sebep}\` sebebiyle kayıtsı olarak belirlendi.`);
    message.react(Config.Others.CheckTick)
    }
};
