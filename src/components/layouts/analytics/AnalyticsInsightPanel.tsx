import { useSelector } from "react-redux";
import { List, Progress, Divider, Image } from "antd";
import ColorList from "./ColorList";
import FaceDetect from "./FaceDetect";
import { imageState } from "../../../lib/store";

const AnalyticsInsightPanel = () => {

  // Select the image state from the Redux store using the `useSelector` hook
  const image = useSelector(imageState);

  // Extract the `imageDetails` and `activeTab` properties from the image state
  const dataSource = image.imageDetails;
  const feature = image.activeTab;

  // If the active tab is "imagePropertiesAnnotation", render the ColorList component
  if (feature == "imagePropertiesAnnotation") {
    return <ColorList data={dataSource[feature]} />;
  }

  // If the active tab is "faceAnnotations", render the FaceDetect component
  if (feature == "faceAnnotations") {
    return <FaceDetect data={dataSource[feature]} />;
  }

  // If the active tab is neither "imagePropertiesAnnotation" nor "faceAnnotations",
  // render the data in a list with a progress bar and a map image (if available)
  return (
    <div className="stats-container">
      {dataSource && feature != null ? (
        <>
          <List
            dataSource={dataSource[feature]}
            renderItem={(item: any, index) => (
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
                        percent={parseFloat((item.score * 100).toFixed(1))}
                      />
                    </div>
                  }
                />
              </List.Item>
            )}
          />
          {dataSource[feature].length > 5 && (
            <Divider plain>It is all, nothing more 🤐</Divider>
          )}
        </>
      ) : null}
    </div>
  );
};

export default AnalyticsInsightPanel;
