const storage = require("./storage/storageManager");
const discord = require('discord.js')
const client = new discord.Client
require('dotenv').config()

client.on('ready', () => console.log("YES CHEF"))

client.on('message', msg => {
  if(msg.channel.id == "605862116808720416"){
    var stuff = msg.content.split('\n')

    let entree = new storage.Entree({
      name: stuff[0],
      type: stuff[1],
      author: msg.author.tag,
      body: stuff[2],
    });
    
    storage.write(entree);
  }
})


client.login(process.env.TOKEN)
