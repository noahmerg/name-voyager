import { connectToDatabase, closeDatabaseConnection, namesCollection, bookmarkCollection } from './db.mjs';

async function emptyDatabase () {
  try {
    await connectToDatabase();
    await bookmarkCollection.deleteMany();
    await namesCollection.deleteMany();
    console.log('Deleted all data from database');
  } catch (error) {
    console.error(error);
  } finally {
    await closeDatabaseConnection();
    process.exit(0);
  }
}

await emptyDatabase();
