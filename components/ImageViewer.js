// File: components/ImageViewer.js

import { useEffect, useRef, useState } from "react";
let OpenSeadragon = null;

const ImageViewer = ({ imageUrl }) => {
  const viewerRef = useRef(null);
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    // Dynamically import OpenSeadragon to only load it on the client-side
    const initializeViewer = async () => {
      if (typeof window !== "undefined" && imageUrl && viewerRef.current && !viewer) {
        if (!OpenSeadragon) {
          OpenSeadragon = (await import("openseadragon")).default;
        }
        
        const osdViewer = OpenSeadragon({
          element: viewerRef.current,
          prefixUrl: "/openseadragon/images/",
          tileSources: {
            type: "image",
            url: imageUrl,
          },
        });
        setViewer(osdViewer);
      }
    };

    initializeViewer();
  }, [imageUrl]);

  return <div ref={viewerRef} style={{ width: "100%", height: "500px" }} />;
};

export default ImageViewer;
