import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const folderPath = './toOrder';
const newFolderPath = './finalOrder';

// Read file pairs
const filePairs = fs
  .readdirSync(folderPath, { withFileTypes: true })
  .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.json'))
  .map((dirent) => ({
    jsonPath: path.join(folderPath, dirent.name),
    pngPath: path.join(folderPath, dirent.name.replace('.json', '.png')),
  }));

// Shuffle file pairs
const shuffledPairs = shuffleArray(filePairs);

// Create new folder
if (!fs.existsSync(newFolderPath)) {
  fs.mkdirSync(newFolderPath);
}

// Move and rename file pairs to new folder
for (let i = 0; i < shuffledPairs.length; i++) {
  const { jsonPath, pngPath } = shuffledPairs[i];
  const newJsonName = i + path.extname(jsonPath);
  const newPngName = i + path.extname(pngPath);
  fs.renameSync(jsonPath, path.join(newFolderPath, newJsonName));
  fs.renameSync(pngPath, path.join(newFolderPath, newPngName));

  // Update JSON file with new PNG file name
  const jsonData = JSON.parse(fs.readFileSync(path.join(newFolderPath, newJsonName), 'utf-8'));
  jsonData.properties.files[0].uri = newPngName;
  jsonData.image = newPngName;
  fs.writeFileSync(path.join(newFolderPath, newJsonName), JSON.stringify(jsonData));

  console.log(`Renamed ${path.basename(jsonPath)} and ${path.basename(pngPath)} to ${newJsonName} and ${newPngName}`);
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}