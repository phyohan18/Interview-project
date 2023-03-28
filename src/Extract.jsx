import React, { useState, useEffect } from "react";
import Bridge from "./assets/panorama/Bridge.jpeg";
import Building from "./assets/panorama/Building.jpg";
import Hotel from "./assets/panorama/Hotel.jpg";
import Indoor from "./assets/panorama/Indoor.jpg";
import Miami from "./assets/panorama/Miami.jpeg";
import Park from "./assets/panorama/Park.jpg";
import Sea from "./assets/panorama/Sea.jpg";
import Sidewalk from "./assets/panorama/Sidewalk.jpg";
import Snow from "./assets/panorama/Snow.jpeg";
import Street from "./assets/panorama/Street.jpg";

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
