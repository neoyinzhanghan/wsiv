// pages/api/upload.js

import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import OpenSeadragon from 'openseadragon';

export const config = {
  api: {
    bodyParser: false, // Disables the default body parser to handle file uploads
  },
};

const UPLOAD_DIR = path.join(process.cwd(), '/public/uploads');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests are allowed' });
  }

  // Ensure upload directory exists
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  // Parse the uploaded file
  const form = new formidable.IncomingForm();
  form.uploadDir = UPLOAD_DIR;
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Error parsing the uploaded file' });
    }

    const uploadedFile = files.file;
    const filePath = uploadedFile.filepath;

    // Add logic to read the file and extract the necessary dimensions for the viewer

    // Example response (use real dimensions here)
    return res.status(200).json({
      success: true,
      slide_name: uploadedFile.newFilename,
      width: 10000, // Replace with real width
      height: 10000, // Replace with real height
      max_level: 5, // Replace with real max level
    });
  });
}
