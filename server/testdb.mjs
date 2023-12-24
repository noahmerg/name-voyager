import { MongoClient } from 'mongodb';
import { connectToDatabase, closeDatabaseConnection } from './db.mjs';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const databaseName = 'name-voyager';
const collectionName = 'names';

async function testdb() {
  try {
    await connectToDatabase();

    // Access the specified database and collection
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    const names = await collection.find().toArray();

    if(names.length === 0) throw error;

    console.log('Number of Names found: %s', names.length);

    console.log('First Name found: %s. Gender: %s', names[0].vorname, names[0].geschlecht);

  } catch(error){
    console.error("something in the DB went wrong: " + error);
  
  }finally {
    await closeDatabaseConnection();
    process.exit(0);
  }
}

testdb();
