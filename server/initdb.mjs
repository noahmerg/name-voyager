import fs from 'fs';
import path, { dirname } from 'path';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import { connectToDatabase, closeDatabaseConnection } from './db.mjs';

// TO RUN A MONGO INSTANCE: sudo mongod --dbpath ~/data/db
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const databaseName = 'name-voyager';
const collectionName = 'names';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function populateDatabase () {
  try {
    await connectToDatabase();

    const database = client.db(databaseName);
    const dataCollection = database.collection(collectionName);

    const csvData = await fs.readFileSync(path.resolve(__dirname, './Namen.csv'), 'utf8');

    const rows = csvData.trim().split('\n').map(row => row.split(';'));

    rows.shift();

    const data = rows.map(row => ({ vorname: row[0], geschlecht: row[1] }));

    await dataCollection.insertMany(data);

    console.log('Imported all data!');
  } catch (error) {
    console.error('Error during database population:', error);
    process.exit(-1);
  } finally {
    await closeDatabaseConnection();
    process.exit(0);
  }
}

await populateDatabase();
