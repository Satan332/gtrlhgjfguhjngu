const { Discord, Message, MessageEmbed } = require("discord.js");
const Config = require('../settings/Config.json');
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");

/**
 * 
 * @param {User} oldUser 
 * @param {User} newUser 
 *
**/

module.exports = (oldUser, newUser, message) => {

  if(oldUser.username == newUser.username || oldUser.bot || newUser.bot) return;
  let client = oldUser.client;
  let guild = client.guilds.cache.get(Config.System.ID);
  if(!guild) return console.error(`Hata: ${__filename} Sunucu bulunamadı!`);
  let user = guild.members.cache.get(oldUser.id);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  let log = client.guilds.cache.get(Config.System.ID).channels.cache.find(c => c.name === "tag-log");
  let logs = client.guilds.cache.get(Config.System.ID).channels.cache.find(c => c.name === "yetkili-log");
  let tagsayı = client.users.cache.filter(user => user.username.includes(Config.Guild.Tag)).size;

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if(newUser.username.includes(Config.Guild.Tag) && !user.roles.cache.has(Config.Role.Family)){  // Tag Çıkardı Ekledi (Checkleyip Rol verme İsim Ayarlama İşlemi)
    user.roles.add(Config.Role.Family).catch();
    // if(user.manageable) user.setNickname(user.displayName.replace(Config.Guild.SecondryTag, Config.Guild.Tag)).catch();
    log.send(`${client.emojis.cache.get(Config.Others.CheckTick)} <@${newUser.id}> adlı üye ( ${Config.Guild.Tag} ) tagını kullanıcı adına yerleştirerek aramıza katıldı! | **Sunucuda bulunan toplam taglı üyemiz: **(\`${tagsayı}\`)\n─────────────────\nÖnce ki kullanıcı adı: \`${oldUser.tag}\` | Sonra ki kullanıcı adı: \`${newUser.tag}\``).catch();
  } else if(!newUser.username.includes(Config.Guild.Tag) && user.roles.cache.has(Config.Role.Family)){
    user.roles.remove(Config.Role.Family).catch();
    log.send(`${client.emojis.cache.get(Config.Others.RedTick)} <@${newUser.id}> adlı üye ( ${Config.Guild.Tag} ) tagını kullanıcı adından silerek aramızdan ayrıldı! | **Sunucuda bulunan toplam taglı üyemiz: **(\`${tagsayı}\`)\n─────────────────\nÖnce ki kullanıcı adı: \`${oldUser.tag}\` | Sonra ki kullanıcı adı: \`${newUser.tag}\``).catch();
  }
 
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /* let authyRoles = [
    '980483557631877120', '980483561838739476', '980483562841190461',
    '981170373221552178', '980483564661534800', '980483565840105532',
    '980483580713119774', '980483582592188496', '980483583674286171',
    '980483585121349702', '980483587021348905', '980483587931508797',
    '980483589202395207', '980483603534327910', '980483602603200562',
    '980483605266579496', '980483607200157717', '980483608227762226',
    '980483610815643689', '980483612694691924', '980483614632472577',
    '980483616561840190', '980483618361204736', '980483620806463508',
    '980483621855039488', '980483623629250631', '980483624698806293',
    '980483651672375336', '980483653916307486', '980483654629330945',
    '980483656197996575', '980483657070444554', '980483658119008256',
    '980483659201150976', ''
  ] // Yetkili Rolleri
  let member = client.guilds.cache.get(Config.System.ID).members.cache.get(newUser.id)
  let filter = authyRoles.filter(a => member.roles.cache.has(a))
  if (filter.length > 0) {
    let embed = new MessageEmbed()
    .setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true }))
    .setColor("RANDOM")
    .setDescription(`<@${newUser.id}> tag saldığı için aşağıdaki rolleri alındı:\n\n${filter.map(x => `<@&${x}>`).join("\n")}\n\n`)
    logs.send(`<@&${Config.Role.TagSorumlusu}>`,{ embed: embed })
    client.users.cache.get(oldUser.id).send(`Selam ${oldUser.username}!\n\nGörünüşe göre yetkili ekibimizin bir parçası olarak bulunduğun halde sunucu tagımızı bırakmışsın. Bu sebepten ötürü yetkin otomatik olarak alındı ve bulunduğun yetkili sunucularından otomatik olarak çıkarıldın. Sunucu tagımızı önemsiyoruz ve yetkililerimizde bunu görmek istiyoruz.\n\nBizimle beraber çalıştığın için teşekkürler, seni yeniden aramızda görmekten mutluluk duyacağız. Herhangi bir sorununda veya yetki konusunu yeniden konuşmak için üst yönetim ekibimize yazmaktan çekinme. Seni seviyoruz, iyi ki varsın!\n\nTekrardan görüşmek dileğiyle ve sevgilerle,\n${Config.Guild.Ad} Yönetim`)
    for (let i = 0; i < filter.length;i++) {
      setTimeout(() => {
          member.roles.remove(filter[i])
      }, (i + 1) * 1000)
    }
  } */
}

module.exports.config = {
  Event: "userUpdate"
}