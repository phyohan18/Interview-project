import { useEffect } from "react";
import { Card, Cascader, Row, Col } from "antd";
import { fetchImageDetails, switchTab } from "../features/imageSlice.js";
import { useSelector, useDispatch } from "react-redux";

import ImageBoundingBox from "./ImageBoundingBox.jsx";
import AnalyticsInsightPanel from "./AnalyticsInsightPanel.jsx";

const Analytics = () => {
  // Getting image data from redux store
  const image = useSelector((state) => state.image);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchImageDetails(image.panoramaImages[0].value));
  }, []);

  const onChange = (_, selectedOptions) => {
    const imageUrl = selectedOptions.map((o) => o.value).join(", ");
    dispatch(fetchImageDetails(imageUrl));
  };

  const onTabChange = (key) => {
    dispatch(switchTab(key));
  };
  return (
    <Card
      loading={image.isLoading}
      style={{ width: "100%" }}
      activeTabKey={image.cardTab}
      tabList={image.imageDetails.availableFeatures}
      onTabChange={onTabChange}
      title={
        <Cascader
          loading={image.isLoading}
          style={{
            width: "auto",
          }}
          options={image.panoramaImages}
          onChange={onChange}
          placeholder="Please select an image"
          defaultValue={image.panoramaImages[0].value}
        />
      }
    >
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <ImageBoundingBox />
        </Col>
        <Col xs={24} sm={12}>
          <AnalyticsInsightPanel />
        </Col>
      </Row>
    </Card>
  );
};

export default Analytics;
