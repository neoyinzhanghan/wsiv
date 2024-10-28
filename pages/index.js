import { useState } from "react";
import ImageViewer from "../components/ImageViewer";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    setImagePath(result.filePath);
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
