import React from "react";
import { Descriptions, Divider } from "antd";
import moment from "moment-timezone";

const ImageInfo = ({ imageData }: any) => {
  // Function to format data with timezone
  const formatDate = (date: any, region: string) => {
    return moment(date).tz(region).format("MMMM Do YYYY h:mm:ss a");
  };
  return (
    <>
      {/* Descriptions for title and subject */}
      <Descriptions title="Description">
        <Descriptions.Item label="Title">
          {imageData.fileName ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Subject">
          {imageData.ImageDescription ?? "-"}
        </Descriptions.Item>
      </Descriptions>

      {/* Divider and descriptions for origin */}
      <Divider orientation="left" orientationMargin={3}>
        Origin
      </Divider>
      <Descriptions>
        <Descriptions.Item label="Authors">
          {imageData.Artist ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Date Taken">
          {formatDate(imageData.ModifyDate, "Asia/Singapore") ?? "-"} SGT
        </Descriptions.Item>
        <Descriptions.Item label="Program name">
          {imageData.Software ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Copyright">
          {imageData.Copyright ?? "-"}
        </Descriptions.Item>
      </Descriptions>

      {/* Divider and descriptions for file */}
      <Divider orientation="left" orientationMargin={3}>
        File
      </Divider>
      <Descriptions>
        <Descriptions.Item label="Item type">
          {imageData.fileType ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Orientation">
          {imageData.Orientation ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Dimensions">
          {imageData.dimensions ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Width">
          {imageData.width ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Height">
          {imageData.height ?? "-"}
        </Descriptions.Item>
      </Descriptions>

      {/* Divider and descriptions for camera */}
      <Divider orientation="left" orientationMargin={3}>
        Camera
      </Divider>
      <Descriptions>
        <Descriptions.Item label="Camera maker">
          {imageData.Make ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Camera model">
          {imageData.Model ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Flash mode">
          {imageData.Flash ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="DPI">
          {imageData.XResolution ?? "-"} dpi
        </Descriptions.Item>
        <Descriptions.Item label="FocalLength">
          {imageData.FocalLength ? imageData.FocalLength + " mm" : "-"}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default React.memo(ImageInfo);
