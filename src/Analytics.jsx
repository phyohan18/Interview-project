import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Cascader, Row, Col } from "antd";
import LabelDetect from "./LabelDetect";
import ObjectDetect from "./ObjectDetect";
import ColorDetect from "./ColorDetect";
import LandmarkDetect from "./LandmarkDetect";
import LogoDetect from "./LogoDetect";
import FaceDetect from "./FaceDetect";
import ImageCanvas from "./ImageCanavs";

const allTabList = [
  {
    key: "1",
    tab: "Landmarks",
    feature: "landmarkAnnotations",
  },
  {
    key: "2",
    tab: "Objects",
    feature: "localizedObjectAnnotations",
  },
  {
    key: "3",
    tab: "Faces",
    feature: "faceAnnotations",
  },
  {
    key: "4",
    tab: "Labels",
    feature: "labelAnnotations",
  },
  {
    key: "5",
    tab: "Colors",
    feature: "imagePropertiesAnnotation",
  },
  {
    key: "6",
    tab: "Logo",
    feature: "logoAnnotations",
  },
];

const apiKey = "AIzaSyD-fxP3MVBZnFGdpRiebKHwf65QSPvkbbc";
const requestUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const sanityClient = createClient({
  projectId: "0u3qo37j",
  dataset: "production",
  apiVersion: "v1",
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);
const urlFor = (source) => builder.image(source);

const Analytics = () => {
  const [activeTabKey, setActiveTabKey] = useState("1");
  const [showBoundingPoly, setShowBoundingPoly] = useState({
    status: false,
    boundingPoly: null,
  });
  const [allImages, setAllImages] = useState([]);
  const [tabList, setTabList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageAnalyticsData, setImageAnalyticsData] = useState(null);
  const [curImage, setCurImage] = useState(
    "https://cdn.sanity.io/images/0u3qo37j/production/1f7759a642de14d887b9321ebcb2590edbb2b20d-6276x3138.jpg"
  );

  const contentList = {
    1: <LandmarkDetect data={imageAnalyticsData} />,
    2: <ObjectDetect data={imageAnalyticsData} />,
    3: <FaceDetect data={imageAnalyticsData} />,
    4: <LabelDetect data={imageAnalyticsData} />,
    5: <ColorDetect data={imageAnalyticsData} />,
    6: <LogoDetect data={imageAnalyticsData} />,
  };

  useEffect(() => {
    const fetchData = async () => {
      const query = `*[_type == 'images']{
        _id,
        title,
        image {
          "url": asset->url
        }
      }|order(_createdAt asc)`;
      const result = await sanityClient.fetch(query);
      const images = result.map((item) => {
        return {
          value: item.image.url,
          label: item.title + ".jpg",
        };
      });
      setAllImages(images);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const requestData = {
      requests: [
        {
          image: {
            source: {
              imageUri: curImage,
            },
          },
          features: [
            {
              type: "LABEL_DETECTION",
              maxResults: 70,
            },
            {
              type: "FACE_DETECTION",
              maxResults: 70,
            },
            {
              type: "LANDMARK_DETECTION",
              maxResults: 70,
            },
            {
              type: "LOGO_DETECTION",
              maxResults: 70,
            },
            {
              type: "IMAGE_PROPERTIES",
            },
            {
              type: "OBJECT_LOCALIZATION",
              maxResults: 70,
            },
          ],
        },
      ],
    };

    axios
      .post(requestUrl, requestData)
      .then((response) => {
        const data = response.data.responses[0];
        const availableTabs = allTabList.filter((tab) => data[tab.feature]);
        setImageAnalyticsData(data);
        setTabList(availableTabs);
        setActiveTabKey(availableTabs[0].key);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [curImage]);

  useEffect(() => {
    const featureName = allTabList[activeTabKey - 1]["feature"];
    if (featureName == "localizedObjectAnnotations") {
      setShowBoundingPoly({
        status: true,
        boundingPoly: featureName,
      });
    } else {
      setShowBoundingPoly({
        status: false,
        boundingPoly: "",
      });
    }
  }, [activeTabKey]);

  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  const onChange = (_, selectedOptions) => {
    setCurImage(selectedOptions.map((o) => o.value).join(", "));
  };

  return (
    <Card
      loading={loading}
      style={{ width: "100%" }}
      tabList={tabList}
      onTabChange={onTabChange}
      title={
        <Cascader
          loading={loading}
          style={{
            width: "auto",
          }}
          options={allImages}
          onChange={onChange}
          placeholder="Please select an image"
          defaultValue="Bridge.jpg"
        />
      }
    >
      <Row gutter={[8, 8]}>
        {imageAnalyticsData && curImage && (
          <>
            <Col xs={24} sm={12}>
              <ImageCanvas
                imageSrc={urlFor(curImage).height(400).format("webp").url()}
                imageData={imageAnalyticsData}
                boundingPolyData={showBoundingPoly}
              />
            </Col>
            <Col xs={24} sm={12}>
              {contentList[activeTabKey]}
            </Col>
          </>
        )}
      </Row>
    </Card>
  );
};

export default Analytics;
