// Web server

require("dotenv").config({ path: require("find-config")(".env") } );
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

const url = "mongodb://localhost:27017/maddosh-counter";
const { MongoClient } = require("mongodb");
myMongoClient = new MongoClient(url);
const db = process.env.DATABASE_NAME;


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/api", (req, res) => {
  myMongoClient.connect()
    .then(client => client.db("maddosh-counter").collection(db))
    .then(collection => collection.find().project({ AuthorID: 1, Author: 1, Date: 1, Content: 1}).toArray())
    .then(data => res.json(data))
    .then(console.log("Sent data"))
    .catch(console.dir)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

app.use(express.static(path.join(__dirname, 'build')));