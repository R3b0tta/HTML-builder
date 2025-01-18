const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'text.txt');
const readableStream = fs.createReadStream(filePath, 'utf-8');

readableStream.pipe(process.stdout);
