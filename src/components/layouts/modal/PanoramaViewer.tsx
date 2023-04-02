import React, { useEffect, useRef } from "react";
import { urlFor } from "../../../lib/sanityClient";
import SceneInit from "../../../lib/SceneInit";

const PanoramaViewer = ({ image }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<SceneInit | null>(null);

  useEffect(() => {
    // NOTE Three.js scene initializing
    const canvas = canvasRef.current;
    const viewer = new SceneInit(canvas);
    viewer.initialize();
    viewer.animate();
    viewerRef.current = viewer;
  }, []);

  useEffect(() => {
    if (viewerRef.current) {
      // Loading texture image
      const textureImage = urlFor(image).format("webp").url();
      viewerRef.current.updateTexture(textureImage);
    }

    // Cleaning Up Texture on component dismount
    return () => {
      viewerRef.current?.cleanUpTexture();
    };
  }, [image]);

  return <canvas ref={canvasRef} style={{ width: "100%" }}></canvas>;
};

export default React.memo(PanoramaViewer);
