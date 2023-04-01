import { Modal } from "antd";
import ModalTab from "./ModalTab";
import React from "react";

const PopUpModal = ({ visible, onCancel }) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      width="80%"
      centered
      footer={null}
    >
      <ModalTab />
    </Modal>
  );
};

export default React.memo(PopUpModal);
