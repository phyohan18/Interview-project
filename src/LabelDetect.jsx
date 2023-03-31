import { Divider, List, Progress } from "antd";

const LabelDetect = ({ data }) => {
  return (
    <div
      style={{
        height: 400,
        overflow: "auto",
        padding: "0 16px",
        border: "1px solid rgba(140, 140, 140, 0.35)",
      }}
    >
      <List
        dataSource={data.labelAnnotations}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <List.Item.Meta
              title={item.description}
              description={
                <div
                  style={{
                    width: "98%",
                  }}
                >
                  <Progress
                    strokeLinecap="butt"
                    percent={(item.score * 100).toFixed(1)}
                    size="medium"
                  />
                </div>
              }
            />
          </List.Item>
        )}
      />
      {data.labelAnnotations && data.labelAnnotations.length > 5 ? (
        <Divider plain>It is all, nothing more 🤐</Divider>
      ) : null}
    </div>
  );
};

export default LabelDetect;
