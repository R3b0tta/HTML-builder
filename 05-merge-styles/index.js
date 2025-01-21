const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'bundle.css');

fs.rm(bundle, { recursive: true, force: true }, (err) => {
  if (err) {
    console.error(`Error: ${err.message}`);
    return;
  }

  let styles = [];
  fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err.message}`);
      return;
    }
    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );
    let readFilesCount = 0;
    cssFiles.forEach((file) => {
      const filePath = path.join(stylesPath, file.name);

      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error(`Error reading file ${file.name}: ${err.message}`);
          return;
        }

        styles.push(data);
        readFilesCount++;
        if (readFilesCount === cssFiles.length) {
          fs.writeFile(bundle, styles.join('\n'), (err) => {
            if (err) {
              console.error(`Error writing to bundle.css: ${err.message}`);
            } else {
              console.log('Bundle created successfully!');
            }
          });
        }
      });
    });
  });
});
