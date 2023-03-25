import { Descriptions, Divider } from "antd";

const ImgInfo = () => {
  return (
    <>
      <Descriptions title="Description" >
        <Descriptions.Item label="Title">Zhou Maomao</Descriptions.Item>
        <Descriptions.Item label="Subject">1810000000</Descriptions.Item>
        <Descriptions.Item label="Tags">Hangzhou, Zhejiang</Descriptions.Item>
      </Descriptions>
      <Divider orientation="left" orientationMargin={3}>
        Origin
      </Divider>
      <Descriptions>
        <Descriptions.Item label="Authors">empty</Descriptions.Item>
        <Descriptions.Item label="Date Taken">empty</Descriptions.Item>
        <Descriptions.Item label="Program name">empty</Descriptions.Item>
        <Descriptions.Item label="Date acquired">empty</Descriptions.Item>
        <Descriptions.Item label="Copyright">empty</Descriptions.Item>
      </Descriptions>
      <Divider orientation="left" orientationMargin={3}>
        File
      </Divider>
      <Descriptions>
      <Descriptions.Item label="Name">Zhou Maomao</Descriptions.Item>
        <Descriptions.Item label="Item type">1810000000</Descriptions.Item>
        <Descriptions.Item label="Size">Hangzhou, Zhejiang</Descriptions.Item>
        <Descriptions.Item label="Dimensions">empty</Descriptions.Item>
        <Descriptions.Item label="Width">empty</Descriptions.Item>
        <Descriptions.Item label="Height">empty</Descriptions.Item>
      </Descriptions>
      <Divider orientation="left" orientationMargin={3}>
        Camera
      </Divider>
      <Descriptions>
        <Descriptions.Item label="Camera maker">Zhou Maomao</Descriptions.Item>
        <Descriptions.Item label="Camera model">1810000000</Descriptions.Item>
        <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default ImgInfo;
