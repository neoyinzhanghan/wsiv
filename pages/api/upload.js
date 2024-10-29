// File: pages/api/upload.js

import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "/public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadHandler = async (req, res) => {
  try {
    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024 * 1024, // 5 GB
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Formidable Error:", err); // Log server-side error
        return res.status(500).json({ error: err.message });
      }

      console.log("Files received:", files); // Log received files

      const file = files.file[0];
      const relativePath = `/uploads/${file.newFilename}`;
      console.log("File saved at:", relativePath); // Log where file is saved

      return res.status(200).json({ message: "Upload successful", filePath: relativePath });
    });
  } catch (error) {
    console.error("Unexpected Server Error:", error);
    return res.status(500).json({ error: "Unexpected server error occurred." });
  }
};

export default uploadHandler;
