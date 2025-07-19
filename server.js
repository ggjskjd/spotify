const express = require('express');
const path = require('path');
const app = express();

app.use(express.json({ limit: '10mb' })); // to handle big image data

// Serve the HTML file on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Untitled-1.html')); // change filename if needed
});

// Handle photo upload
app.post('/upload-photo', (req, res) => {
  const imageData = req.body.image; // base64 image string
  console.log('Received image data, length:', imageData.length);
  res.json({ status: 'success' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
