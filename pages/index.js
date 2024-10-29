// File: pages/index.js

import { useState } from 'react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0); // Progress state

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      // Get presigned URL from API route
      const response = await fetch(`/api/get-presigned-url?fileName=${selectedFile.name}&fileType=${selectedFile.type}`);
      const { signedUrl } = await response.json();

      // Create a new XMLHttpRequest to track progress
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedUrl, true);

      // Set Content-Type header
      xhr.setRequestHeader('Content-Type', selectedFile.type);

      // Update progress state on upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      };

      // Handle successful upload
      xhr.onload = () => {
        if (xhr.status === 200) {
          setUploadStatus('File uploaded successfully!');
          setUploadProgress(100);
        } else {
          setUploadStatus('Upload failed.');
        }
      };

      // Handle error during upload
      xhr.onerror = () => {
        setUploadStatus('Upload failed due to an error.');
      };

      // Send the file data
      xhr.send(selectedFile);
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

      {uploadProgress > 0 && (
        <div>
          <p>Upload Progress: {uploadProgress}%</p>
          <progress value={uploadProgress} max="100" />
        </div>
      )}
    </div>
  );
}
