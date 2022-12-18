const fs = require("fs");
const client = global.client;

fs.readdir("./src/events", (err, files) => {
  if (err) return console.error(err);
  files
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
      let prop = require(`../events/${file}`);
      if (!prop.config) return;
      client.on(prop.config.Event, prop);
    });
});