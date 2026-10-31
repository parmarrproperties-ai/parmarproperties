import fs from 'fs';
import path from 'path';
import https from 'https';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2560&q=90',
    filename: 'hero-1-crisp.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2560&q=90',
    filename: 'hero-2-crisp.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2560&q=90',
    filename: 'hero-3-crisp.jpg',
  },
];

const targetDir = path.join(process.cwd(), 'public', 'hero');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(dest));
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  for (const item of images) {
    const dest = path.join(targetDir, item.filename);
    console.log(`Downloading ${item.filename}...`);
    await download(item.url, dest);
    console.log(`Saved ${item.filename}`);
  }
}

main().catch(console.error);
