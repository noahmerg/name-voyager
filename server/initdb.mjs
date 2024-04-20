import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { connectToDatabase, namesCollection } from './db.mjs';
import { countSyllables } from 'syllabificate';

// sudo mongod --dbpath ~/data/db

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function populateDatabase () {
  try {
    connectToDatabase();

    const csvData = await fs.readFileSync(path.resolve(__dirname, './Namen.csv'), 'utf8');

    const rows = csvData.trim().split(/\r?\n/).map(row => row.split(';'));

    rows.shift(); // remove csv header

    const data = rows.map(row => ({ name: row[0], gender: row[1], syllables: countSyllables(row[0]) }));

    await namesCollection.insertMany(data);

    console.log('Imported all data!');
  } catch (error) {
    console.error('Error during database population:', error);
    process.exit(-1);
  } finally {
    process.exit(0);
  }
}

await populateDatabase();
