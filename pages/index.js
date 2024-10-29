// File: pages/index.js

import { useState } from 'react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      // Get presigned URL from API route
      const response = await fetch(`/api/get-presigned-url?fileName=${selectedFile.name}&fileType=${selectedFile.type}`);
      const { signedUrl } = await response.json();

      // Upload to S3 using the signed URL
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      if (uploadResponse.ok) {
        setUploadStatus('File uploaded successfully!');
      } else {
        setUploadStatus('Upload failed.');
      }
    } catch (error) {
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Upload to S3</h1>
      <input type="file" onChange={handleFileChange} accept=".svs,.ndpi" />
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}
