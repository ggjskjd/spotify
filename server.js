function sendPhotoToServer(dataUrl) {
  fetch("/upload-photo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: dataUrl }),
  })
  .then((res) => res.json())
  .then((data) => {
    if (data.status === "success") {
      console.log("Photo uploaded:", data.url);
      // Show the uploaded photo on the page
      photo.src = data.url;  // photo is the <img id="photo">
      photo.style.display = "block"; // make sure image is visible
    } else {
      console.error("Upload error:", data.message);
    }
  })
  .catch((error) => {
    console.error("Error uploading photo:", error);
  });
}
