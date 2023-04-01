import { Space, Dropdown, Tag, Input, Button } from "antd";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { urlFor } from "../../../lib/sanityClient";
import Highlighter from "react-highlight-words";


const getColumnSearchProps = (dataIndex,searchInput,searchedColumn,searchText,handleSearch,handleReset) => ({
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
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex, true)}
        style={{ marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex , true)}
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
            handleSearch(selectedKeys, confirm, dataIndex , false);
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

const columns = (showModal,searchInput,searchedColumn,searchText,handleSearch,handleReset) => [
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
    ...getColumnSearchProps("fileName",searchInput,searchedColumn,searchText,handleSearch,handleReset),
    sorter: (a, b) => a.fileName.localeCompare(b.fileName),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Dimensions",
    dataIndex: "dimensions",
    key: "dimensions",
    responsive: ["sm"],
    ...getColumnSearchProps("dimensions",searchInput,searchedColumn,searchText,handleSearch,handleReset),
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

export default columns;
