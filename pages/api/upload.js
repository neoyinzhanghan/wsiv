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
  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const file = files.file[0];
    const relativePath = `/uploads/${file.newFilename}`;

    res.status(200).json({ filePath: relativePath });
  });
};

export default uploadHandler;
