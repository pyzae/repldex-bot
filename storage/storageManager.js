const Datastore = require("nedb");

let db = new Datastore({
  filename: __dirname + "/repldex.db",
  autoload: true
});

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
  db.insert(data, err =>
    err ? console.log("err : " + err) : console.log("succesful write")
  );
};

module.exports.read = function(name = "none", cb) {
  let entree = db.find({ name }, (err, docs) => {
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
    err ? console.log(err) : console.log("successull advanced query");
    if(docs.length == 0){
      console.log("not found")
      cb("not found")
    } else cb(docs)
  });
};
