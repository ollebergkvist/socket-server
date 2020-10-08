require("dotenv").config(); // Requires and configs dotenv

const MongoClient = require("mongodb").MongoClient; // MongoDB
const url = process.env.MONGODB_URL; // Connection URL
const dbName = process.env.MONGODB_DB;
const collectionName = process.env.MONGODB_COLLECTION; // Collection name

// Reset collection
async function dropCollection() {
    // Create connection to MongoDB
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = await client.db(dbName); // Connect do db
    const collection = await db.collection(collectionName); // Choose collection
    const result = await collection
        .drop()
        .then(() => {
            console.log("Collection deleted");
        })
        .catch((error) => {
            console.error(`Error deleting collection: ${error}`);
        });

    await client.close();

    return result;
}

// Lists collections in db
dropCollection().catch((err) => console.log(err));
