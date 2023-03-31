import { Divider, List, Progress } from "antd";

const ObjectDetect = ({ data }) => {
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
        dataSource={data.localizedObjectAnnotations}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <List.Item.Meta
              title={item.name}
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
      {data.localizedObjectAnnotations && data.localizedObjectAnnotations.length > 5 ? <Divider plain>It is all, nothing more 🤐</Divider> : null}
    </div>
  );
};

export default ObjectDetect;
