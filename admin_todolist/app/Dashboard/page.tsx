"use client";

import DarkModeToggle from "@/components/btnDarkMode";
import Details from "@/components/details";
import NavbarDashboard from "@/components/navbarDashboard";
import Overview from "@/components/overiews";
import ProductTree from "@/components/productTree";
import { NotificationType } from "@/types/types";
import {
  BellFilled,
  DatabaseOutlined,
  FundOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, DatePicker, Input, notification } from "antd";
import { Bell } from "lucide-react";
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
    <div className="flex-grow min-h-screen bg-[var(--background)] flex flex-col px-6">
      {contextHolder}
      {/* Header */}

      <div className="flex justify-between items-center py-6 border-b border-gray-200">
        {/* Title */}
        <div>
          <p className="text-[var(--text-color)] text-sm">
            Dashboard <span className="text-gray-400">{">"}</span>{" "}
            <strong className="text-[var(--text-dashboard)]">Home</strong>
          </p>
          <h1 className="text-2xl font-semibold text-[var(--text-dashboard)] mt-1">
            Welcome Back 👋
          </h1>
        </div>

        <NavbarDashboard />
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
