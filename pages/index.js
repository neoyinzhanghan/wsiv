// File: pages/index.js

import { useState } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [filePath, setFilePath] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    // Check if file size is within Vercel's /tmp limit
    if (selectedFile.size > 512 * 1024 * 1024) {
      alert("File size must be below 512 MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Upload Error:", errorData);
        setUploadStatus(`Upload failed: ${errorData}`);
        return;
      }

      const result = await response.json();
      setFilePath(result.filePath);
      setUploadStatus("Upload successful!");
    } catch (error) {
      console.error("Upload Failed:", error);
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Upload a Whole Slide Image</h1>
      <input type="file" onChange={handleFileChange} accept=".svs,.ndpi" />
      <button onClick={handleUpload}>Upload</button>

      {uploadStatus && <p>{uploadStatus}</p>}
      {filePath && (
        <div>
          <h2>Uploaded File Path:</h2>
          <p>{filePath}</p>
        </div>
      )}
    </div>
  );
}
