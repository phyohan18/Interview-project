import { List, Input } from "antd";

// Define the shape of the ColorList props
interface ColorListProps {
  data: {
    dominantColors: {
      colors: {
        color: {
          red: number;
          green: number;
          blue: number;
        };
        score: number;
      }[];
    };
  };
}

const ColorList = ({ data }: ColorListProps) => {

  // A function to convert RGB values to Hex code.
  function rgbToHex(r: number, g: number, b: number) {
    const hexR = r.toString(16).padStart(2, "0");
    const hexG = g.toString(16).padStart(2, "0");
    const hexB = b.toString(16).padStart(2, "0");
    return `#${hexR}${hexG}${hexB}`;
  }

  return (
    <div className="stats-container">
      <List
        dataSource={data.dominantColors.colors}
        renderItem={(item, index) => (
          <List.Item key={index} extra={(item.score * 100).toFixed(1) + "%"}>
            <List.Item.Meta
              title={`${rgbToHex(
                item.color.red,
                item.color.green,
                item.color.blue
              )}, RGB(${item.color.red},${item.color.green},${
                item.color.blue
              })`}
              description={
                <div
                  style={{
                    width: "98%",
                  }}
                >
                  <Input
                    type="color"
                    disabled
                    value={rgbToHex(
                      item.color.red,
                      item.color.green,
                      item.color.blue
                    )}
                  />
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ColorList;
