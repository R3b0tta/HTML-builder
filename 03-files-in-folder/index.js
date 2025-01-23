const fs = require('fs');
const path = require('path');
const { stdout } = process;

const fileExtensions = [];
const fileSize = [];
const fileStats = [];

fs.readdir(path.join(__dirname, 'secret-folder'), (err, files) => {
  if (err) throw err;

  const fileStatsPromises = files.map((file) => {
    const filePath = path.join(__dirname, 'secret-folder', file);

    return new Promise((resolve) => {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Ошибка при получении информации о файле:', err);
          resolve();
        } else if (stats.isFile() && !stats.isDirectory()) {
          fileExtensions.push(path.extname(filePath));
          fileStats.push(stats);
          fileSize.push(stats.size.toString() + 'bytes');
        }
        resolve();
      });
    });
  });

  Promise.all(fileStatsPromises)
    .then(() => {
      for (let i = 0; i < fileStats.length; ++i) {
        const dotIndex = files[i].indexOf('.');
        let resultFile;
        let resultExtension;
        if (dotIndex !== -1) {
          resultFile = files[i].slice(0, dotIndex);
        }
        resultExtension = fileExtensions[i].slice(1);
        stdout.write(`${resultFile} - ${resultExtension} - ${fileSize[i]} \n`);
      }
    })
    .catch((err) => {
      console.error(err);
    });
});
