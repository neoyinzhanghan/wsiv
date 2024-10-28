// File: components/ImageViewer.js

import { useEffect, useRef, useState } from "react";

const ImageViewer = ({ imageUrl }) => {
  const viewerRef = useRef(null);
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    // This function runs only in the browser (client-side)
    const initializeViewer = async () => {
      if (typeof window !== "undefined" && imageUrl && viewerRef.current && !viewer) {
        // Dynamically import OpenSeadragon only on the client-side
        const OpenSeadragon = (await import("openseadragon")).default;

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
