import React, { useState, useEffect, useRef } from "react";
import { Table, Space, Dropdown, Tag, Input, Button } from "antd";

import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import MyModal from "./MyModal";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

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
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const loadingStatus = () => {
    return panoramas.length === 0;
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text, record) => {
      if (dataIndex !== "fileName") {
        return searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        );
      }

      const { fileURL } = record;
      const imgSrc = urlFor(fileURL).width(35).height(35).format("webp").url();

      return (
        <Space wrap size={8}>
          <img width={35} height={35} src={imgSrc} />
          {searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          ) : (
            text
          )}
        </Space>
      );
    },
  });
  const columns = [
    {
      title: "No",
      dataIndex: "key",
      ellipsis: true,
      responsive: ["md"],
      width: "6%",
      sorter: (a, b) => a.key - b.key,
      sortDirections: ["descend", "ascend"],
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
      ...getColumnSearchProps("fileName"),
      sorter: (a, b) => a.fileName.localeCompare(b.fileName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Dimensions",
      dataIndex: "dimensions",
      key: "dimensions",
      responsive: ["sm"],
      ...getColumnSearchProps("dimensions"),
      sorter: (a, b) => a.width - b.width,
      sortDirections: ["descend", "ascend"],
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
            {record.Make || record.Model ? (
              <>
                <Tag color="blue">{record.Make}</Tag>
                <Tag color="green">{record.Model}</Tag>
              </>
            ) : (
              "-"
            )}
          </>
        );
      },
      sorter: (a, b) => {
        if (a.Make === undefined) return 1;
        if (b.Make === undefined) return -1;
        return a.Make.localeCompare(b.Make);
      },
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      render: (_, record) => {
        const items = [
          {
            key: "1",
            label: <a onClick={() => showModal(record, "1")}>360&#176; View</a>,
          },
          {
            key: "2",
            label: <a onClick={() => showModal(record, "2")}>Image Details</a>,
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
            height: item.image.metadata.dimensions.height,
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

  return (
    <>
      <Table
        dataSource={panoramas}
        columns={columns}
        loading={loadingStatus()}
        tableLayout="auto"
      />
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
