const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' })); // to handle big image data

app.post('/upload-photo', (req, res) => {
  const imageData = req.body.image; // base64 image string

  console.log('Received image data, length:', imageData.length);
  res.json({ status: 'success' });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
