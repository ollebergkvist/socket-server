require("dotenv").config(); // Requires and configs dotenv

const MongoClient = require("mongodb").MongoClient; // MongoDB
const url = process.env.MONGODB_URL; // Connection URL
const dbName = process.env.MONGODB_DB;

// Lists collections in db
listCollections().catch((err) => console.log(err));

// Reset collection
async function listCollections() {
    // Create connection to MongoDB
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = await client.db(dbName); // Connect do db
    const result = await db
        .listCollections()
        .toArray()
        .then((collections) => {
            console.log(collections);
        })
        .catch((error) => {
            console.error(`No collections in db: ${error}`);
        });

    await client.close();

    return result;
}
