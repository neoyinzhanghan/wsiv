// File: pages/api/upload.js

import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Use the /tmp directory on Vercel
const uploadDir = path.join("/tmp", "/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadHandler = async (req, res) => {
  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 512 * 1024 * 1024, // Limit of 512 MB
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Formidable Error:", err);
      return res.status(500).json({ error: err.message });
    }

    const fileKey = Object.keys(files)[0];
    if (!fileKey) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = files[fileKey];
    const relativePath = `/uploads/${file.newFilename}`;
    const filePath = path.join(uploadDir, file.newFilename);

    console.log("File saved at:", filePath);
    return res.status(200).json({ message: "Upload successful", filePath });
  });
};

export default uploadHandler;
