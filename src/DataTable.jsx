import React, { useState, useEffect , useRef } from "react";
import { Table, Space,Button } from "antd";

import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import MyModal from "./MyModal";

const sanityClient = createClient({
  projectId: "0u3qo37j",
  dataset: "production",
  apiVersion: "v1",
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);
const urlFor = (source) => builder.image(source);

const DataTable = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const imgRef = useRef();

  const showModal = (image) => {
    setModalVisible(true);
    imgRef.current = image;
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const [panoramas, setPanoramas] = useState([]);

  const columns = [
    {
      title: "No",
      dataIndex: "key",
    },
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
      render: (_, record) => {
        return (
          <Space wrap size={8}>
            <img
              width={35}
              height={35}
              src={urlFor(record.fileURL)
                .width(35)
                .height(35)
                .format("webp")
                .url()}
            />
            {record.fileName}
          </Space>
        );
      },
    },
    // {
    //   title: "File Size",
    //   dataIndex: "fileSize",
    //   key: "fileSize",
    // },
    // {
    //   title: "File Type",
    //   dataIndex: "fileType",
    //   key: "fileType",
    // },
    // {
    //   title: "Date Created",
    //   dataIndex: "dateCreated",
    //   key: "dateCreated",
    // },
    // {
    //   title: "Date Modified",
    //   dataIndex: "dateModified",
    //   key: "dateModified",
    // },
    // {
    //   title: "Dimensions",
    //   dataIndex: "dimensions",
    //   key: "dimensions",
    // },
    // {
    //   title: "Resolution (PPI)",
    //   dataIndex: "resolutionPpi",
    //   key: "resolutionPpi",
    // },
    // {
    //   title: "Color Space",
    //   dataIndex: "colorSpace",
    //   key: "colorSpace",
    // },
    // {
    //   title: "Camera Make and Model",
    //   dataIndex: "cameraMakeModel",
    //   key: "cameraMakeModel",
    // },
    // {
    //   title: "Exposure Settings",
    //   dataIndex: "exposureSettings",
    //   key: "exposureSettings",
    // },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      render: (_, record) => <Button onClick={()=>showModal(record.fileURL)}>View 360&#176;</Button>,
    },
  ];
  // Load panoramas
  useEffect(() => {
    // Load image metadata from Sanity Backend
    const fetchData = async () => {
      const query = `*[_type == 'images']{
        _id,
        title,
        image {
          "metadata" : asset->metadata,
          "url": asset->url
        }
      }|order(_createdAt asc)`;
      const result = await sanityClient.fetch(query);
      const loadedPanoramas = result.map((item, index) => {
        return {
          key: index,
          fileName: item.title,
          fileURL: item.image.url,
          fileType: "",
          dimensions: `${item.image.metadata.dimensions.width} x ${item.image.metadata.dimensions.height}`,
          ...item.image.metadata,
        };
      });
      setPanoramas(loadedPanoramas);
    };
    fetchData();
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
  }, []);

  return (
    <>
      <Table dataSource={panoramas} columns={columns} />
      <MyModal visible={modalVisible} onCancel={handleCancel} curImg={imgRef.current} />
    </>
  );
};

export default DataTable;
