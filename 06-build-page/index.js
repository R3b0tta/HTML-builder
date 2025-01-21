const fs = require('fs/promises');
const path = require('path');

async function replaceTemplateTags(templateFile, componentsDir, outputFile) {
  try {
    console.log('Начинаем замену тегов в шаблоне...');
    let templateContent = await fs.readFile(templateFile, 'utf8');
    const components = await fs.readdir(componentsDir);

    for (const component of components) {
      const componentName = path.parse(component).name;
      const componentFilePath = path.join(componentsDir, component);

      const stats = await fs.stat(componentFilePath);
      if (stats.isFile()) {
        const componentContent = await fs.readFile(componentFilePath, 'utf8');

        const placeholder = `{{${componentName}}}`;
        templateContent = templateContent.replace(
          new RegExp(placeholder, 'g'),
          componentContent,
        );
      }
    }

    await fs.writeFile(outputFile, templateContent, 'utf8');
    console.log('Замена завершена. Результат сохранён в', outputFile);
  } catch (error) {
    console.error('Ошибка при замене тегов в шаблоне:', error);
  }
}
const stylesPath = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'style.css');

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

async function copyDirectory(src, dest) {
  try {
    await fs.rm(dest, { recursive: true, force: true });
    console.log('Обновляем директорию...');

    await fs.mkdir(dest, { recursive: true });

    const files = await fs.readdir(src);

    for (const file of files) {
      const srcFilePath = path.join(src, file);
      const destFilePath = path.join(dest, file);
      const stats = await fs.stat(srcFilePath);
      if (stats.isDirectory()) {
        await copyDirectory(srcFilePath, destFilePath);
      } else {
        await fs.copyFile(srcFilePath, destFilePath);
        console.log(`Файл скопирован: ${srcFilePath} -> ${destFilePath}`);
      }
    }

    console.log('Копирование завершено.');
  } catch (err) {
    console.error('Ошибка при копировании директории:', err);
  }
}

const sourceDir = path.join(__dirname, 'assets');
const targetDir = path.join(__dirname, 'project-dist', 'assets');
const cssFiles = [
  path.join(__dirname, 'styles', '01-header.css'),
  path.join(__dirname, 'styles', '02-main.css'),
  path.join(__dirname, 'styles', '03-footer.css'),
];
const outputCss = path.join(__dirname, 'project-dist', 'style.css');
const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const outputFile = path.join(__dirname, 'project-dist', 'index.html');

replaceTemplateTags(templateFile, componentsDir, outputFile);
copyDirectory(sourceDir, targetDir);
