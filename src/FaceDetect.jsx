import { Divider, List, Progress } from "antd";

const FaceDetect = ({ data }) => {

  const progress = {
    VERY_UNLIKELY: 10,
    UNLIKELY: 20,
    POSSIBLE: 30,
    LIKELY: 40,
    VERY_LIKELY: 50,
  };
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
        dataSource={data.faceAnnotations}
        renderItem={(item, index) => {
          const faceProps = Object.keys(item)
            .filter((str) => str.endsWith("Likelihood"))
            .map((str) => {
              const emotion = (
                str.charAt(0).toUpperCase() + str.slice(1)
              ).replace("Likelihood", "");
              return (
                <div
                  style={{
                    width: "98%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span style={{ marginBottom: '5px' }}>
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
          return (
            <List.Item key={index}>
              <List.Item.Meta
                title={`Face ${index + 1}`}
                description={faceProps}
              />
            </List.Item>
          );
        }}
      />
      {data.logoAnnotations && data.logoAnnotations.length > 5 ? (
        <Divider plain>It is all, nothing more 🤐</Divider>
      ) : null}
    </div>
  );
};

export default FaceDetect;
