import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017/name-voyager';
const client = new MongoClient(uri);

const databaseName = 'name-voyager';
const collectionName = 'names';

async function emptyDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const database = client.db(databaseName);
    const dataCollection = database.collection(collectionName);
  
    await dataCollection.deleteMany();

  } catch(error){
    console.error(error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB Atlas');
  }
}
  
emptyDatabase();
