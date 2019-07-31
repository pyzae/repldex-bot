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

    let entree = parseEntree(msg);


    if (entree != "bad") {

      storage.write(entree);

      msg.reply("your entree was added to the repldex");

    }
  }
  if (msg.content.startsWith("?search")) {
    let docs = storage.read(msg.content.slice(8), docs => {


      if (docs != "not found") {

        for (let i = 0; i < docs.length; i++) {

          let embed = new discord.RichEmbed();


          embed.setTitle(docs[i].name);

          embed.setAuthor(docs[i].author);

          embed.setColor(config.embedColor)

          embed.addField("Body : ", docs[i].body);

          docs[i].type == "" ? embed.addField("Type : ", docs[i].type) : embed.addField("Type : ", "none")

          docs[i].tags.length == 0 ?  embed.addField("Tags: ", docs[i].tags.join(", ")) : embed.addField("Tags : ", "none");

          embed.setFooter(docs[i]._id);

          msg.channel.send(embed);

        }
      } else {

        msg.channel.send("not found");

      }
    });
  }
  if (msg.content.startsWith("?advanced")) {

    try {

      var query = JSON.parse(msg.content.slice(9));

    } catch (error) {
      msg.reply("bad json");

      return;
    }

    storage.advancedRead(query, docs => {
      if (docs != "not found") {
        for (let i = 0; i < docs.length; i++) {
          let embed = new discord.RichEmbed();
          embed.setTitle(docs[i].name);

          embed.setAuthor(docs[i].author);

          embed.setColor(config.embedColor)

          embed.addField("Body : ", docs[i].body);

          docs[i].type == "" ? embed.addField("Type : ", docs[i].type) : embed.addField("Type : ", "none")

          docs[i].tags.length == 0 ?  embed.addField("Tags: ", docs[i].tags.join(", ")) : embed.addField("Tags : ", "none");

          embed.setFooter(docs[i]._id)

          msg.channel.send(embed);

        }

      } else msg.channel.send("not found");

    });
  }
});

function parseEntree(msg) {
  let parse = cheerio.load(msg.content);


  let name = parse("title")
    .text()
    .trim();


  let type = parse("type")
    .text()
    .trim();


  let body = parse("description")
    .text()
    .trim();


  let tags = parse("tags")
    .text()
    .trim();


  if (name == "" || body == "") {
    msg
      .reply("not enough data")
      .then(message => setTimeout(() => message.delete(), 5000));

    if (msg.deletable) {

      msg.delete();

    }

    return "bad";


  } else {

    let entree = new storage.Entree(
      name,
      type,
      msg.author.tag,
      body,
      tags.split(",")
    );


    return entree;

  }
}

client.login(process.env.TOKEN);
