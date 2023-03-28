import Canvas from "./Canvas";
import ImgInfo from "./ImgInfo";
import { EyeOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import React, { useState, useEffect } from "react";

const Tab = ({ curImg, activeTab }) => {
  const [curTab, setCurTab] = useState(activeTab);

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
      children: <ImgInfo />,
    },
  ];

  useEffect(() => {
    setCurTab(activeTab);
  }, [activeTab]);

  const changeTab = () => {
    if (curTab == "1") {
      setCurTab("2");
    } else {
      setCurTab("1");
    }
  };

  return (
    <Tabs onTabClick={() => changeTab()} activeKey={curTab} items={items} />
  );
};

export default Tab;
