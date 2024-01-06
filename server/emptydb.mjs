import { MongoClient } from 'mongodb';
import { connectToDatabase, closeDatabaseConnection } from './db.mjs';

// TO RUN A MONGO INSTANCE: sudo mongod --dbpath ~/data/db
const uri = 'mongodb+srv://noahmerg:CX6Ue4rcwgYWXJia@name-voyager.jgcwhtt.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

const databaseName = 'name-voyager';
const namesCollectionName = 'names';
const bookmarkCollectionName = 'bookmarklist';

async function emptyDatabase () {
  try {
    await connectToDatabase();

    const database = client.db(databaseName);
    const bookmarkCollection = database.collection(bookmarkCollectionName);
    const dataCollection = database.collection(namesCollectionName);

    await bookmarkCollection.deleteMany();
    await dataCollection.deleteMany();
    console.log('Deleted all data from database');
  } catch (error) {
    console.error(error);
  } finally {
    await closeDatabaseConnection();
    process.exit(0);
  }
}

await emptyDatabase();
