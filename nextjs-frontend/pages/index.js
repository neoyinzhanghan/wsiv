import React, { useState } from 'react';
import axios from 'axios';
import OpenSeadragon from 'openseadragon';

export default function Home() {
    const [slideData, setSlideData] = useState(null);
    const [viewer, setViewer] = useState(null);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                const { slide_name, width, height, max_level } = response.data;
                setSlideData({ slide_name, width, height, max_level });

                if (viewer) {
                    viewer.destroy();
                }

                const newViewer = OpenSeadragon({
                    id: "openseadragon1",
                    prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/",
                    tileSources: {
                        height,
                        width,
                        tileSize: 512,
                        minLevel: 0,
                        maxLevel,
                        getTileUrl: (level, x, y) => {
                            return `http://localhost:5000/tile/${level}/${x}/${y}/?v=${new Date().getTime()}`;
                        },
                    },
                    showNavigator: true,
                });

                setViewer(newViewer);
            } else {
                alert('Upload failed: ' + response.data.error);
            }
        } catch (error) {
            alert('Error uploading file');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Whole Slide Image Viewer</h1>
            <input type="file" accept=".svs,.ndpi" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload and View</button>
            {slideData && (
                <div id="openseadragon1" style={{ width: '800px', height: '600px', marginTop: '20px' }}></div>
            )}
        </div>
    );
}
