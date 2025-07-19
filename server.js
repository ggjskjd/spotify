const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' })); // to handle big image data

// Serve uploads folder as static so images can be accessed from browser
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle photo upload
app.post('/upload-photo', (req, res) => {
  const imageData = req.body.image; // base64 image string

  if (!imageData) {
    return res.status(400).json({ status: 'error', message: 'No image data received' });
  }

  // Strip the metadata part of the base64 string
  const base64Data = imageData.replace(/^data:image\/png;base64,/, "");

  // Define filename and path
  const fileName = `photo_${Date.now()}.png`;
  const uploadsDir = path.join(__dirname, 'uploads');

  // Make sure the 'uploads' folder exists
  fs.mkdirSync(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, fileName);

  // Write the image file
  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Error saving image:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to save image' });
    }
    console.log(`Image saved to ${filePath}`);
    // Respond with the public URL of the saved image
    res.json({ status: 'success', url: `/uploads/${fileName}` });
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
