var Datastore = require("nedb");

people = new Datastore({
  filename: __dirname + "/people.json",
  autoload: true
});

legends = new Datastore({
  filename: __dirname + "/legends.json",
  autoload: true
});

events = new Datastore({
  filename: __dirname + "/events.json",
  autoload: true
});

module.exports.write = function(data) {
  legends.insert(data, err =>
    err ? console.log("err : " + err) : console.log("succesful write")
  );
};
