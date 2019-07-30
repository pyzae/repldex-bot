const storage = require("./storage/storageManager");
const discord = require('discord.js')
const client = new discord.Client
require('dotenv').config()

client.on('ready', () => console.log("YES CHEF"))

client.on('message', msg => {
  if(msg.channel.id == "605862116808720416"){
    var breakdown = msg.content.split('\n')

    let entree = new storage.Entree(
      breakdown[0],
      breakdown[1],
      msg.author.tag,
      breakdown[2],
      breakdown[3].split(',')
    );
    
    storage.write(entree);
  }
  if(msg.content.startsWith("?search")){
    let docs = storage.read(msg.content.slice(8))
    let embed = new discord.RichEmbed()
    embed.setTitle(docs[0].name)
    embed.setAuthor(docs[0].author)
    embed.addField("body: ", docs[0].body)
    embed.addField("type: ", docs[0].type)
    embed.setFooter(docs[0]._id)
  }
})


client.login(process.env.TOKEN)
