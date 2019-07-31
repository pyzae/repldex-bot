const storage = require("./storage/storageManager");
const discord = require("discord.js");
const client = new discord.Client();
const config = require("./config");
const cheerio = require("cheerio");
require("dotenv").config();

client.on("ready", () => console.log("YES CHEF"));

client.on("message", msg => {
  if (msg.author.bot) return;

  if (msg.channel.id == "605862116808720416") {
    let entree = parseEntree(msg)
    storage.write(entree);
    msg.reply("your entree was added to the repldex");
  }
  if (msg.content.startsWith("?search")) {
    let docs = storage.read(msg.content.slice(8), docs => {
      let embed = new discord.RichEmbed();
      if (docs != "not found") {
        embed.setTitle(docs[0].name);
        embed.setAuthor(docs[0].author);
        embed.addField("body: ", docs[0].body);
        embed.addField("type: ", docs[0].type);
        embed.addField("tags: ", docs[0].tags.join(", "));
        embed.setFooter(docs[0]._id);
        msg.channel.send(embed);
      } else {
        msg.channel.send("not found");
      }
    });
  }
});

function parseEntree(msg){
  let parse = cheerio.load(msg.content);
  let name = parse("title").text();
  let type = parse("type").text();
  let body = parse("description").text();
  let tags = parse("tags").text();

  if (name == "" && body == "") {
    msg
      .reply("not enough data")
      .then(message => setTimeout(() => message.delete(), 5000));
    if (msg.deletable) {
      msg.delete();
    }
  } else {
    let entree = new storage.Entree(
      name,
      type,
      msg.author.tag,
      body,
      tags.split(",")
    );
    return entree
    }
  }

client.login(process.env.TOKEN);
