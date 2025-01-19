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
async function mergeStyles(cssFiles, outputFile) {
  try {
    console.log('Начинаем объединение...');
    const mergedStyles = [];

    for (const filePath of cssFiles) {
      const mergeContent = await fs.readFile(filePath, 'utf8');
      mergedStyles.push(mergeContent);
    }
    const resultContent = mergedStyles.join('\n');
    await fs.writeFile(outputFile, resultContent, 'utf8');
    console.log('Объединение завершено...');
  } catch (error) {
    console.error('Ошибка при объединении файлов', error);
  }
}
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
mergeStyles(cssFiles, outputCss);
copyDirectory(sourceDir, targetDir);
