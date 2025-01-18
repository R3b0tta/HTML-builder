const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
  if (err) throw err;
});

stdout.write('Hello. Write a text:\n');
stdin.on('data', (data) => {
  if (data.toString().trim().toLowerCase() === 'exit') {
    process.exit();
  }
  fs.appendFile(path.join(__dirname, 'text.txt'), data, (err) => {
    if (err) throw err;
    console.log('File was modified');
    stdout.write('Write a text:\n');
  });
});
process.on('exit', () => {
  console.log('\nGoodbye! Your text has been saved.');
});
process.on('SIGINT', () => {
  process.exit();
});
