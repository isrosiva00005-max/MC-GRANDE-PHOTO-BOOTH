const fs = require('fs');
const https = require('https');
const path = require('path');

const publicDir = path.join(__dirname, 'public', 'pico');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const files = [
  {
    url: 'https://raw.githubusercontent.com/tehnokv/picojs/master/pico.js',
    dest: path.join(publicDir, 'pico.js')
  },
  {
    url: 'https://raw.githubusercontent.com/tehnokv/picojs/master/facefinder',
    dest: path.join(publicDir, 'facefinder')
  }
];

files.forEach(file => {
  https.get(file.url, (res) => {
    const stream = fs.createWriteStream(file.dest);
    res.pipe(stream);
    stream.on('finish', () => {
      stream.close();
      console.log(`Downloaded ${file.dest}`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${file.url}: ${err.message}`);
  });
});
