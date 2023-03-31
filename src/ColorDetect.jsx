import { List, Input } from "antd";

const ColorDetect = ({ data }) => {
  function rgbToHex(r, g, b) {
    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');
    return `#${hexR}${hexG}${hexB}`;
  }
  return (
    <div
      style={{
        minHeight: "auto",
        maxHeight: 400,
        overflow: "auto",
        padding: "0 16px",
        border: "1px solid rgba(140, 140, 140, 0.35)",
      }}
    >
      <List
        dataSource={data.imagePropertiesAnnotation.dominantColors.colors}
        renderItem={(item, index) => (
          <List.Item key={index} extra={(item.score*100).toFixed(1)+"%"}>
            <List.Item.Meta
              title={`${rgbToHex(item.color.red, item.color.green, item.color.blue)}, RGB(${item.color.red},${item.color.green},${item.color.blue})`}
              description={
                <div
                  style={{
                    width: "98%",
                  }}
                >
                  <Input type="color" disabled value={rgbToHex(item.color.red, item.color.green, item.color.blue)} />
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ColorDetect;
