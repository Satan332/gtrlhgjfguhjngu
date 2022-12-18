const { Client, Message, MessageEmbed } = require("discord.js");
const Kullanici = require('../../../Database/Schema/Users')
const Config = require('../../settings/Config.json')
require('djs-linereply');

module.exports = {
    Isim: "vip",
    Komut: ["Vip","special"],
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
        if (!message.member.roles.cache.has(Config.Permissions.Register) && !message.member.hasPermission("ADMINISTRATOR")) return
        let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!uye) return message.channel.send("Hata: `Üye bulunamadı` Lütfen bir üye etiketleyin veya ID giriniz! __Örn:__ `<@Akronumia/ID>`");
        if (!uye.roles.cache.has(Config.Role.Vip)) {
            const vermek = new MessageEmbed()
            .setAuthor(message.guild.name,message.guild.iconURL({dynamic:true}))
            .setDescription(`${uye} kişisine <@&${Config.Role.Vip}> rolü verildi.`)
            .setFooter(Config.Bot.Footer,`${client.users.cache.get(Config.Permissions.Sahip).avatarURL({ dynamic: true })}`)
            .setTimestamp()
            await message.lineReply(vermek).then(uye.roles.add(Config.Role.Vip)).then(message.react(Config.Others.CheckTick)).then(x => x.delete({timeout: 10000}));
        } else {
            const almak = new MessageEmbed()
            .setAuthor(message.guild.name,message.guild.iconURL({dynamic:true}))
            .setDescription(`${uye} kişisine <@&${Config.Role.Vip}> rolü alındı.`)
            .setFooter(Config.Bot.Footer,`${client.users.cache.get(Config.Permissions.Sahip).avatarURL({ dynamic: true })}`)
            .setTimestamp()
            await message.lineReply(almak).then(uye.roles.remove(Config.Role.Vip)).then(message.react(Config.Others.CheckTick)).then(x => x.delete({timeout: 10000}));
        }
    }
}