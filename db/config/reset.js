const MongoClient = require("mongodb").MongoClient; // MongoDB
const url = "mongodb://localhost:27017/chatlog"; // Connection URL
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

    const db = await client.db(); // Connect do db
    const collection = await db.collection("chathistory"); // Choose collection

    await collection.deleteMany();
    // await collection.insertMany(model);
    await client.close();
}

// Resets collection
resetCollection().catch((err) => console.log(err));
