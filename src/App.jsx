import { TableOutlined, PieChartOutlined } from "@ant-design/icons";
import { Tabs, Layout } from "antd";
const { Content, Footer } = Layout;

import ImageTable from "./components/ImageTable";
import Analytics from "./components/Analytics";

const App = () => {
  return (
    <Layout style={{ height: "100%" }}>
      <Content style={{ padding: "0 50px" }}>
        <h2 style={{ margin: "16px 0" }}>Dashboard</h2>
        <div style={{ padding: 24, minHeight: 380, background: "#FFFFFF" }}>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                label: (
                  <span>
                    <TableOutlined />
                    Table
                  </span>
                ),
                key: "1",
                children: <ImageTable />,
              },
              {
                label: (
                  <span>
                    <PieChartOutlined />
                    Analytics
                  </span>
                ),
                key: "2",
                children: <Analytics />,
              },
            ]}
          />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Panorama Viewer ©{new Date().getFullYear()} Created by Phyo Pyae Sone
        Han
      </Footer>
    </Layout>
  );
};

export default App;
