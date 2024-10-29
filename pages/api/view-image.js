// File: pages/api/view-image.js

import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { path: filePath } = req.query;

  if (!filePath || !filePath.startsWith("/tmp/uploads/")) {
    return res.status(400).json({ error: "Invalid file path" });
  }

  const mimeType = filePath.endsWith(".png")
    ? "image/png"
    : filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")
    ? "image/jpeg"
    : "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("File read error:", err);
      return res.status(500).json({ error: "File not found or cannot be read" });
    }

    res.setHeader("Content-Type", mimeType);
    res.send(data);
  });
}
