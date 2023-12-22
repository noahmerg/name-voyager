import { MongoClient } from 'mongodb';

async function connectAndPrintFirstDocument() {
  // MongoDB connection string
  const uri = 'mongodb://localhost:27017';

  // Database and collection information
  const databaseName = 'name-voyager';
  const collectionName = 'names'; // Replace with the actual collection name

  // Create a new MongoClient
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Access the specified database and collection
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    // Retrieve the first document from the collection
    const firstDocument = await collection.findOne();

    // Print the first document
    console.log('First Document:', firstDocument);
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Call the function to connect and print the first document
connectAndPrintFirstDocument();
