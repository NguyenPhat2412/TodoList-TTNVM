import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import React from "react";

const Loading: React.FC = () => {
  return (
    <Flex justify="center" align="center" className="min-h-screen">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} />} />
    </Flex>
  );
};
export default Loading;
