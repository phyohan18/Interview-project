import React, { useState, useEffect } from "react";
import Bridge from "./assets/panorama/Building.jpg";

function Extract() {
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {

    
  }, []);

  if (!metadata) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <h2>{metadata.image.ImageDescription == "undefined" || "No description"}</h2>
      {metadata.image.ImageFormat && (
        <p>Image format: {metadata.image.ImageFormat}</p>
      )}
      {metadata.image.ImageWidth && metadata.image.ImageHeight && (
        <p>
          Image size: {metadata.image.ImageWidth} x {metadata.image.ImageHeight}
        </p>
      )} */}
      {/* Display other metadata properties as needed */}
    </div>
  );
}

export default Extract;
