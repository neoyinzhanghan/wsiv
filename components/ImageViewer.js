// File: components/ImageViewer.js

import { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";

const ImageViewer = ({ imageUrl }) => {
  const viewerRef = useRef(null);
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && imageUrl && viewerRef.current && !viewer) {
      // Initialize OpenSeadragon Viewer
      const osdViewer = OpenSeadragon({
        element: viewerRef.current,
        prefixUrl: "/openseadragon/images/",
        tileSources: {
          type: "image",
          url: imageUrl,
        },
        showNavigator: true,
      });

      setViewer(osdViewer);
    }
  }, [imageUrl]);

  return <div ref={viewerRef} style={{ width: "100%", height: "500px" }} />;
};

export default ImageViewer;
