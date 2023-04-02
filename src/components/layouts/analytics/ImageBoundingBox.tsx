import { useRef, useEffect } from "react";
import { urlFor } from "../../../lib/sanityClient";
import { useSelector } from "react-redux";
import { imageState } from "../../../lib/store";
import { drawPath } from "../../../lib/helpers";

// Define the structure of the bounding polygon
interface BoundingPoly {
  normalizedVertices?: { x: number; y: number }[];
  vertices?: { x: number; y: number }[];
}

// Define the structure of the image object that contains a bounding polygon
interface ImageObject {
  boundingPoly: BoundingPoly;
}

const ImageBoundingBox = () => {
  // Get the image details and active tab from the Redux store
  const image = useSelector(imageState);
  const imageDetails = image.imageDetails;
  const featureName = image.activeTab;
  const imageUrl = image.imageUrl;

  // Create a reference to the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const image = new Image();
    if (imageUrl && ctx && featureName && canvas) {
      // Load the image and set its height and format
      image.src = urlFor(imageUrl).height(400).format("webp").url();

      // Once the image has loaded, draw it on the canvas and draw the bounding polygons
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        const objects = imageDetails[featureName];
        objects.length > 0 &&
          objects.map((item: ImageObject) => {
            if (item.boundingPoly) {
              drawPath(item.boundingPoly, image, ctx);
            }
          });
      };
    }
  }, [featureName]);

  return (
    <canvas ref={canvasRef} style={{ maxWidth: "100%", maxHeight: "100%" }} />
  );
};

export default ImageBoundingBox;
