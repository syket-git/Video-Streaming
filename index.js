const express = require('express');
const app = express();
const fs = require('fs');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/video', (req, res) => {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send('Requires range header');
  }
  const videoPath = 'fox.mp4';
  const videoSize = fs.statSync('fox.mp4').size;
  // console.log(videoSize);
  // Parse Range
  // Example: "bytes=2323-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range?.replace(/\D/g, ''));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    'Content-Range': `bytes ${start} - ${end}/${videoSize}`,
    'Accept-ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  };
  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`App up and running on ${PORT}`));
