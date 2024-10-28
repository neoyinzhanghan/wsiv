// pages/api/upload.js
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parsing
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Parse the uploaded file
  const form = new formidable.IncomingForm();
  form.uploadDir = './public/uploads'; // Ensure this directory exists or create it
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'File upload failed' });
    }

    const uploadedFile = files.file;
    const filePath = path.join(form.uploadDir, uploadedFile.newFilename);

    // Here, you should add logic to process the slide file (using OpenSlide, for example),
    // extract metadata, and potentially convert it to a DZI format or create tiles.

    // Placeholder metadata for demonstration purposes
    const metadata = {
      slide_name: uploadedFile.newFilename,
      width: 40000, // Use actual width after processing
      height: 30000, // Use actual height after processing
      max_level: 7, // Use actual max zoom level after processing
    };

    return res.status(200).json({ success: true, ...metadata });
  });
}
