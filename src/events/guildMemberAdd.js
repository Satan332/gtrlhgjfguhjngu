const { Discord, Message, MessageEmbed } = require("discord.js");
const Config = require('../settings/Config.json');
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");

/**
 * 
 * @param {Member} member 
 *
**/

module.exports = (member) => {
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  let guvenilirlik = Date.now()-member.user.createdTimestamp < 1000*60*60*24*7;
  if (guvenilirlik) {
  if(Config.Role.Suspect) member.roles.add(Config.Role.Suspect).catch();
  client.channels.cache.get(Config.Channel.Welcome).send(`${member} isimli üye sunucuya katıldı fakat hesabı <t:${Math.floor(new Date(member.user.createdAt).getTime() / 1000)}:R> açıldığı için **şüpheli** olarak işaretlendi.`);
  } else if(Config.Role.Unregistered) member.roles.add(Config.Role.Unregistered).catch();
  if (member.user.username.includes(Config.Guild.Tag)) { member.setNickname(`${Config.Guild.Tag} İsim | Yaş`).catch(); }
  else { member.setNickname(`${Config.Guild.SecondryTag} İsim | Yaş`).catch();}
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  if (member.user.username.includes(Config.Guild.Tag)) member.roles.add(Config.Role.Family);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*  client.channels.cache.get(Config.Channel.Welcome).send(`
Sunucumuza hoş geldin, ${member}! Seninle beraber toplam **${member.guild.members.cache.size}** kişiyiz.\n
Hesabın __${moment(member.user.createdTimestamp).format("LLL")}__ tarihinde <t:${Math.floor(new Date(member.user.createdAt).getTime() / 1000)}:R> oluşturulmuş.\n
Tagımızı (${Config.Guild.Tag}) alarak bize destek olabilirsin! <#${Config.Guild.RegisterRules}> kanalındaki kurallarımızı okuduğun varsayılarak kaydedileceksin.\n
Kayıt olmak için <#${Config.Guild.RegisterVoice}> kanalında bekleyebilirsin. <@&${Config.Role.Register}> Rolünde bulunan yetkililerimiz sizinle ilgilenecektir.
    `)
*/

}

module.exports.config = {
  Event: "guildMemberAdd"
}