const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();

const { MONGO_URI2 } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI2, options);
  try {
    await client.connect();

    const db = client.db("exercises");
    console.log("connected!");

    const r = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, r.insertedCount);

    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
  console.log("disconnected!");
};

const getGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI2, options);
  await client.connect();

  const db = client.db("exercises");
  console.log("connected!");

  const _id = req.params._id;

  db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
    console.log("disconnected!");
  });
};

module.exports = {
  createGreeting,
  getGreeting,
};
