import React from "react";
import { Descriptions, Divider } from "antd";
import moment from "moment-timezone";
const ImgInfo = ({ data }) => {
  const dateFormat = (date, region) => {
    return moment(date).tz(region).format("MMMM Do YYYY h:mm:ss a");
  };
  return (
    <>
      <Descriptions title="Description">
        <Descriptions.Item label="Title">
          {data.fileName ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Subject">
          {data.ImageDescription ?? "-"}
        </Descriptions.Item>
      </Descriptions>
      <Divider orientation="left" orientationMargin={3}>
        Origin
      </Divider>
      <Descriptions>
        <Descriptions.Item label="Authors">
          {data.Artist ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Date Taken">
          {dateFormat(data.ModifyDate, "Asia/Singapore") ?? "-"} SGT
        </Descriptions.Item>
        <Descriptions.Item label="Program name">
          {data.Software ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Copyright">
          {data.Copyright ?? "-"}
        </Descriptions.Item>
      </Descriptions>
      <Divider orientation="left" orientationMargin={3}>
        File
      </Divider>
      <Descriptions>
        <Descriptions.Item label="Item type">
          {data.fileType ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Orientation">
          {data.Orientation ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Dimensions">
          {data.dimensions ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Width">{data.width ?? "-"}</Descriptions.Item>
        <Descriptions.Item label="Height">
          {data.height ?? "-"}
        </Descriptions.Item>
      </Descriptions>
      <Divider orientation="left" orientationMargin={3}>
        Camera
      </Divider>
      <Descriptions>
        <Descriptions.Item label="Camera maker">
          {data.Make ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Camera model">
          {data.Model ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Flash mode">
          {data.Flash ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="DPI">
          {data.XResolution ?? "-"} dpi
        </Descriptions.Item>
        <Descriptions.Item label="FocalLength">
          {data.FocalLength ? data.FocalLength + " mm" : "-"}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default React.memo(ImgInfo);
