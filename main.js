require("dotenv").config();
const storage = require("./storage/storageManager");
const discord = require("discord.js");
const client = new discord.Client();
const config = require("./config");

client.on("ready", () => console.log("YES CHEF")); //what is this btw

var onGoingEntries = new Map();

client.on("message", msg => {
  if (msg.author.bot) return;

  if (msg.content == "?cancel") {
    onGoingEntries.delete(msg.author.tag);
    msg.channel.send("entry cancelled");
  }

  if (onGoingEntries.has(msg.author.tag)) {
    if (msg.guild === null)
      infoGather(onGoingEntries.get(msg.author.tag), msg.content);
    return;
  }

  if (msg.content === "?writeentry") {
    msg.channel.send(
      "Information gathering has begun, please check your direct messages (note : you may cancel this entry at any time with ?cancel)"
    );
    onGoingEntries.set(
      msg.author.tag,
      new storage.Entry(null,null, msg.author.tag, null, null)
    );
    onGoingEntries.get(msg.author.tag)
    client.users.get(msg.author.id).send("Please provide a name/title for your entry (note : you may cancel this entry at any time with ?cancel)");
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

  if (msg.content.startsWith("?wipe")) {
    if (!config.devs.includes(msg.author.id)) {
      console.log(msg.author.tag + " tried to wipe the database");
    } else {
      storage.delete({}, err => {
        if (err) console.error(err);
        else msg.channel.send("Done");
      });
    }
  }
});

function infoGather(entry, val, channel) {
  switch (entry.slot) {
    case 0: {
      entry.name = val;
      channel.send(
        "Please send the type of your entry"
      );
      break;
    }
    case 1: {
      entry.type = val;
      channel.send(
        "Please send the tags for your entry seperated by commas"
      );
      break;
    }
    case 2: {
      entry.tags = val.split(",");
      channel.send("Please write a description for your entry");
      break;
    }
    case 3: {
      entry.description = val;
      channel.send(
        "Thank you for completing your entry, it will be available to users of the repldex once approved by the mods"
      );
      storage.write(
        new storage.Entry(
          entry.name.trim(),
          entry.type.trim(),
          entry.tag,
          entry.description.trim(),
          entry.tags.map(v => v.trim())
        )
      );
      onGoingEntries.delete(entry.author);
      break;
    }
  }
  entry.slot++;
}

client.login(process.env.TOKEN);
