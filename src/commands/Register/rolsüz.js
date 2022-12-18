const { Client, Message, MessageEmbed } = require("discord.js");
const Kullanici = require('../../../Database/Schema/Users')
const Config = require('../../settings/Config.json')
require('djs-linereply');

module.exports = {
    Isim: "rolsüz",
    Komut: ["Rolsüz"],
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
        let rlsz = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0)
    
        if(args[0] == "ver") {
            rlsz.forEach(r => {
        r.roles.add(Config.Role.Unregistered)
        })
        message.lineReply(`Sunucuda rolü bulunmayan **${rlsz.size}** kişiye kayıtsız rolü dağıtılmaya başlandı.`).then(message.react(Config.Others.CheckTick)).then(x => x.delete({timeout: 12500}));
        } else if(!args[0]) {
        message.lineReply(`Sunucuda rolü bulunmayan **${rlsz.size}** kişi var.`).then(message.react(Config.Others.RedTick)).then(x => x.delete({timeout: 12500}));
        }
    }
}