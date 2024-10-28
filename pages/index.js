// File: pages/index.js

import { useState } from "react";
import ImageViewer from "../components/ImageViewer";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const validTypes = [".svs", ".ndpi"];
    const fileType = file.name.slice(file.name.lastIndexOf("."));

    if (!validTypes.includes(fileType.toLowerCase())) {
      alert("Invalid file type. Please upload a .svs or .ndpi file.");
      setSelectedFile(null);
    } else {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload Error:", errorData); // Log entire error data
        alert(`Upload failed: ${errorData.error}`);
        return;
      }

      const result = await response.json();
      console.log("Upload successful. File path:", result.filePath); // Log success
      setImagePath(result.filePath);
    } catch (error) {
      console.error("Upload Failed:", error);
      alert(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Whole Slide Image Viewer</h1>
      <input type="file" onChange={handleFileChange} accept=".svs,.ndpi" />
      <button onClick={handleUpload}>Upload and View</button>

      {imagePath && <ImageViewer imageUrl={imagePath} />}
    </div>
  );
}
