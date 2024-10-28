import OpenSeadragon from "openseadragon";
import { useEffect, useRef, useState } from "react";

const ImageViewer = ({ imageUrl }) => {
  const viewerRef = useRef(null);
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    if (imageUrl && viewerRef.current && !viewer) {
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
  }, [imageUrl]);

  return <div ref={viewerRef} style={{ width: "100%", height: "500px" }} />;
};

export default ImageViewer;
