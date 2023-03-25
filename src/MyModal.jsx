import { Modal,Tabs } from "antd";
import { EyeOutlined,InfoCircleOutlined } from "@ant-design/icons";
import Canvas from "./Canvas";
import ImgInfo from "./ImgInfo";

const MyModal = ({ visible, onCancel, curImg }) => {
  const items = [
    {
      key: "1",
      label: (
        <span>
          <EyeOutlined />
          360&#176;
        </span>
      ),
      children: <Canvas curImg={curImg} />,
    },
    {
      key: "2",
      label: (
        <span>
          <InfoCircleOutlined />
          Info
        </span>
      ),
      children: <ImgInfo/>,
    }
  ];

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      width="80%"
      centered
      footer={null}
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Modal>
  );
};

export default MyModal;
