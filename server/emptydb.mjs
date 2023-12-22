
import config from './config.json' assert {type: 'json'};
import { MongoClient } from 'mongodb';

const { username, password } = config;
const uri = `mongodb+srv://${username}:${password}@name-voyager.jgcwhtt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

const databaseName = 'name-voyager';
const collectionName = 'names';

async function emptyDatabase() {
    try {
      // Connect to MongoDB Atlas
      await client.connect();
      console.log('Connected to MongoDB Atlas');
  
      const database = client.db(databaseName);
      const dataCollection = database.collection(collectionName);
    
      await dataCollection.deleteMany();
  
    } catch(error){
        console.error(error);
    } finally {
      // Close the MongoDB Atlas connection
      await client.close();
      console.log('Disconnected from MongoDB Atlas');
    }
}
  
emptyDatabase();
