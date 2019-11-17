module.exports = class {
  constructor(authorID, author) {
    this.authorID = authorID;
    this.slot = 0;
    this.author = author;
    this.content = new Content(authorID);
  }
};

class Content {
  constructor(authorID) {
    this.authorID = authorID;
    this.name;
    this.type;
    this.tags = [];
    this.description;
  }
}
