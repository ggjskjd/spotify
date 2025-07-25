const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

app.post("/upload-photo", (req, res) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ status: "error", message: "No image provided" });
  }

  const matches = image.match(/^data:image\/png;base64,(.+)$/);
  if (!matches) {
    return res.status(400).json({ status: "error", message: "Invalid image data" });
  }

  const base64Data = matches[1];

  const photoDir = path.join(__dirname, "public", "photos");
  if (!fs.existsSync(photoDir)) {
    fs.mkdirSync(photoDir, { recursive: true });
  }

  const photoPath = path.join(photoDir, "last-photo.png");

  fs.writeFile(photoPath, base64Data, "base64", (err) => {
    if (err) {
      console.error("Error saving photo:", err);
      return res.status(500).json({ status: "error", message: "Failed to save photo" });
    }

    const lastPhotoUrl = `/photos/last-photo.png`;
    const lastPhotoTxtPath = path.join(__dirname, "public", "last-photo.txt");
    fs.writeFileSync(lastPhotoTxtPath, lastPhotoUrl, "utf8");

    res.json({ status: "success", url: lastPhotoUrl });
  });
});

app.get("/last-photo", (req, res) => {
  const lastPhotoTxtPath = path.join(__dirname, "public", "last-photo.txt");
  if (fs.existsSync(lastPhotoTxtPath)) {
    const url = fs.readFileSync(lastPhotoTxtPath, "utf8");
    res.json({ url });
  } else {
    res.status(404).json({ message: "No photo found." });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
