import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
export const namesCollection = client.db('name-voyager').collection('names');

async function connectToDatabase () {
  await client.connect();
  console.log('Connected to MongoDB');
}

async function closeDatabaseConnection () {
  await client.close();
  console.log('Disconnected from MongoDB');
}

export { connectToDatabase, closeDatabaseConnection };
