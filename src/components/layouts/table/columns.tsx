import { Space, Dropdown, Tag } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { urlFor } from "../../../lib/sanityClient";
import { getColumnSearchProps } from "../../../lib/helpers";

const columns = (
  showModal: (record: any, activeTab: any) => void,
  searchInputRef: any,
  handleSearch: (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: string,
    dropdownStatus: boolean
  ) => void,
  handleReset: (clearFilters: () => void)=>void,
  searchedColumn: string,
  searchText: string
): any[] => [
  {
    title: "No",
    dataIndex: "key",
    ellipsis: true,
    responsive: ["md"],
    width: "6%",
    sorter: (a: any, b: any) => a.key - b.key,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "File Name",
    dataIndex: "fileName",
    key: "fileName",
    // @ts-ignore
    render: (_: any, record: any) => {
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
    ...getColumnSearchProps(
      "fileName",
      searchInputRef,
      searchedColumn,
      searchText,
      handleSearch,
      handleReset
    ),
    sorter: (a: any, b: any) => a.fileName.localeCompare(b.fileName),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Dimensions",
    dataIndex: "dimensions",
    key: "dimensions",
    responsive: ["sm"],
    ...getColumnSearchProps(
      "dimensions",
      searchInputRef,
      searchedColumn,
      searchText,
      handleSearch,
      handleReset
    ),
    sorter: (a: any, b: any) => a.width - b.width,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "File Type",
    dataIndex: "fileType",
    key: "fileType",
    responsive: ["md"],
    render: (_: any, record: any) => (
      <Tag color="magenta">{record.fileType}</Tag>
    ),
  },
  {
    title: "Camera Make and Model",
    dataIndex: "cameraMakeModel",
    key: "cameraMakeModel",
    responsive: ["md"],
    render: (_: any, record: any) => {
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
    sorter: (a: any, b: any) => {
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
    render: (_: any, record: any) => {
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

export default columns;
