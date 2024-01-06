import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://noahmerg:CX6Ue4rcwgYWXJia@name-voyager.jgcwhtt.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);

async function connectToDatabase () {
  await client.connect();
  console.log('Connected to MongoDB');
}

async function closeDatabaseConnection () {
  await client.close();
  console.log('Disconnected from MongoDB');
}

export { connectToDatabase, closeDatabaseConnection };
