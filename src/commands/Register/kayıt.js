const { Client, Message, MessageEmbed} = require("discord.js");
const { RegisterDB } = require('../../../Database/wonxenDatabase');
const Config = require('../../settings/Config.json')
require('djs-linereply');

const tepkiler = [
    Config.Others.Erkek,
    Config.Others.Kadın,
];

module.exports = {
    Isim: "kayıt",
    Komut: ["kay","k"],
    Kullanim: "kayıt <@Akronumia/ID> <isim> <yaş>",
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
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!message.member.roles.cache.has(Config.Permissions.Register) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${Config.System.Prefix}${module.exports.Isim} <@Akronumia/ID> <Isim> <Yaş>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi).then(x => x.delete({timeout: 5000}));
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz).then(x => x.delete({timeout: 5000}));
    
    if(uye.roles.cache.has(Config.Role.Man[0])) return message.channel.send(cevaplar.kayıtlı);
    if(uye.roles.cache.has(Config.Role.Woman[0])) return message.channel.send(cevaplar.kayıtlı);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust).then(x => x.delete({timeout: 5000}));
    if(Config.Ayar.TagliAlim != false && !uye.user.username.includes(Config.Guild.Tag) && !uye.roles.cache.has(Config.Role.Booster) && !uye.roles.cache.has(Config.Role.Vip) && !message.member.hasPermission('ADMINISTRATOR') && !Config.Permissions.Kurucu.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.taglıalım).then(message.react(Config.Others.RedTick)).then(x => x.delete({timeout: 5000}));
    if(Date.now()-uye.user.createdTimestamp < 1000*60*60*24*7 && !message.member.hasPermission('ADMINISTRATOR') && !Config.Permissions.Kurucu.some(oku => message.member.roles.cache.has(oku)) && !Config.Permissions.Yönetim.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.yenihesap).then(message.react(Config.Others.RedTick)).then(x => x.delete({timeout: 5000}));
    if(uye.roles.cache.has(Config.Role.Suspect) && uye.roles.cache.has(Config.Role.Jail) && uye.roles.cache.has(Config.Role.YasaklıTag) && !message.member.hasPermission('ADMINISTRATOR') && !Config.Permissions.Kurucu.some(oku => message.member.roles.cache.has(oku)) && !Config.Permissions.Yönetim.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.cezaliüye).then(message.react(Config.Others.RedTick)).then(x => x.delete({timeout: 5000}))    
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if (yaş < Config.Ayar.MinYas) return message.channel.send(cevaplar.yetersizyaş).then(message.react(Config.Others.RedTick)).then(x => x.delete({timeout: 5000}));
    if(!isim || !yaş) return message.channel.send(cevaplar.argümandoldur + ` \`${Config.System.Prefix}${module.exports.Isim} <@Akronumia/ID> <Isim> <Yaş>\``);
    setName = `${Config.Guild.SecondryTag} ${isim} | ${yaş}`;
    uye.setNickname(`${setName}`).catch(err => message.channel.send(cevaplar.isimapi));
   let wonxenkayit = await message.lineReply(`${uye} isimli kişinin cinsiyetini aşağıdaki tepkilerle belirleyin.`).then(async m => {
        await m.react(Config.Others.Erkek)
        await m.react(Config.Others.Kadın) 
        return m;
        }).catch(err => undefined);
    let tepki = await wonxenkayit.awaitReactions((reaction, user) => user.id == message.author.id && tepkiler.some(emoji => emoji == reaction.emoji.id), { errors: ["time"], max: 1, time: 15000 }).then(coll => coll.first()).catch(err => { message.lineReplyNoMention(`15 saniye boyunca cevap vermediği için kayıt işlemi iptal edildi.`).then(sil => sil.delete({timeout: 7500})); wonxenkayit.delete().catch(); return; });
    if(!tepki) return;
    wonxenkayit.delete()
    if (tepki.emoji.id == Config.Others.Erkek) {
        kayıtYap(uye, message.member, isim, yaş, "erkek")
        const erkek = new MessageEmbed()
        .setAuthor(message.author.tag,message.author.avatarURL({dynamic:true}))
        .setDescription(`\`•\` ${uye} Kullanıcıyı <@&${Config.Role.Man[0]}> rolünü vererek **Erkek** olarak kaydettim.\n\`•\` Kullanıcının ismi \`${setName}\` olarak güncelleyip veri tabanına kaydettim.`)
        .setFooter(Config.Bot.Footer,`${client.users.cache.get(Config.Permissions.Sahip).avatarURL({ dynamic: true })}`)
        .setTimestamp()
        message.lineReplyNoMention(erkek).then(message.react(Config.Others.CheckTick)).then(sil => sil.delete({timeout: 15000}));    } else {
    if (tepki.emoji.id == Config.Others.Kadın) {
        kayıtYap(uye, message.member, isim, yaş, "kadın")
        const kadın = new MessageEmbed()
        .setAuthor(message.author.tag,message.author.avatarURL({dynamic:true}))
        .setDescription(`\`•\` ${uye} Kullanıcıyı <@&${Config.Role.Woman[0]}> rolünü vererek **Kadın** olarak kaydettim.\n\`•\` Kullanıcının ismi \`${setName}\` olarak güncelleyip veri tabanına kaydettim.`)
        .setFooter(Config.Bot.Footer,`${client.users.cache.get(Config.Permissions.Sahip).avatarURL({ dynamic: true })}`)
        .setTimestamp()
        message.lineReplyNoMention(kadın).then(message.react(Config.Others.CheckTick)).then(sil => sil.delete({timeout: 15000}));
         } 
        }
    }
};

async function kayıtYap(uye, yetkili, isim, yaş, cinsiyet) {
    let rol;
    let rolver;
    if(cinsiyet === "erkek") {
        rol = Config.Role.Man[0]
        rolver = Config.Role.Man
    } else if(cinsiyet == "kadın") {
        rol = Config.Role.Woman[0]
        rolver = Config.Role.Woman
    }
    await uye.kayıtRolVer(rolver).then(wonxen => { if(uye.user.username.includes(Config.Guild.Tag)) uye.roles.add(Config.Role.Family) });
    await RegisterDB.kayıtBelirt(uye, isim, yaş, yetkili, `<@&${rol}>`, cinsiyet)
    yetkili.guild.kayıtLog(yetkili, uye, cinsiyet, "kayıt-log");
    client.channels.cache.get(Config.Channel.Chat).send(`:tada: ${uye} adlı üye aramıza yeni katıldı lütfen sıcak bir hoş geldin diyelim!`).then(x => x.delete({timeout: 12500}));
}
