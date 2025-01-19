const fs = require('fs/promises');
const path = require('path');

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

const cssFiles = [
  path.join(__dirname, 'styles', 'style-1.css'),
  path.join(__dirname, 'styles', 'style-2.css'),
  path.join(__dirname, 'styles', 'style-3.css'),
];
const outputCss = path.join(__dirname, 'project-dist', 'bundle.css');

mergeStyles(cssFiles, outputCss);
