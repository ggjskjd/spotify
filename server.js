const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.json({ limit: "10mb" }));

// ✅ Serve static files (including saved photos)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Untitled-1.html"));
});

app.post("/upload-photo", (req, res) => {
  const { image } = req.body;

  if (!image || !image.startsWith("data:image")) {
    return res.status(400).json({ status: "error", message: "Invalid image data" });
  }

  // ✅ Extract base64 data
  const matches = image.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!matches) {
    return res.status(400).json({ status: "error", message: "Invalid image format" });
  }

  const ext = matches[1]; // e.g., "png", "jpeg"
  const data = matches[2];
  const buffer = Buffer.from(data, "base64");

  // ✅ Ensure "public/photos" exists
  const photosDir = path.join(__dirname, "public", "photos");
  if (!fs.existsSync(photosDir)) {
    fs.mkdirSync(photosDir, { recursive: true });
  }

  // ✅ Generate unique filename
  const filename = `photo_${Date.now()}.${ext}`;
  const filepath = path.join(photosDir, filename);

  // Save file
fs.writeFile(filepath, buffer, (err) => {
  if (err) {
    console.error("Failed to save photo:", err);
    return res.status(500).json({ status: "error", message: "Failed to save photo" });
  }

  
  const photoUrl = `/photos/${filename}`;


  // ✅ Save the latest uploaded filename for browser access
  fs.writeFileSync(path.join(__dirname, "public", "last-photo.txt"), photoUrl);

  // Respond to client
  res.json({ status: "success", url: photoUrl });
});
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
