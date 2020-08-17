const fs = require("file-system");
const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI2 } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const batchImport = async (dbName) => {
  const client = await MongoClient(MONGO_URI2, options);
  await client.connect();

  const db = client.db(dbName);
  console.log("connected!");

  console.log(greetings);

  const r = await db.collection("greetings").insertMany(greetings);
  console.log(r);
  assert.equal(greetings.length, r.insertedCount);

  client.close();
  console.log("disconnected!");
};

batchImport("exercises");
