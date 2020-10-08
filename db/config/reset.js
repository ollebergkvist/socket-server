// Dotenv
require("dotenv").config(); // Requires and configs dotenv

const MongoClient = require("mongodb").MongoClient; // MongoDB
const url = process.env.MONGODB_URL; // Connection URL
const dbName = process.env.MONGODB_DB;
const collectionName = process.env.MONGODB_COLLECTION; // Collection name
const fs = require("fs");
const path = require("path");
const model = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "model.json"), "utf8")
);

// Reset collection
async function resetCollection() {
    // Create connection do MongoDB
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = await client.db(dbName); // Connect do db
    const collection = await db.collection(collectionName); // Choose collection

    await collection.deleteMany();
    // await collection.insertMany(model);
    await client.close();
}

// Resets collection
resetCollection().catch((err) => console.log(err));
