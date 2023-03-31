import React, { useRef, useEffect } from "react";

const ImageCanvas = ({ imageSrc, imageData, boundingPolyData }) => {
  //   if (imageData.localizedObjectAnnotations == 'undefined')
  //   {
  //const boundingPoly = imageData.localizedObjectAnnotations.boundingPoly
  //   console.log(imageData);

  //   }

  const canvasRef = useRef(null);

  const drawPath = (boundingPoly,image,ctx) => {
    const vertices = boundingPoly.normalizedVertices.map(({ x, y }) => ({
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
    image.src = imageSrc;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      if (boundingPolyData.status == true) {
        const objects = imageData[boundingPolyData.boundingPoly]
        objects.map((item)=> {
            drawPath(item.boundingPoly,image,ctx);
        })
      }
    };
  }, [imageSrc, boundingPolyData.status]);

  return (
    <canvas ref={canvasRef} style={{ maxWidth: "100%", maxHeight: "100%" }} />
  );
};

export default ImageCanvas;
