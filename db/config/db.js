// Dotenv
require("dotenv").config(); // Requires and configs dotenv

const MongoClient = require("mongodb").MongoClient; // MongoDB
const url = process.env.MONGODB_URL; // Connection URL
const databaseName = process.env.MONGODB_DB; // Database name
const collectionName = process.env.MONGODB_COLLECTION; // Collection name

// Insert chat message to collection
async function addItemToCollection(chatmessage) {
    // Create connection do MongoDB
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = await client.db(databaseName); // Connect do db
    const collection = await db.collection(collectionName); // Choose collection

    // Insert to collection
    const result = await collection
        .insertOne(chatmessage)
        .then((item) => {
            console.log(
                `Successfully inserted item with id: ${item.insertedId}`
            );
        })
        .catch((error) => {
            console.error(`Failed to insert item: ${error}`);
        });

    await client.close(); // Close db connection

    return result; // Return result
}

async function findItemsInCollection() {
    // Create connection do MongoDB
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = await client.db(databaseName); // Connect do db
    const collection = await db.collection(collectionName); // Choose collection
    const result = await collection.find().toArray(); // Retrieve results and convert to array

    await client.close(); // Close db connection

    return result; // Return result
}

module.exports = { addItemToCollection, findItemsInCollection };
