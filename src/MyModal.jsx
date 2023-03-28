import { Modal } from "antd";
import Tab from "./Tab";
import React,{useEffect} from "react";
const MyModal = ({ visible, onCancel, curImg , activeTab}) => {

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      width="80%"
      centered
      footer={null}
    >
      <Tab curImg={curImg} activeTab={activeTab} />
    </Modal>
  );
};

export default React.memo(MyModal);
