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
    console.log(storage.read(msg.content.slice(8)))
  }
})


client.login(process.env.TOKEN)
