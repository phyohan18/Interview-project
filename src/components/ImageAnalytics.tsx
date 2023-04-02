import { useEffect } from "react";
import { Card, Cascader, Row, Col } from "antd";
import { fetchImageDetails, switchTab } from "../features/imageSlice.js";
import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { imageState } from "../lib/store.js";
import ImageBoundingBox from "./layouts/analytics/ImageBoundingBox";
import AnalyticsInsightPanel from "./layouts/analytics/AnalyticsInsightPanel";

const ImageAnalytics = () => {
  // Getting image data from redux store
  const image = useSelector(imageState);

  const dispatch = useDispatch<Dispatch<any>>();

  // Fetching image details from server on mount
  useEffect(() => {
    dispatch(fetchImageDetails(image.panoramaImages[0].value));
  }, []);

  // Cascader onChange event handler to fetch image details for selected image
  const onChange = (_: any, selectedOptions: any) => {
    const imageUrl = selectedOptions.map((o: any) => o.value).join(", ");
    dispatch(fetchImageDetails(imageUrl));
  };

  // Tab change event handler to switch between available image features
  const onTabChange = (key: string) => {
    dispatch(switchTab(key));
  };
  
  return (
    <Card
      loading={image.isLoading}
      style={{ width: "100%" }}
      activeTabKey={image.activeTab}
      tabList={image.imageAvailableFeatures}
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

export default ImageAnalytics;
