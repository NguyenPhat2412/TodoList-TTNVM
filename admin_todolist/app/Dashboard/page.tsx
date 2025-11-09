"use client";

import Details from "@/components/details";
import Overview from "@/components/overiews";
import ProductTree from "@/components/productTree";
import { NotificationType } from "@/types/types";
import {
  BellFilled,
  DatabaseOutlined,
  FundOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { DatePicker, Input, notification } from "antd";
import { useEffect } from "react";
const DashboardPage = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type: NotificationType, message: string) => {
    api[type]({
      message: "Notification",
      description: message,
      placement: "topRight",
    });
  };

  const handleNotificationClick = () => {
    openNotification("info", "Notification feature is coming soon!");
  };

  return (
    <div className="flex-grow min-h-screen bg-gray-50 flex flex-col px-6">
      {contextHolder}
      {/* Header */}

      <div className="flex justify-between items-center py-6 border-b border-gray-200">
        {/* Title */}
        <div>
          <p className="text-gray-500 text-sm">
            Dashboard <span className="text-gray-400">{">"}</span>{" "}
            <strong className="text-gray-800">Home</strong>
          </p>
          <h1 className="text-2xl font-semibold text-gray-800 mt-1">
            Welcome Back 👋
          </h1>
        </div>

        {/* Right side icons */}
        <div className="flex space-x-4 items-center">
          {/* Search */}
          <Input
            placeholder="Search..."
            size="large"
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-56 border-gray-300 rounded-lg focus:border-blue-500 focus:shadow-sm"
          />

          <div>
            {/* Calendar */}
            <DatePicker
              size="large"
              className="w-56 rounded-lg border-gray-300 hover:border-blue-500 transition-all"
              suffixIcon={<DatabaseOutlined className="text-gray-500" />}
            />
          </div>
          {/* Notification */}
          <button
            className="relative h-10 w-20 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center cursor-pointer"
            onClick={handleNotificationClick}
          >
            <BellFilled className="text-gray-600 text-lg" />
            <span className="absolute top-1 right-1 inline-block w-3 h-3 bg-red-600 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Overview */}
      <Overview />

      <div className="mb-20 flex space-x-6">
        <div className="w-3/4">
          <Details />
        </div>
        <div className="w-1/4 mt-18 ">
          <ProductTree />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
