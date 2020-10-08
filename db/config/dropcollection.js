const MongoClient = require("mongodb").MongoClient; // MongoDB
const url = "mongodb://localhost:27017/chatlog"; // Connection URL
const dbName = "chatlog";

// Reset collection
async function dropCollection() {
    // Create connection to MongoDB
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = await client.db(dbName); // Connect do db
    const collection = await db.collection("chathistory"); // Choose collection
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
