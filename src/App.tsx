import { Typography } from "antd";
import { WorkbenchPage } from "./pages/WorkbenchPage";

function App() {
  return (
    <>
      <Typography.Title level={3} style={{ margin: "16px 24px 0" }}>
        Takeoff V1 - 参数化管沟/管井算量
      </Typography.Title>
      <WorkbenchPage />
    </>
  );
}

export default App;
