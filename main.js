require("dotenv").config();
const storage = require("./storage/storageManager");
const discord = require("discord.js");
const client = new discord.Client();
const config = require("./config");
const entryBuilder = require("./entryBuilder");

client.on("ready", () => console.log("YES CHEF")); //what is this btw

var onGoingEntries = new Map();

client.on("message", msg => {
  if (msg.author.bot) return;

  if (onGoingEntries.has(msg.author.id)) {
    if (msg.guild === null)
      infoGather(onGoingEntries.get(msg.author.id), msg.content);
    return;
  }

  if (msg.content === "?writeentry") {
    msg.channel.send(
      "Information gathering has begun, please check your direct messages"
    );
    onGoingEntries.set(
      msg.author.id,
      new entryBuilder(msg.author.id, msg.author)
    );
    onGoingEntries
      .get(msg.author.id)
      .author.send("Please provide a name/title for your entry");
  }

  if (msg.content.startsWith("?search")) {
    let docs = storage.read(msg.content.slice(8), docs => {
      if (docs != "not found") {
        for (let i = 0; i < docs.length; i++) {
          let embed = new discord.RichEmbed();

          embed.setTitle(docs[i].name);

          embed.setAuthor(docs[i].author);

          embed.setColor(config.embedColor);

          embed.addField("Body : ", docs[i].body);

          docs[i].type == ""
            ? embed.addField("Type : ", "none")
            : embed.addField("Type : ", docs[i].type);

          docs[i].tags.length == 0
            ? embed.addField("Tags : ", "none")
            : embed.addField("Tags: ", docs[i].tags.join(", "));

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

          embed.setColor(config.embedColor);

          embed.addField("Body : ", docs[i].body);

          docs[i].type == ""
            ? embed.addField("Type : ", "none")
            : embed.addField("Type : ", docs[i].type);

          docs[i].tags.length == 0
            ? embed.addField("Tags : ", "none")
            : embed.addField("Tags: ", docs[i].tags.join(", "));

          embed.setFooter(docs[i]._id);

          msg.channel.send(embed);
        }
      } else msg.channel.send("not found");
    });
  }
});

function infoGather(entry, val) {
  switch (entry.slot) {
    case 0: {
      entry.content.name = val;
      entry.author.send("Please send the type of your entry");
      break;
    }
    case 1: {
      entry.content.type = val;
      entry.author.send(
        "Please send the tags for your entry seperated by commas"
      );
      break;
    }
    case 2: {
      entry.content.tags = val.split(",");
      entry.author.send("Please write a description for your entry");
      break;
    }
    case 3: {
      entry.content.description = val;
      entry.author.send(
        "Thank you for completing your entry, it will be available to users of the repldex once approved by the mods"
      );
      storage.write(
        new storage.Entry(
          entry.content.name.trim(),
          entry.content.type.trim(),
          client.users.get(entry.authorID).tag,
          entry.content.description.trim(),
          entry.content.tags.map(v => v.trim())
        )
      );
      onGoingEntries.delete(entry.authorID);
      break;
    }
  }
  entry.slot++;
}

client.login(process.env.TOKEN);
