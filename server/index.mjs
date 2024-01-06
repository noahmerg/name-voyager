import path from 'path';
import reload from 'reload';
import express from 'express';
import { MongoClient } from 'mongodb';

// use second argument or 8080 as PORT for server
const PORT = process.argv[2] || 8080;

// server is express server
const server = express();

// mongo db
const uri = 'mongodb+srv://noahmerg:CX6Ue4rcwgYWXJia@name-voyager.jgcwhtt.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);
const databaseName = 'name-voyager';
const namesCollectionName = 'names';
const bookmarkCollectionName = 'bookmarklist';

// use json as middleware
server.use(express.json({ extended: false }));
// use static as middleware
server.use(express.static(path.join(path.dirname(process.argv[1]), '../webapp/dist')));

// listen on PORT
reload(server).then(function (reloadReturned) { server.listen(PORT, () => { console.log('HTTP server listening on port %d.', PORT); }); }).catch(function (err) { console.error('Reload could not start, could not start server', err); });

// gets specific name with its data e.g. localhost:8080/name/noah
server.get('/name/:name', async (request, response) => {
  await client.connect();
  try {
    const db = client.db(databaseName);
    const dbCollection = db.collection(namesCollectionName);
    const searchedName = request.params.name;

    const cursor = await dbCollection.find({ name: searchedName });
    const ergebnis = await cursor.toArray();
    response.json(ergebnis);
  } finally {
    client.close();
  }
});
// gets all names or names that fit the queries e.g. localhost:8080/names?gender=m&&syllables=2&&includsuffix=ah&&includeprefix=No
server.get('/names', async (request, response) => {
  await client.connect();
  try {
    const db = client.db(databaseName);
    const dbCollection = db.collection(namesCollectionName);

    const filter = {};
    // Gender
    if (request.query.gender) {
      filter.gender = { $eq: request.query.gender };
    }

    // Syllables
    if (request.query.syllables) {
      if (parseInt(request.query.syllables) !== 0) {
        filter.syllables = { $eq: parseInt(request.query.syllables) };
      }
    }
    let regexString = '';

    // Prefix
    if (request.query.excludeprefix) {
      regexString += `^(?!${request.query.excludeprefix})`;
    } else if (request.query.includeprefix) {
      regexString += `^${request.query.includeprefix}`;
    }

    // Suffix
    if (request.query.excludesuffix) {
      regexString += `.*(?<!${request.query.excludesuffix})$`;
    } else if (request.query.includesuffix) {
      regexString += `.*${request.query.includesuffix}$`;
    }

    if (regexString) {
      const regex = new RegExp(regexString);
      filter.name = { $regex: regex };
    }
    console.log(filter);
    const cursor = await dbCollection.find(filter);
    const ergebnis = await cursor.toArray();
    // console.log(ergebnis);
    response.json(ergebnis);
  } finally {
    client.close();
  }
});
// gets all names of the bookmarklist and filters genders if specified localhost/bookmarklist?gender=m
server.get('/bookmarklist', async (request, response) => {
  await client.connect();
  try {
    const db = client.db(databaseName);
    const dbCollection = db.collection(bookmarkCollectionName);

    const filter = {};
    if (request.query.gender) {
      filter.gender = { $eq: request.query.gender };
    }
    const cursor = await dbCollection.find(filter).sort({ index: 1 });
    const ergebnis = await cursor.toArray();
    response.json(ergebnis);
  } finally {
    client.close();
  }
});
// adds a name to the bookmark list
server.post('/bookmarklist', async (request, response) => {
  const name = request.body.name;
  await client.connect();
  try {
    const db = client.db(databaseName);
    const destinationCollection = db.collection(bookmarkCollectionName);
    const originCollection = db.collection(namesCollectionName);
    const destinationCollectionSize = await destinationCollection.countDocuments();
    const index = destinationCollectionSize + 1;
    const originalData = await originCollection.findOne({ name });

    const data = { ...originalData, index };
    if (originalData) {
      await destinationCollection.insertOne(data);
      response.status(200).json({ message: 'Dokument erfolgreich kopiert' });
    } else {
      response.status(404).json({ message: 'Dokument nicht gefunden' });
    }
  } catch {
    response.status(404).json({ message: 'Fehler, entweder Duplikate oder sonstiges' });
  } finally {
    client.close();
  }
});
