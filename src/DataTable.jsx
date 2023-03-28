import React, { useState, useEffect, useRef } from "react";
import { Table, Space, Dropdown } from "antd";

import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import MyModal from "./MyModal";
import { DownOutlined } from "@ant-design/icons";

import exifr from "exifr";

import Bridge from "./assets/panorama/Building.jpg";
import Building from "./assets/panorama/Building.jpg";
import Hotel from "./assets/panorama/Hotel.jpg";
import Indoor from "./assets/panorama/Indoor.jpg";
import Miami from "./assets/panorama/Miami.jpeg";
import Park from "./assets/panorama/Park.jpg";
import Sea from "./assets/panorama/Sea.jpg";
import Sidewalk from "./assets/panorama/Sidewalk.jpg";
import Snow from "./assets/panorama/Snow.jpeg";
import Street from "./assets/panorama/Street.jpg";


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
  const [activeTab, setActiveTab] = useState("1");
  const imgRef = useRef();

  const showModal = (image, activeTab) => {
    setModalVisible(true);
    setActiveTab(activeTab);
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
      ellipsis: true,
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
      ellipsis: true,
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
      render: (_, record) => {
        const items = [
          {
            key: "1",
            label: (
              <a onClick={() => showModal(record.fileURL, "1")}>
                360&#176; View
              </a>
            ),
          },
          {
            key: "2",
            label: (
              <a onClick={() => showModal(record.fileURL, "2")}>
                Image Details
              </a>
            ),
          },
        ];
        return (
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                More
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        );
      },
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
        getExifData(`/public/panorama/${item.title}.jpg`);
        return {
          key: index + 1,
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
    async function getExifData(image_url) {
      const exifData = await exifr.parse(image_url);
      console.log(exifData);
    }

    // return {
    //   fileSize: file.size,
    //   fileType: file.type,
    //   dateCreated,
    //   dateModified: file.lastModifiedDate,
    //   dimensions: `${this.imageWidth} x ${this.imageHeight}`,
    //   resolutionPpi: this.resolutionUnit === 3 ? this.xResolution : null,
    //   colorSpace: this.getColorSpace(),
    //   cameraMakeModel: `${make} ${model}`,
    //   exposureSettings: `Shutter Speed: ${exposureTime}, Aperture: f/${fNumber}, ISO: ${iso}`,
    // };
    //   });
    // const loadedPanoramas = () =>{
    //   const metadata = loadImageMetadata(Image);
    //   return { ...metadata, fileName: 'Hello' };
    // }
    // setPanoramas(loadedPanoramas)
  }, []);

  return (
    <>
      <Table dataSource={panoramas} columns={columns} />
      <MyModal
        visible={modalVisible}
        onCancel={handleCancel}
        curImg={imgRef.current}
        activeTab={activeTab}
      />
    </>
  );
};

export default DataTable;
