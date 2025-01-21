const fs = require('fs');
const path = require('path');

function replaceTemplateTags(templateFile, componentsDir, outputFile) {
  fs.readFile(templateFile, 'utf8', (err, templateContent) => {
    if (err) {
      console.error('Ошибка чтения шаблона:', err);
      return;
    }

    fs.readdir(componentsDir, (err, components) => {
      if (err) {
        console.error('Ошибка чтения директории компонентов:', err);
        return;
      }

      let completed = 0;

      components.forEach((component) => {
        const componentName = path.parse(component).name;
        const componentFilePath = path.join(componentsDir, component);

        fs.stat(componentFilePath, (err, stats) => {
          if (err) {
            console.error('Ошибка проверки файла компонента:', err);
            return;
          }

          if (stats.isFile()) {
            fs.readFile(componentFilePath, 'utf8', (err, componentContent) => {
              if (err) {
                console.error('Ошибка чтения компонента:', err);
                return;
              }

              const placeholder = `{{${componentName}}}`;
              templateContent = templateContent.replace(
                new RegExp(placeholder, 'g'),
                componentContent,
              );

              completed++;
              if (completed === components.length) {
                fs.writeFile(outputFile, templateContent, 'utf8', (err) => {
                  if (err) {
                    console.error('Ошибка записи файла результата:', err);
                  } else {
                    console.log('Шаблон успешно обработан:', outputFile);
                  }
                });
              }
            });
          } else {
            completed++;
          }
        });
      });
    });
  });
}

function bundleCSS(stylesPath, bundlePath) {
  fs.rm(bundlePath, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error('Ошибка удаления старого бандла:', err);
    }

    fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error('Ошибка чтения директории стилей:', err);
        return;
      }

      const cssFiles = files.filter(
        (file) => file.isFile() && path.extname(file.name) === '.css',
      );

      let styles = [];
      let readFilesCount = 0;

      cssFiles.forEach((file) => {
        const filePath = path.join(stylesPath, file.name);

        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error('Ошибка чтения CSS-файла:', err);
            return;
          }

          styles.push(data);
          readFilesCount++;

          if (readFilesCount === cssFiles.length) {
            fs.writeFile(bundlePath, styles.join('\n'), 'utf8', (err) => {
              if (err) {
                console.error('Ошибка записи CSS-бандла:', err);
              } else {
                console.log('CSS-бандл успешно создан:', bundlePath);
              }
            });
          }
        });
      });
    });
  });
}

function copyDirectory(src, dest) {
  fs.rm(dest, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error('Ошибка удаления старой директории:', err);
      return;
    }

    fs.mkdir(dest, { recursive: true }, (err) => {
      if (err) {
        console.error('Ошибка создания директории:', err);
        return;
      }

      fs.readdir(src, { withFileTypes: true }, (err, files) => {
        if (err) {
          console.error('Ошибка чтения исходной директории:', err);
          return;
        }

        files.forEach((file) => {
          const srcPath = path.join(src, file.name);
          const destPath = path.join(dest, file.name);

          if (file.isDirectory()) {
            copyDirectory(srcPath, destPath);
          } else {
            fs.copyFile(srcPath, destPath, (err) => {
              if (err) {
                console.error('Ошибка копирования файла:', err);
              } else {
                console.log(`Файл скопирован: ${srcPath} -> ${destPath}`);
              }
            });
          }
        });
      });
    });
  });
}

const stylesPath = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'style.css');
const sourceDir = path.join(__dirname, 'assets');
const targetDir = path.join(__dirname, 'project-dist', 'assets');
const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const outputFile = path.join(__dirname, 'project-dist', 'index.html');

replaceTemplateTags(templateFile, componentsDir, outputFile);
bundleCSS(stylesPath, bundle);
copyDirectory(sourceDir, targetDir);
