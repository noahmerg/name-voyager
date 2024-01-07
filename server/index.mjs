import path from 'path';
import reload from 'reload';
import express from 'express';
import { bookmarkCollection, namesCollection } from './db.mjs';

// use second argument or 8080 as PORT for server
const PORT = process.argv[2] || 8080;

// server is express server
const server = express();

// use json as middleware
server.use(express.json({ extended: false }));
// use static as middleware
server.use(express.static(path.join(path.dirname(process.argv[1]), '../webapp/dist')));

// listen on PORT
reload(server).then(function (reloadReturned) {
  server.listen(PORT, () => { console.log('HTTP server listening on port %d.', PORT); });
}).catch(function (err) {
  console.error('Reload could not start, could not start server', err);
});

// gets specific name with its data e.g. localhost:8080/name/noah
server.get('/name/:name', async (request, response) => {
  try {
    const searchedName = request.params.name;
    const cursor = await namesCollection.find({ name: searchedName });
    const ergebnis = await cursor.toArray();
    response.json(ergebnis);
  } catch (error) {
    console.error(error);
  }
});

// gets all names or names that fit the queries e.g. localhost:8080/names?gender=m&&syllables=2&&includsuffix=ah&&includeprefix=No
server.get('/names', async (request, response) => {
  try {
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
    // console.log(filter);
    const cursor = await namesCollection.find(filter);
    const ergebnis = await cursor.toArray();
    // console.log(ergebnis);
    response.json(ergebnis);
  } catch (error) {
    console.error(error);
  }
});

// gets all names of the bookmarklist and filters genders if specified localhost/bookmarklist?gender=m
server.get('/bookmarklist', async (request, response) => {
  try {
    const filter = {};
    if (request.query.gender) {
      filter.gender = { $eq: request.query.gender };
    }
    const cursor = await bookmarkCollection.find(filter).sort({ index: 1 });
    const ergebnis = await cursor.toArray();
    response.json(ergebnis);
  } catch (error) {
    console.error(error);
  }
});
// adds a name to the bookmark list
server.post('/bookmarklist', async (request, response) => {
  const name = request.body.name;
  try {
    const index = await bookmarkCollection.countDocuments() + 1;
    const originalData = await namesCollection.findOne({ name });

    const data = { ...originalData, index };
    if (originalData) {
      await bookmarkCollection.insertOne(data);
      response.status(200).json({ message: 'Dokument erfolgreich kopiert' });
    } else {
      response.status(404).json({ message: 'Dokument nicht gefunden' });
    }
  } catch (error) {
    response.status(404).json({ message: 'Fehler, entweder Duplikate oder sonstiges' });
  }
});
server.patch('/bookmarklist/:name', async function (request, response) {
  const name = request.params.name;
  const newIndex = request.body.newIndex;
  try {
    await bookmarkCollection.updateOne({ name }, { $set: { index: newIndex } });
    response.status(200).json({ message: 'Index erfolgreich geupdated' });
  } catch (error) {
    response.status(500).json({ message: 'Konnte Index nicht updaten' });
  }
});
server.delete('/bookmarklist/:name', async (request, response) => {
  try {
    await bookmarkCollection.deleteOne({ name: request.params.name });
    response.status(200).json({ message: 'Name erfolgreich gelöscht' });
    console.log('löschen lol');
  } catch (error) {
    response.status(500).json({ message: 'Konnte Name nicht löschen' });
  }
});
