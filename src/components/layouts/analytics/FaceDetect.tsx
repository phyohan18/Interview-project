import { List} from "antd";
import { getFacialEmotions } from "../../../lib/helpers";

// Define the shape of FaceDetect props
interface FaceDetectProps {
  data: {
    [key: string]: any;
  }[];
}

const FaceDetect = ({ data }: FaceDetectProps) => {
  return (
    <div className="stats-container">
      <List
        dataSource={data}
        renderItem={(item, index) => {
          return (
            <List.Item key={index}>
              <List.Item.Meta
                title={`Face ${index + 1}`}
                description={getFacialEmotions(item)}
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default FaceDetect;
