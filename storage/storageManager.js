const MongoClient = new require("mongodb").MongoClient;
const JsonStoreClient = require("async-jsonstore-io");
const fs = require("fs")
const config = require("../config")

let jsonstore = new JsonStoreClient(process.env.JSONSTORE);
let db;
const dbName = 'repldex';
const collectionName = 'entries';

async function loadDatabase() {
	/*
  let data;

  // Do not crash if there is nothing in jsonstore
  try {
    data = await jsonstore.get(config.jsonstoreKey);
  }
  catch (err) {
    console.error(err);
    db = new Datastore({
      filename: config.databaseFile,
      autoload: true
    });
    throw "Nothing on jsonstore, don't worry I handled it"
  }

  fs.writeFile(config.databaseFile, data.data, (err) => {
    if (err) throw err;

    db = new Datastore({
      filename: config.databaseFile,
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
  fs.readFile(config.databaseFile, {encoding: 'utf8'}, (err, data) => {
    if (err) throw err;

    jsonstore.send(config.jsonstoreKey, {data}).then((data) => {
      console.log("Database sent");
    }).catch(console.error);
  });
}*/

async function wipeDatabaseFile() {
  console.log("Deleting database file");
  fs.unlink(config.databaseFile, (err) => {
    if (err) throw err;
    console.log("Done")
  })  
}

async function wipeDatabaseOnline() {
  console.log("Deleting jsonstore database");
  await jsonstore.delete('database');
  console.log("Done");
}

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

module.exports.wipeDatabase = function(online, cb) {
  wipeDatabaseFile().then(() => {
    if(online) wipeDatabaseOnline().then(() => {
      loadDatabase().then(cb).catch(cb);
    }).catch(cb);
    else loadDatabase().then(cb).catch(cb);
  }).catch(cb);
}

loadDatabase().catch(console.error);
