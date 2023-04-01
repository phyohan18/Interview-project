import PanoramaViewer from "../../PanoramaViewer";
import ImageInfo from "../../ImageInfo";
import { EyeOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const ModalTab = () => {
  // Get the modal state from Redux
  const modal = useSelector((state) => state.modal);

  // Get the active tab and current image from the modal state
  const activeTab = modal.modalTab;
  const currentImage = modal.modalData;

  // Set up state for the current tab
  const [currentTab, setCurrentTab] = useState(activeTab);

  // Set the current tab when the active tab changes
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  // Define the tab items with their labels and content
  const items = [
    {
      key: "1",
      label: (
        <span>
          <EyeOutlined />
          360&#176;
        </span>
      ),
      children: <PanoramaViewer image={currentImage.fileURL} />,
    },
    {
      key: "2",
      label: (
        <span>
          <InfoCircleOutlined />
          Info
        </span>
      ),
      children: <ImageInfo imageData={currentImage} />,
    },
  ];

  // Switch the current tab when the user clicks on a different tab
  const changeTab = () => {
    if (currentTab == "1") {
      setCurrentTab("2");
    } else {
      setCurrentTab("1");
    }
  };

  return (
    <Tabs onTabClick={() => changeTab()} activeKey={currentTab} items={items} />
  );
};

export default ModalTab;
