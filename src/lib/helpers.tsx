import { Space, Button, Input, Progress } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { urlFor } from "./sanityClient";

// Coulumns Search Helper Function for data table component
export const getColumnSearchProps = (
  dataIndex: string,
  searchInput: any,
  searchedColumn: string,
  searchText: string,
  handleSearch: (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: string,
    dropdownStatus: boolean
  ) => void,
  handleReset: (clearFilters: () => void) => void
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    close,
  }: {
    setSelectedKeys: (selectedKeys: string[]) => void;
    selectedKeys: string[];
    confirm: () => void;
    clearFilters?: () => void;
    close: () => void;
  }) => (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Input
        ref={searchInput}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() =>
          handleSearch(selectedKeys, confirm, dataIndex, true)
        }
        style={{ marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex, true)}
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
            handleSearch(selectedKeys, confirm, dataIndex, false);
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
  filterIcon: (filtered: any) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
  onFilter: (value: any, record: any) =>
    record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  onFilterDropdownOpenChange: (visible: any) => {
    if (visible) {
      setTimeout(() => searchInput.current?.select(), 100);
    }
  },
  render: (text: any, record: any) => {
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

// Define an interface for the progress object
interface Item {
  [key: string]: number;
}

// Define the progress object with values for each facial emotion likelihood
const progress: Item = {
  VERY_UNLIKELY: 10,
  UNLIKELY: 20,
  POSSIBLE: 30,
  LIKELY: 40,
  VERY_LIKELY: 50,
};

// Define a function that takes an item object as an argument and returns an array of JSX elements
export const getFacialEmotions = (item: any) => {
  // Get the keys of the item object that end with "Likelihood"
  const faceProps = Object.keys(item)
    .filter((str) => str.endsWith("Likelihood"))
    .map((str) => {
      // Format the emotion name by removing "Likelihood" and capitalizing the first letter
      const emotion = (str.charAt(0).toUpperCase() + str.slice(1)).replace(
        "Likelihood",
        ""
      );
      return (
        <div
          style={{
            width: "98%",
            display: "flex",
            flexDirection: "column",
          }}
          key={emotion}
        >
          <span style={{ marginBottom: "5px" }}>
            {emotion} ({item[str]})
          </span>
          <Progress
            percent={progress[item[str]]}
            steps={5}
            size={[100, 10]}
            showInfo={false}
          />
        </div>
      );
    });
  return faceProps;
};

// Define the structure of the bounding polygon
interface BoundingPoly {
  normalizedVertices?: { x: number; y: number }[];
  vertices?: { x: number; y: number }[];
}

// Function to draw a bounding polygon on the canvas
export const drawPath = (
  boundingPoly: BoundingPoly,
  image: HTMLImageElement,
  ctx: CanvasRenderingContext2D
) => {
  const values = boundingPoly.normalizedVertices || boundingPoly.vertices;
  if (values) {
    const vertices = values.map(({ x, y }) => ({
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
  }
};
