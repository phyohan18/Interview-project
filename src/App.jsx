import {
  Space,
  Table,
  Tag,
  Tabs,
  Layout,
  theme,
} from "antd";

const { Content, Footer } = Layout;

import { TableOutlined, PieChartOutlined } from "@ant-design/icons";
import PopUp from "./PopUp";

function openInNewTab(url) {
  window.open(url, '_blank').focus();
}

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <PopUp url="/view" >
          View
        </PopUp>
      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Content className="site-layout" style={{ padding: "0 50px" }}>
        <h2 style={{ margin: "16px 0" }}>
          Dashboard
        </h2>
        <div
          style={{ padding: 24, minHeight: 380, background: colorBgContainer }}
        >
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane
              tab={
                <span>
                  <TableOutlined />
                  &nbsp;Table
                </span>
              }
              key="1"
            >
              <Table dataSource={data} columns={columns} />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span>
                  <PieChartOutlined />
                  &nbsp;Analytics
                </span>
              }
              key="2"
            >
              <h1>Hello</h1>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2023 Created by Ant UED
      </Footer>
    </Layout>
  );
}

export default App;
