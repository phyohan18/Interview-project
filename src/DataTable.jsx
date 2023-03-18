import React, { useState, useEffect } from "react";
import { Table } from "antd";
// import EXIF from "exif-js";
import Image from './assets/panorama/Building.jpg';

const columns = [
  {
    title: "File Name",
    dataIndex: "fileName",
    key: "fileName",
    render: (text => <a>{text}</a>)
  },
  {
    title: "File Size",
    dataIndex: "fileSize",
    key: "fileSize",
  },
  {
    title: "File Type",
    dataIndex: "fileType",
    key: "fileType",
  },
  {
    title: "Date Created",
    dataIndex: "dateCreated",
    key: "dateCreated",
  },
  {
    title: "Date Modified",
    dataIndex: "dateModified",
    key: "dateModified",
  },
  {
    title: "Dimensions",
    dataIndex: "dimensions",
    key: "dimensions",
  },
  {
    title: "Resolution (PPI)",
    dataIndex: "resolutionPpi",
    key: "resolutionPpi",
  },
  {
    title: "Color Space",
    dataIndex: "colorSpace",
    key: "colorSpace",
  },
  {
    title: "Camera Make and Model",
    dataIndex: "cameraMakeModel",
    key: "cameraMakeModel",
  },
  {
    title: "Exposure Settings",
    dataIndex: "exposureSettings",
    key: "exposureSettings",
  },
  {
    title: "Action",
    dataIndex: "Action",
    key: "Action",
    render: () => <a onClick={() => setOpen(true)}>View</a>,
  },
];

const DataTable = () => {
  const [panoramas, setPanoramas] = useState([{
    fileName:'Hello World',
    fileSize: '100kb',
    fileType: 'Jpeg',
    dateCreated: 'Today',
    dateModified: 'Yesterday',
    dimensions: `1000 x 2000`,
    resolutionPpi: 'idk',
    colorSpace: 'idk',
    cameraMakeModel: `Cannon`,
    exposureSettings: `Shutter Speed: 200, Aperture: f/9, ISO: 8`,
  }]);

  // Load panoramas
  useEffect(()=>{
     // Load image metadata
    const loadImageMetadata = (file) => {
        EXIF.getData(file, function () {
          const dateCreated = EXIF.getTag(this, "DateTimeOriginal");
          const make = EXIF.getTag(this, "Make");
          const model = EXIF.getTag(this, "Model");
          const exposureTime = EXIF.getTag(this, "ExposureTime");
          const fNumber = EXIF.getTag(this, "FNumber");
          const iso = EXIF.getTag(this, "ISOSpeedRatings");

          return {
            fileSize: file.size,
            fileType: file.type,
            dateCreated,
            dateModified: file.lastModifiedDate,
            dimensions: `${this.imageWidth} x ${this.imageHeight}`,
            resolutionPpi: this.resolutionUnit === 3 ? this.xResolution : null,
            colorSpace: this.getColorSpace(),
            cameraMakeModel: `${make} ${model}`,
            exposureSettings: `Shutter Speed: ${exposureTime}, Aperture: f/${fNumber}, ISO: ${iso}`,
          };
        });
    };
    // const loadedPanoramas = () =>{
    //   const metadata = loadImageMetadata(Image);
    //   return { ...metadata, fileName: 'Hello' };
    // }
    // setPanoramas(loadedPanoramas)
  },[])

  return <Table dataSource={panoramas} columns={columns} />;
};

export default DataTable;
