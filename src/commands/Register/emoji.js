const { Client, Message } = require("discord.js");
const Config = require('../../settings/Config.json')
require('djs-linereply');

module.exports = {
    Isim: "aemoji",
    Komut: ["aemoji"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "",
    
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
    if(message.author.id !== Config.Permissions.Sahip) return
    if(args[0] === "kur" || args[0] === "kurulum") {
        let CheckTick = "https://cdn.discordapp.com/emojis/802098678369091594.gif?v=1";
        let RedTick = "https://cdn.discordapp.com/emojis/673576480487506011.gif?v=1"; 
        let Man = "https://cdn.discordapp.com/emojis/782554741896773633.gif?v=1";
        let Woman = "https://cdn.discordapp.com/emojis/782554741669888000.gif?v=1"
        
        message.guild.emojis.create(Man, "wxn_man").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(Woman, "wxn_wmn").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(CheckTick, "wxn_yes").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(RedTick, "wxn_no").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        return;
      };
      if(args[0] === "oluştur" || args[0] === "ekle") {
        let [link, ad] = args.slice(1).join(" ").split(" ");
        if (!link) return message.channel.send(`Bir link yazmalısın. Doğru kullanım: **${this.configuration.name} oluştur <link> <isim>**`);
        if (!ad) return message.channel.send(`Bir isim yazmalısın. Doğru kullanım: **${this.configuration.name} oluştur <link> <isim>**`);
      
        message.guild.emojis.create(link, ad)
          .then(emoji => message.channel.send(`\`[ EMOJİ ]\` ${emoji.name} __adında başarıyla emoji oluşturuldu.__ (${emoji})`)).then(message.react("✅"))
          .catch(console.error);
        return;
      };
    
      if(args[0] === "id") {
        try {
          message.channel.send(`Sunucuda Bulunan Emojiler (${message.guild.emojis.cache.size} adet) \n\n${message.guild.emojis.cache.map(emoji => emoji.id + " | " + emoji.toString()).join('\n')}`, {code: 'xl', split: true}).then(message.react("✅"))
        } catch (err) { };
        return
      };
      
      if (message.guild.emojis.cache.some(x => `${x.name}`.includes(args[0]))) {
        if (!message.guild.emojis.cache.some(x => `${x.name}`.includes(args[0]))) return message.channel.send(`Sunucuda  \`${args[0]}\`  adında bir emoji bulunamadı!`);
        const emoji = new MessageEmbed()
        .setColor('RANDOM')
        .setTimestamp()
        .setFooter(client.user.username, client.user.avatarURL)
        .setDescription(`**Emoji:**  ${message.guild.emojis.cache.find(a => a.name === args[0])} \n**Emoji Adı:**  ${message.guild.emojis.cache.find(a => a.name === args[0]).name} \n**Emoji ID'si:**  ${message.guild.emojis.cache.find(a => a.name === args[0]).id} \n**Emoji Kodu:**  \`${message.guild.emojis.cache.find(x => x.name == args[0]).toString()}\``);
        try {
          message.channel.send(emoji)
        } catch (err) {
          const embed = new MessageEmbed()
          .addField(`Sunucuda Bulunan Emojiler`, `Üzgünüm ama sunucuda ya çok fazla emoji bulunuyor ya da hiç emoji bulunmuyor. Bunları gösteremiyorum. Discord buna izin vermiyor.`)
          .setColor(0x00ffff)
          .setTimestamp()
          message.channel.send({embed})
        };
        return;
      };
      
      try {
        const embed = new MessageEmbed()
        .addField(`Sunucuda Bulunan Emojiler`, message.guild.emojis.cache.map(emoji => emoji).join(' | '))
        .setColor(0x00ffff)
        .setTimestamp()
        .setFooter('Emojileri IDleri ile birlikte görmek için; emojiler id')
        message.channel.send({embed})
      } catch (err) {
        const embed = new MessageEmbed()
        .addField(`Sunucuda Bulunan Emojiler`, `Üzgünüm ama sunucuda ya çok fazla emoji bulunuyor ya da hiç emoji bulunmuyor. Bunları gösteremiyorum. Discord buna izin vermiyor.`)
        .setFooter('Emojilere bakamıyor ve IDleri ile birlikte görmek isterseniz; emojiler id')
        .setColor(0x00ffff)
        .setTimestamp()
        message.channel.send({embed})
            }
        }
    }