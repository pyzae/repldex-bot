require("dotenv").config();
const storage = require("./storage/storageManager");
const discord = require("discord.js");
const client = new discord.Client();
const config = require("./config");
const entreeBuilder = require("./entreeBuilder");

client.on("ready", () => console.log("YES CHEF"));

var onGoingEntrees = new Map();

client.on("message", msg => {
  if (msg.author.bot) return;

  if (onGoingEntrees.has(msg.author.id)) {
    infoGather(onGoingEntrees.get(msg.author.id), msg.content);
  }

  if (msg.content === "?writeEntree") {
    msg.channel.send(
      "Information gathering has begun, please check your direct messages"
    );
    onGoingEntrees.set(
      msg.author.id,
      new entreeBuilder(msg.author.id, msg.author)
    );
    onGoingEntrees
      .get(msg.author.id)
      .author.send("Please provide a name/title for your entree");
  }
  // if (msg.channel.id == "605862116808720416") {
  //   let entry = parseEntry(msg);

  //   if (entry != "bad") {
  //     storage.write(entry);

  //     msg.reply("your entry was added to the repldex");
  //   }
  // }

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

function infoGather(entree, val) {
  switch (entree.slot) {
    case 0: {
      entree.content.name = val;
      entree.author.send("Please send the type of your entree");
      break;
    }
    case 1: {
      entree.content.type = val;
      entree.author.send(
        "Please send the tags for your entree seperated by commas"
      );
      break;
    }
    case 2: {
      entree.content.tags = val.split(",");
      entree.author.send("Please write a description for your entree");
      break;
    }
    case 3: {
      entree.content.description = val;
      entree.author.send(
        "TThank you for completing your entree, it will be available to users of the repldex once approved by the mods"
      );
      storage.write(
        new storage.Entry(
          entree.content.name,
          entree.content.type,
          client.users.get(entree.authorID).tag,
          entree.content.description,
          entree.content.tags
        )
      );
      break;
    }
  }
  entree.slot++;
}

// function parseEntry(msg) {
//   let parse = cheerio.load(msg.content);

//   let name = parse("title")
//     .text()
//     .trim();

//   let type = parse("type")
//     .text()
//     .trim();

//   let body = parse("description")
//     .text()
//     .trim();

//   let tags = parse("tags")
//     .text()
//     .trim();

//   if (name == "" || body == "") {
//     msg
//       .reply("not enough data")
//       .then(message => setTimeout(() => message.delete(), 5000));

//     if (msg.deletable) {
//       msg.delete();
//     }

//     return "bad";
//   } else {
//     let entry = new storage.Entry(
//       name,
//       type,
//       msg.author.tag,
//       body,
//       tags.split(",")
//     );

//     return entry;
//   }
// }

client.login(process.env.TOKEN);
