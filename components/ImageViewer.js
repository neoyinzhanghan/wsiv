// File: components/ImageViewer.js

import { useEffect, useRef, useState } from "react";

const ImageViewer = ({ imageUrl }) => {
  const viewerRef = useRef(null);
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    // This check ensures that the code only runs in the browser
    if (typeof window !== "undefined") {
      // Dynamically import OpenSeadragon only in the browser environment
      import("openseadragon").then(OpenSeadragon => {
        if (imageUrl && viewerRef.current && !viewer) {
          const osdViewer = OpenSeadragon.default({
            element: viewerRef.current,
            prefixUrl: "/openseadragon/images/",
            tileSources: {
              type: "image",
              url: imageUrl,
            },
          });
          setViewer(osdViewer);
        }
      });
    }
  }, [imageUrl]);

  return <div ref={viewerRef} style={{ width: "100%", height: "500px" }} />;
};

export default ImageViewer;
