const express = require("express");
const path = require("path");
const app = express();

// Parse JSON payloads (base64 image data)
app.use(express.json({ limit: '10mb' }));

// Serve index.html when user visits "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Untitled-1.html"));
});

// Handle photo upload
app.post("/upload-photo", (req, res) => {
  const { image } = req.body;

  if (!image || !image.startsWith("data:image")) {
    return res.status(400).json({ status: "error", message: "Invalid image data" });
  }

  // Just echo the image back (base64)
  res.json({
    status: "success",
    url: image,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
