import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
let client = new MongoClient(uri);
const db = client.db('name-voyager');
export const namesCollection = db.collection('names');
export const bookmarkCollection = db.collection('bookmarklist');

async function connectToDatabase () {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

async function closeDatabaseConnection () {
  try {
    if (client && client.isConnected) {
      await client.close();
      console.log('Disconnected from MongoDB');
    } else {
      console.warn('No MongoDB connection to close.');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}

export { connectToDatabase, closeDatabaseConnection };
