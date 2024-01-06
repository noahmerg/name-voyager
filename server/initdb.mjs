import fs from 'fs';
import path, { dirname } from 'path';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import { connectToDatabase, closeDatabaseConnection } from './db.mjs';
import { countSyllables } from 'syllabificate';

// TO RUN A MONGO INSTANCE: sudo mongod --dbpath ~/data/db
const uri = `mongodb+srv://noahmerg:CX6Ue4rcwgYWXJia@name-voyager.jgcwhtt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
const databaseName = 'name-voyager';
const namesCollectionName = 'names';
const bookmarkCollectionName = 'bookmarklist';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function populateDatabase () {
  try {
    await connectToDatabase();
    const database = client.db(databaseName);
    // creates empty collection for all the saved names (bookmarklist)
    database.collection(bookmarkCollectionName);
    // creates the main collection that stores all names
    const dataCollection = database.collection(namesCollectionName);

    const csvData = await fs.readFileSync(path.resolve(__dirname, './Namen.csv'), 'utf8');

    const rows = csvData.trim().split(/\r?\n/).map(row => row.split(';'));

    rows.shift();

    const data = rows.map(row => ({ name: row[0], gender: row[1], syllables: countSyllables(row[0]) }));

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
