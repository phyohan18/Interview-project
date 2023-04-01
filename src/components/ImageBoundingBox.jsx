import React, { useRef, useEffect } from "react";
import { urlFor } from "../lib/sanityClient";
import { useSelector } from "react-redux";

const ImageBoundingBox = () => {
  const imageDetails = useSelector(
    (state) => state.image.imageDetails.imageAnalyticsInsight
  );
  const featureName = useSelector((state) => state.image.cardTab);
  const imageUrl = useSelector((state) => state.image.imageUrl);
  const canvasRef = useRef();

  const drawPath = (boundingPoly, image, ctx) => {
    const values = boundingPoly.normalizedVertices || boundingPoly.vertices
    const vertices = values.map(({ x, y }) => ({
      x: x * image.width,
      y: y * image.height,
    }));
    ctx.beginPath();
    vertices.forEach(({ x, y }, i) => {
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#57ff03";
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    if (imageUrl) {
      image.src = urlFor(imageUrl).height(400).format("webp").url();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        const objects = imageDetails[featureName];
        objects.length > 0 && objects.map((item) => {
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
