const { Client, Collection, GuildMember, Guild, TextChannel, Message, MessageEmbed } = require('discord.js');
const fs = require('fs')
const moment = require('moment');
const Config = require('./src/settings/Config.json')
const chalk = require('chalk');
const figlet = require("figlet");
require("moment-duration-format");
require("moment-timezone");


class wonxen extends Client {
    constructor(options) {
        super(options);

            /*-------- Sistem Gereksinimi --------*/
                this.cevaplar = global.cevaplar = require('./src/settings/reply');
            /*-------- Sistem Gereksinimi --------*/

            /*-------- Handler --------*/
                this.komutlar = new Collection();
                this.komut = new Collection();
            /*-------- Handler --------*/
    }

    komutYükle(botisim) {
        fs.readdir(`./src/commands/${botisim}`, (err, files) => {
            if(err) return console.error(err);
            files = files.filter(file => file.endsWith(".js"));
            console.log(chalk.blue.bold(`${chalk.grey('Wonxen')} : ${files.length} Adet register adet komut yüklendi.`));
            files.forEach(file => {
            let referans = require(`./src/commands/${botisim}/${file}`);
            if(typeof referans.onLoad === "function") referans.onLoad(this);
            this.komutlar.set(referans.Isim, referans);
                    if (referans.Komut) {
                        referans.Komut.forEach(alias => this.komut.set(alias, referans));
                    }
            });
        });
    }
}

class Mongo {
    static Connect() {
        require('mongoose').connect(Config.System.MongoDb, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then(() => {
            console.log(`${chalk.yellow('Bot')} ${chalk.blue(':')} Başarıyla veri tabanına bağlandı.`);
        }).catch((err) => {
            console.log("MongoDB veritabanına bağlantı sağlanamadı!\n" + err, "error");
        });
    }

}

const sayilariCevir = global.sayilariCevir = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

let aylartoplam = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" };
    global.aylar = aylartoplam;
    const tarihsel = global.tarihsel = function(tarih) {
    let tarihci = moment().format('LLL')  
    return tarihci;
};

Guild.prototype.kanalBul = function(kanalisim) {
    let kanal = this.channels.cache.find(k => k.name === kanalisim)
    return kanal;
}

GuildMember.prototype.rolTanımla = function (rolidler = []) {
    let rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(rolidler);
    return this.roles.set(rol);
}

GuildMember.prototype.kayıtRolVer = function (rolidler = []) {
    let rol;
    if(this.roles.cache.has(Config.Role.Vip)) { 
    rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(rolidler).concat(Config.Role.Vip) 
    } else {
    rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(rolidler)
    };
    return this.roles.set(rol);
}

Guild.prototype.kayıtLog = async function kayıtLog(yetkili, üye, cins, channelName) {
    let kanal = this.channels.cache.find(k => k.name === channelName);
    let cinsiyet;
    if(cins === "erkek") { cinsiyet = "Erkek" } else if(cins === "kadın") { cinsiyet = "Kadın" }
    if(kanal) {
        let embed = new MessageEmbed()
        .setAuthor(Config.Guild.Ad)
        .setDescription(`${üye} isimli üye **${tarihsel(Date.now())}** tarihinde ${yetkili} tarafından **${cinsiyet}** olarak kayıt edildi.`)
        .setFooter(Config.Bot.Footer,`${client.users.cache.get(Config.Permissions.Sahip).avatarURL({ dynamic: true })}`)
        .setTimestamp()
        kanal.send(embed)
    };
}


module.exports = { wonxen, Mongo };