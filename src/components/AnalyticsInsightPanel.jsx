import React from "react";
import { useSelector} from "react-redux";
import { List, Progress, Divider, Image } from "antd";
import ColorList from "./ColorList";
import FaceDetect from "./FaceDetect";

const AnalyticsInsightPanel = () => {
  const dataSource = useSelector(
    (state) => state.image.imageDetails.imageAnalyticsInsight
  );
  const feature = useSelector((state) => state.image.cardTab);

  if (feature == "imagePropertiesAnnotation") {
    return <ColorList data={dataSource[feature]} />;
  }
  
  if( feature == "faceAnnotations") {
    return <FaceDetect data={dataSource[feature]}/>
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
      {dataSource && (
        <List
          dataSource={dataSource[feature]}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                title={item.name || item.description}
                description={
                  <div
                    style={{
                      width: "98%",
                    }}
                  >
                    {item.locations && (
                      <div style={{ marginTop: "10px" }}>
                        <Image
                          width="100%"
                          src={`https://maps.googleapis.com/maps/api/staticmap?center=${item.locations[0].latLng.latitude},${item.locations[0].latLng.longitude}&zoom=12&size=1200x250&markers=color:red%7C${item.locations[0].latLng.latitude},${item.locations[0].latLng.longitude}&key=AIzaSyAd62tdFwXQ1eMRS_VbwmGYUOlzrsR7YH0`}
                        />
                        <h4 style={{ marginBottom: "5px" }}>Confidence</h4>
                      </div>
                    )}
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
      )}
      {dataSource && dataSource[feature].length > 5 ? (
        <Divider plain>It is all, nothing more 🤐</Divider>
      ) : null}
    </div>
  );
};

export default AnalyticsInsightPanel;
