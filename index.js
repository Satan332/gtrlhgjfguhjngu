const { wonxen, Mongo } = require('./wonxen');
const client = global.client = new wonxen({ fetchAllMembers: true });
const Config = require('./src/settings/Config.json');
require("./src/handlers/eventHandler");
client.komutYükle("Register");
Mongo.Connect();

client
  .login(Config.System.Token)
  .catch(() => console.log("Bota giriş yapılırken hata ile karışlaşıldı."));

  process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
    process.exit(1);
  });
  
  process.on("unhandledRejection", err => {
    console.error("Promise Hatası: ", err);
  });
