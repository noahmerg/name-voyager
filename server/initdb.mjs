// uri for database: mongodb+srv://noahmerg:<password>@name-voyager.jgcwhtt.mongodb.net/?retryWrites=true&w=majority

import config from './config.json' assert {type: 'json'};
const { username, password } = config;
import { MongoClient } from 'mongodb';

// MongoDB Atlas connection string
const uri = `mongodb+srv://${username}:${password}@name-voyager.jgcwhtt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

// Function to populate the database
async function populateDatabase() {
  try {
    // Connect to MongoDB Atlas
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    // Continue with the rest of your script...

  } finally {
    // Close the MongoDB Atlas connection
    await client.close();
    console.log('Disconnected from MongoDB Atlas');
  }
}

// Call the function to populate the database
populateDatabase();