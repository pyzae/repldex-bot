const Datastore = require("nedb");
const JsonStoreClient = require("async-jsonstore-io");
const fs = require("fs")
require('dotenv').config()

let jsonstore = new JsonStoreClient(process.env.JSONSTORE);
let db;

async function loadDatabase() {
  let data;

  // Do not crash if there is nothing in jsonstore
  try {
    data = await jsonstore.get("database");
  }
  catch (err) {
    console.error(err);
    db = new Datastore({
      filename: __dirname + "/repldex.db",
      autoload: true
    });
    throw "Nothing on jsonstore, don't worry I handled it"
  }

  fs.writeFile(__dirname + "/repldex.db", data.data, (err) => {
    if (err) throw err;

    db = new Datastore({
      filename: __dirname + "/repldex.db",
      autoload: true
    });
    console.log("Database loaded");
  });
}

async function saveDatabase() {
  fs.readFile(__dirname + "/repldex.db", {encoding: 'utf8'}, (err, data) => {
    if (err) throw err;

    jsonstore.send('database', {data}).then((data) => {
      console.log("Database sent");
    }).catch(console.error);
  });
}

module.exports.Entree = class Entree {
  constructor(name = null, type = null, author, body = null, tags = []) {
    this.name = name;

    this.type = type;

    this.author = author;

    this.body = body;

    this.tags = tags;
  }
};

//data should be of type Entree
module.exports.write = function(data) {
  db.insert(data, err => {
    err ? console.log("err : " + err) : console.log("succesful write")
    saveDatabase().catch(console.error);
  });
};

module.exports.read = function(name = "none", cb) {
  db.find({ name }, (err, docs) => {
    err ? console.log(err) : console.log("succesfull query");
    if (docs.length == 0) {

      cb("not found");

    } else {
      
      cb(docs);

    }
  });
};

module.exports.advancedRead = function(query, cb) {
  db.find(query, (err, docs) => {

    err ? cb("err") : console.log("successull advanced query");

    if(docs.length == 0){

      cb("not found")

    } else cb(docs)
  });
};

loadDatabase().catch(console.error);
