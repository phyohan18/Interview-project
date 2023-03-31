import { List, Image, Progress } from "antd";

const LandmarkDetect = ({ data }) => {
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
        dataSource={data.landmarkAnnotations}
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
                  <Image
                    width="100%"
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${item.locations[0].latLng.latitude},${item.locations[0].latLng.longitude}&zoom=12&size=1200x250&markers=color:red%7C${item.locations[0].latLng.latitude},${item.locations[0].latLng.longitude}&key=AIzaSyAd62tdFwXQ1eMRS_VbwmGYUOlzrsR7YH0`}
                  />
                  <h4 style={{marginBottom: '5px'}}>Possibility</h4>
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
    </div>
  );
};

export default LandmarkDetect;
