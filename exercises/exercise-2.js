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

module.exports = {
  createGreeting,
};
