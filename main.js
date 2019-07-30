var storage = require("./storage/storageManager");

//example of writing to db
let entree = new storage.Entree({
  name: "test",
  type: "event",
  author: "redacted",
  body: "testing reading and writing",
  tags: ["epic", "good-read"]
});

storage.write(entree);
