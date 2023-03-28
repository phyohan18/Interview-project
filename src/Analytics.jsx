import axios from "axios";
import { useEffect } from "react";
// import { HeatMap } from '@ant-design/maps';

const Analytics = () => {
  useEffect(() => {
    const imageUrl =
      "https://cdn.sanity.io/images/0u3qo37j/production/a7d21f271a9e0726cf60babb7d7349078c455d26-5376x2688.jpg";
    const apiKey = "AIzaSyD-fxP3MVBZnFGdpRiebKHwf65QSPvkbbc";
    const requestUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    const requestData = {
      requests: [
        {
          image: {
            source: {
              imageUri: imageUrl,
            },
          },
          features: [
            {
              type: "LABEL_DETECTION",
              maxResults: 70,
            },
            {
              type: "TEXT_DETECTION",
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
        console.log(response.data.responses[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return <div>Analytics</div>;
};

export default Analytics;
