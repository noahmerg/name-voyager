import { MongoError } from 'mongodb';
import { connectToDatabase, closeDatabaseConnection, namesCollection } from './db.mjs';

async function testdb () {
  try {
    await connectToDatabase();

    const names = await namesCollection.find().toArray();

    if (names.length === 0) throw MongoError;

    console.log('Number of Names found: %s', names.length);
    console.log('Random name as an example that DB was filles correctly: ');
    const rand = Math.floor(Math.random() * names.length);
    console.log('Vorname: ' + names[rand].name);
    console.log('Geschlecht: ' + names[rand].gender);
    console.log('Silben: ' + names[rand].syllables);
  } catch (error) {
    console.error('something in the DB went wrong: ' + error);
  } finally {
    await closeDatabaseConnection();
    process.exit(0);
  }
}

testdb();
