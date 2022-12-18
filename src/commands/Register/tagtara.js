const { Client, Message, MessageEmbed } = require("discord.js");
const Kullanici = require('../../../Database/Schema/Users')
const Config = require('../../settings/Config.json')
require('djs-linereply');

module.exports = {
    Isim: "tagtara",
    Komut: ["tag-tara", "tt"],
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
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        let tag = Config.Guild.Tag;
        let tag2 = "'";
        let etiket = "1947";
        let rol = Config.Role.Family;
        let taglilar = message.guild.members.cache.filter(s => s.user.username.includes(tag) && !s.roles.cache.has(rol))
        let taglilar2 = message.guild.members.cache.filter(s => s.user.username.includes(tag2) && !s.roles.cache.has(rol))
        let etiketliler = message.guild.members.cache.filter(s => s.user.discriminator.includes(etiket) && !s.roles.cache.has(rol))
        taglilar.array().forEach(async (member, index) => {
            setTimeout(async () => {
                if (member.user.bot) return
                await member.roles.add(rol)
            }, index * 1000)
        })
        taglilar2.array().forEach(async (member, index) => {
            setTimeout(async () => {
                if (member.user.bot) return
                await member.roles.add(rol)
            }, index * 1000)
        }) 
        etiketliler.array().forEach(async (member, index) => {
            setTimeout(async () => {
                if (member.user.bot) return
                await member.roles.add(rol)
            }, index * 1000)
        })
        let toplam = taglilar.size + etiketliler.size + taglilar2.size
        if (toplam === 0) {
            message.lineReply(`Hata: İsminde \`${tag}, ${tag2}\` ve etiketinde \`#${etiket}\` bulunduran herkesin rolleri dağıtılmış.`)
        } else {
            message.lineReply(`İsminde \`${tag}, ${tag2}\` ve etiketinde \`#${etiket}\` bulunduran \`${toplam}\` adet kullanıcıya taglı rolü verildi.`)
        }
    }
};