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

const getGreetings = async (req, res) => {
  const client = await MongoClient(MONGO_URI2, options);
  try {
    await client.connect();

    const db = client.db("exercises");

    const start = Number(req.query.start);
    const limit = Number(req.query.limit);

    const greetings = await db.collection("greetings").find().toArray();
    if (greetings.length > 25) {
      if ((start || start === 0) && limit) {
        res.status(200).json(greetings.slice(start, start + limit));
      } else {
        res.status(200).json(greetings.slice(0, 25));
      }
    } else {
      res.status(200).json(greetings);
    }
  } catch (err) {
    console.log(err.stack);
    res.status(400).json("Not found");
  }
  client.close();
};

const deleteGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI2, options);
  try {
    await client.connect();

    const db = client.db("exercises");

    const _id = req.params._id;

    const r = await db.collection("greetings").deleteOne({ _id: _id });
    assert.equal(1, r.deletedCount);

    res.status(200).json({ status: 204, message: "Succesfully Deleted" });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  }

  client.close();
};

const updateGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI2, options);
  try {
    await client.connect();

    const db = client.db("exercises");

    const _id = req.params._id;
    const query = { _id };
    const newValues = { $set: { ...req.body } };

    const r = await db.collection("greetings").updateOne(query, newValues);
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);

    res.status(200).json({ status: 200, _id, ...req.body });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  }

  client.close();
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
