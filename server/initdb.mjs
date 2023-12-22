// uri for database: mongodb+srv://noahmerg:<password>@name-voyager.jgcwhtt.mongodb.net/?retryWrites=true&w=majority

import config from './config.json' assert {type: 'json'};
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFileSync } from 'fs';

const { username, password } = config;
// const uri = `mongodb.localhost:22017... wenn selbst gehostet
const uri = 'mongodb://localhost:27017/name-voyager.names';
const client = new MongoClient(uri);

const databaseName = 'name-voyager';
const collectionName = 'names';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to populate the database
async function populateDatabase() {
  try {
    // Connect to MongoDB Atlas
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

    // Insert data into MongoDB collection
    await dataCollection.insertMany(data);

    // Continue with the rest of your script...

  } finally {
    // Close the MongoDB Atlas connection
    await client.close();
    console.log('Disconnected from MongoDB Atlas');
  }
}

// Call the function to populate the database
populateDatabase();