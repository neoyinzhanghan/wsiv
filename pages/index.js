// File: pages/index.js

import { useState } from "react";
import dynamic from "next/dynamic";

const ImageViewer = dynamic(() => import("../components/ImageViewer"), {
  ssr: false, // Disable server-side rendering
});

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

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
        console.error("Upload Error:", errorData.error); // Client-side error logging
        setUploadStatus(`Upload failed: ${errorData.error}`);
        return;
      }

      const result = await response.json();
      console.log("Upload successful. File path:", result.filePath); // Log success
      setUploadStatus("Upload successful!");
    } catch (error) {
      console.error("Upload Failed:", error);
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Whole Slide Image Uploader</h1>
      <input type="file" onChange={handleFileChange} accept=".svs,.ndpi" />
      <button onClick={handleUpload}>Upload</button>

      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}
