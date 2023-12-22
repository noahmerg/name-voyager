import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFileSync } from 'fs';

const uri = 'mongodb://172.25.80.1:27017/name-voyager'; // wsl
// const uri = 'mongodb://127.0.0.1:27017/name-voyager'; // windows
// const uri = 'mongodb://localhost:27017/name-voyager'; // ubuntu
const client = new MongoClient(uri);

const databaseName = 'name-voyager';
const collectionName = 'names';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function populateDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const database = client.db(databaseName);
    const dataCollection = database.collection(collectionName);

    const csvPath = `${__dirname}/Namen.csv`;
    const csvData = readFileSync(csvPath, 'utf8');

    const rows = csvData.trim().split('\n').map(row => row.split(';'));

    const headers = rows.shift();

    const data = rows.map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });

    await dataCollection.insertMany(data);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB Atlas');
  }
}
populateDatabase();
