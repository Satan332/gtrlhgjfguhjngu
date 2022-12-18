const { Client, Message, MessageEmbed} = require("discord.js");
const Kullanici = require('../../../Database/Schema/Users');
const Config = require('../../settings/Config.json');
const moment = require("moment");
require('djs-linereply');

module.exports = {
    Isim: "isim",
    Komut: ["i","nick"],
    Kullanim: "isim <@Akronumia/ID> <İsim> <Yaş>",
    Aciklama: "Belirlenen üye sunucuda kayıtsız ise isim değiştirildikten `.e` ile erkek olarak `.k` ile kadın olarak kayıt edebilirsiniz kayıtlı ise sadece isim değiştirir.",
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
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${Config.System.Prefix}${module.exports.Isim} <@Akronumia/ID> <Isim> <Yaş>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi).then(x => x.delete({timeout: 5000}));
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz).then(x => x.delete({timeout: 5000}));
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust).then(x => x.delete({timeout: 5000}));
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if (yaş < Config.Ayar.MinYas) return message.channel.send(cevaplar.yetersizyaş).then(x => x.delete({timeout: 5000}));
    if(!isim || !yaş) return message.channel.send(cevaplar.argümandoldur + ` \`${Config.System.Prefix}${module.exports.Isim} <@Akronumia/ID> <Isim> <Yaş>\``);
    setName = `${Config.Guild.SecondryTag} ${isim} | ${yaş}`;
    uye.setNickname(`${setName}`).catch(err => message.channel.send(cevaplar.isimapi));
    var filter = msj => msj.author.id === message.author.id && msj.author.id !== client.user.id;
    await Kullanici.updateOne({ id: uye.id }, { $push: { "Isimler": { Yetkili: message.member.id, Zaman: Date.now(), Isim: isim, Yas: yaş, islembilgi: "İsim Güncelleme" } } }, { upsert: true }).exec();
    let isimveri = await Kullanici.findOne({ id: uye.id }) || [];
    let isimler = isimveri.Isimler.length > 0 ? isimveri.Isimler.reverse().map((value, index) => `\`${index+1}.\` \`${Config.Guild.Tag} ${value.Isim} | ${value.Yas}\` (${value.islembilgi}) ${value.Yetkili ? "(<@"+ value.Yetkili + ">)" : ""}`).join("\n") : "";
    message.guild.kanalBul("isim-log").send(embed.setDescription(`${uye} adlı kullanıcı ${message.author} (\`${message.author.tag}\`) Tarafından \`${setName}\` Olarak İsmi \`${moment(Date.now()).format("LLL")}\` Tarihinde Değiştirildi.`))
    message.channel.send(embed
    .setDescription(`${uye} kişisinin ismi başarıyla "**${isim} | ${yaş}**" olarak değiştirildi, bu üye daha önce bu isimlerle kayıt olmuş.
    \n${client.emojis.cache.get(Config.Others.RedTick)} Kişinin toplamda **${isimveri.Isimler.length}** isim kayıtı bulundu:
${isimler}`)).then(message.react(Config.Others.CheckTick)).then(x => x.delete({timeout: 60000}))
  }
};

