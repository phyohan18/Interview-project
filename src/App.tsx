import { TableOutlined, PieChartOutlined } from "@ant-design/icons";
import { Tabs, Layout } from "antd";

const { Content, Footer } = Layout;

import ImageTable from "./components/ImageTable";
import ImageAnalytics from "./components/ImageAnalytics";

const App = () => {
  return (
    <Layout className="layout">
      <Content className="content">
        <h2 className="header">Dashboard</h2>
        <div className="tabs-container">
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
                children: <ImageTable/>,
              },
              {
                label: (
                  <span>
                    <PieChartOutlined />
                    Analytics
                  </span>
                ),
                key: "2",
                children: <ImageAnalytics/>,
              },
            ]}
          />
        </div>
      </Content>
      <Footer className="footer">
        Panorama Viewer ©{new Date().getFullYear()} Created by Phyo Pyae Sone
        Han
      </Footer>
    </Layout>
  );
};

export default App;
