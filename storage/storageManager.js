const MongoClient = new require("mongodb").MongoClient;
const JsonStoreClient = require("async-jsonstore-io");
const fs = require("fs")
require('dotenv').config()

let jsonstore = new JsonStoreClient(process.env.JSONSTORE);
let db;
const dbName = 'repldex';
const collectionName = 'entries';

async function loadDatabase() {
	/*
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
	*/
	MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, function(err, client) {
		db = client.db(dbName).collection(collectionName)
	})
	
}

/*
async function saveDatabase() {
  fs.readFile(__dirname + "/repldex.db", {encoding: 'utf8'}, (err, data) => {
    if (err) throw err;

    jsonstore.send('database', {data}).then((data) => {
      console.log("Database sent");
    }).catch(console.error);
  });
}*/

module.exports.Entry = class Entry {
  constructor(name = null, type = null, author, body = null, tags = []) {
    this.name = name;

    this.type = type;

    this.author = author;

    this.body = body;

    this.tags = tags;
  }
};

//data should be of type Entry
module.exports.write = function(data) {
  db.insertOne(data, err => {
    err ? console.log("err : " + err) : console.log("succesful write");
  });
};

module.exports.read = function(name = "none", cb) {
  db.find({ name }, (err, docs) => {
		docs.toArray(function(array_err, docs) {
			err ? console.log(err) : console.log("succesfull query");
			array_err ? console.log(array_err) : console.log("^")
			if (docs.length == 0) {

				cb("not found");

			} else {
				
				cb(docs);

			}
		});
  });
};

module.exports.advancedRead = function(query, cb) {
  db.find(query, (err, docs) => {
		docs.toArray(function(array_err, docs) {
			err ? console.log(err) : console.log("succesfull query");
			array_err ? console.log(array_err) : console.log("^")
			if (docs.length == 0) {

				cb("not found");

			} else {
				
				cb(docs);

			}
		});
  });
};

loadDatabase().catch(console.error);
