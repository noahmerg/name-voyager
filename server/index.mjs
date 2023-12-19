import path from 'path';

import express from 'express';

// use second argument or 8080 as PORT for server
const PORT = process.argv[2] || 8080;

// server is express server
const server = express();

// use static as middleware
server.use(express.static(path.join(path.dirname(process.argv[1]), '../webapp/dist')));

// listen on PORT
server.listen(PORT, () => { console.log('HTTP server listening on port %d.', PORT); });
