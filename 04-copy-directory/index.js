const fs = require('fs/promises');
const path = require('path');

async function copyDirectory(src, dest) {
  try {
    await fs.rm(dest, { recursive: true, force: true });
    console.log('Обновляем директорию...');

    await fs.mkdir(dest, { recursive: true });

    const files = await fs.readdir(src);

    for (const file of files) {
      const srcFilePath = path.join(src, file);
      const destFilePath = path.join(dest, file);
      await fs.copyFile(srcFilePath, destFilePath);
    }

    console.log('Копирование завершено.');
  } catch (err) {
    console.error('Ошибка при копировании директории:', err);
  }
}

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'filesCopy');

copyDirectory(sourceDir, targetDir);
