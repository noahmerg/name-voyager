import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const db = client.db('name-voyager');
export const namesCollection = db.collection('names');
export const bookmarkCollection = db.collection('bookmarklist');

async function connectToDatabase () {
  await client.connect();
  console.log('Connected to MongoDB');
}

async function closeDatabaseConnection () {
  await client.close();
  console.log('Disconnected from MongoDB');
}

export { connectToDatabase, closeDatabaseConnection };
