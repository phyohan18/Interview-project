import React, { useState, useEffect, useRef } from "react";
import { Table, Space, Dropdown, Tag } from "antd";

import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import MyModal from "./MyModal";
import { DownOutlined } from "@ant-design/icons";

import exifr from "exifr";

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

  const showModal = (imageInfo, activeTab) => {
    setModalVisible(true);
    setActiveTab(activeTab);
    imgRef.current = imageInfo;
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
      responsive: ["md"],
      width: 70,
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
    {
      title: "Dimensions",
      dataIndex: "dimensions",
      key: "dimensions",
      responsive: ["sm"],
    },
    {
      title: "File Type",
      dataIndex: "fileType",
      key: "fileType",
      responsive: ["md"],
      render: (_, record) => <Tag color="magenta">{record.fileType}</Tag>,
    },
    {
      title: "Camera Make and Model",
      dataIndex: "cameraMakeModel",
      key: "cameraMakeModel",
      responsive: ["md"],
      render: (_, record) => {
        return (
          <>
            {record.Make || record.Model ? 
              <>
                <Tag color="blue">{record.Make}</Tag> 
                <Tag color="green">{record.Model}</Tag>
              </> : 
              "-"}
          </>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      render: (_, record) => {
        const items = [
          {
            key: "1",
            label: (
              <a onClick={() => showModal(record, "1")}>
                360&#176; View
              </a>
            ),
          },
          {
            key: "2",
            label: (
              <a onClick={() => showModal(record, "2")}>
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
      const loadedPanoramas = await Promise.all(
        result.map(async (item, index) => {
          const exifData = await getExifData(`/panorama/${item.title}.jpg`);
          return {
            key: index + 1,
            fileName: item.title,
            fileURL: item.image.url,
            fileType: "JPG",
            dimensions: `${item.image.metadata.dimensions.width} x ${item.image.metadata.dimensions.height}`,
            ...exifData,
            width: item.image.metadata.dimensions.width,
            height: item.image.metadata.dimensions.height
          };
        })
      );
      setPanoramas(loadedPanoramas);
    };
    fetchData();
    async function getExifData(image_file) {
      const exifData = await exifr.parse(image_file);
      return exifData;
    }
  }, []);

  // function selectCommonKeys(arr) {
  //   if (arr.length === 0) {
  //     return [];
  //   }

  //   // Get the keys of the first object
  //   const keys = Object.keys(arr[0]);

  //   // Filter the keys that are not present in all objects
  //   const commonKeys = keys.filter((key) =>
  //     arr.every((obj) => obj.hasOwnProperty(key))
  //   );

  //   return commonKeys;
  // }
  // console.log(selectCommonKeys(panoramas.slice(0, 3)));

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
