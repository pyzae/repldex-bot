const storage = require("./storage/storageManager");
const discord = require('discord.js')
const client = new discord.Client
require('dotenv').config()

client.on('ready', () => console.log("YES CHEF"))

client.on('message', msg => {
  if(msg.channel.id == "605862116808720416"){
    var stuff = msg.content.split('\n')

    let entree = new storage.Entree(
      stuff[0],
      stuff[1],
      msg.author.tag,
      stuff[2],
    );
    
    storage.write(entree);
  }
})


client.login(process.env.TOKEN)
