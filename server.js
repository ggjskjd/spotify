const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.json({ limit: "10mb" }));

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Untitled-1.html"));
});

// Endpoint to upload photo
app.post("/upload-photo", (req, res) => {
  const { image } = req.body;

  if (!image || !image.startsWith("data:image")) {
    return res.status(400).json({ status: "error", message: "Invalid image data" });
  }

  const matches = image.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!matches) {
    return res.status(400).json({ status: "error", message: "Invalid image format" });
  }

  const ext = matches[1]; // e.g., png, jpeg
  const data = matches[2];
  const buffer = Buffer.from(data, "base64");

  const photosDir = path.join(__dirname, "public", "photos");
  if (!fs.existsSync(photosDir)) {
    fs.mkdirSync(photosDir, { recursive: true });
  }

  const filename = `photo_${Date.now()}.${ext}`;
  const filepath = path.join(photosDir, filename);

  fs.writeFile(filepath, buffer, (err) => {
    if (err) {
      console.error("Failed to save photo:", err);
      return res.status(500).json({ status: "error", message: "Failed to save photo" });
    }

    const photoUrl = `/photos/${filename}`;

    // Save last uploaded photo URL to a txt file in public folder
    fs.writeFileSync(path.join(__dirname, "public", "last-photo.txt"), photoUrl);

    res.json({ status: "success", url: photoUrl });
  });
});

// Endpoint to get last photo URL
app.get("/last-photo", (req, res) => {
  const filePath = path.join(__dirname, "public", "last-photo.txt");
  if (fs.existsSync(filePath)) {
    const url = fs.readFileSync(filePath, "utf8");
    res.json({ url });
  } else {
    res.status(404).json({ message: "No photo found." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
