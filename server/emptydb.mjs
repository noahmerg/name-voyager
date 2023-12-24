import { MongoClient } from 'mongodb';
import { connectToDatabase, closeDatabaseConnection } from './db.mjs';

// TO RUN A MONGO INSTANCE: sudo mongod --dbpath ~/data/db
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const databaseName = 'name-voyager';
const collectionName = 'names';

async function emptyDatabase() {
  try {
    await connectToDatabase();

    const database = client.db(databaseName);
    const dataCollection = database.collection(collectionName);
  
    await dataCollection.deleteMany();
    console.log("Deleted all data from database");
  } catch(error){
    console.error(error);
  } finally {
    await closeDatabaseConnection();
    process.exit(0);
  }
}
  
await emptyDatabase();
