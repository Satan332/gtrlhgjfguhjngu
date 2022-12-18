const Config = require('../settings/Config.json');
const moment = require("moment");
const chalk = require("chalk");
const client = global.client;
require("moment-duration-format");
moment.locale("tr");

/**
 * 
 * @param {Ready} ready 
 *
**/

module.exports = () => {


    let botVoiceChannel = client.channels.cache.get(Config.Bot.Voice); 
    if (botVoiceChannel) botVoiceChannel.join().then(e => { e.voice.setSelfDeaf(true); }).then(x => console.log(`${chalk.yellow('Bot')} ${chalk.blue(':')} Başarıyla sese giriş yapıldı.`)).catch(err => console.error("[HATA] Bot ses kanalına bağlanamadı!"));
    client.user.setActivity(Config.Bot.Text, { type: "STREAMING", url: "https://www.twitch.tv/Savage"})

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    setInterval(() => { TagAlıncaKontrol(); }, 20 * 1000);
    setInterval(() => { RolsuzeKayitsizVerme(); }, 10 * 1000);
    setInterval(() => { TagBırakanKontrol(); }, 15 * 1000);

    async function RolsuzeKayitsizVerme()  { // Rolü olmayanı kayıtsıza atma
        const guild = client.guilds.cache.get(Config.System.ID);
        let rolsuz = guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== guild.id).size == 0)
        rolsuz.forEach(r => {
            r.roles.add(Config.Role.Unregistered)
        }) 
    }

    async function TagAlıncaKontrol() { // Tag alınca tarama
      const guild = client.guilds.cache.get(Config.System.ID);
      const members = guild.members.cache.filter(member => member.user.username.includes(Config.Guild.Tag) && !member.user.username.includes("'") && !member.user.discriminator.includes("1947") && !member.roles.cache.has(Config.Role.Jail) && !member.roles.cache.has(Config.Role.Family)).array().splice(0, 10)
       for await (const member of members) {
        await member.roles.add(Config.Role.Family);
       }
    };

    async function TagBırakanKontrol() { // Tagı olmayanın family rol çekme
        const guild = client.guilds.cache.get(Config.System.ID);
        const members = guild.members.cache.filter(member => !member.user.username.includes(Config.Guild.Tag) && !member.user.username.includes("'") && !member.user.discriminator.includes("1947") && !member.user.bot && member.roles.cache.has(Config.Role.Family)).array().splice(0, 10)
        for await (const member of members) {
          await member.roles.remove(Config.Role.Family);
        }
    };

};
module.exports.config = {
  Event: "ready"
}

// console.log(chalk.yellow.bold(figlet.textSync("WONXEN WAS HERE!")));