"use client";
import Link from "next/link";
import React from "react";
import { NavbarProps } from "@/types/types";
import {
  AccountBookOutlined,
  DashboardFilled,
  DashOutlined,
  ExclamationCircleFilled,
  HomeOutlined,
  LogoutOutlined,
  QuestionCircleFilled,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

const Navbar: React.FC<NavbarProps> = ({ activeLink, setActiveLink }) => {
  return (
    <div className="nav navbar w-64 h-screen bg-gray-100 p-6 flex flex-col">
      <div className="dashboard logo text-4xl font-bold text-gray-500 mb-6 flex items-center p-3">
        <h1>Dashboard</h1>
      </div>

      <div className="space-y-1 mt-6 relative flex flex-col h-full">
        <div className="ml-4 flex flex-col g-2 pb-2">
          <div
            onClick={() => setActiveLink("/")}
            className={`main-list block py-2 px-3 rounded flex cursor-pointer ${
              activeLink === "/" ? "bg-gray-300" : ""
            }`}
          >
            <HomeOutlined className="mr-2" />
            <p>Home</p>
          </div>
        </div>

        <div className="flex flex-col g-2 pb-2">
          <div
            className={`ml-4 main-list block py-2 px-3 rounded flex cursor-pointer ${
              activeLink === "/user" ? "bg-gray-300" : ""
            }`}
            onClick={() => setActiveLink("/user")}
          >
            <UserOutlined className="mr-2" />
            <p>User</p>
          </div>
        </div>

        {/* Logout xuống dưới cùng */}
        <div className="w-full ml-2 flex flex-col g-2 pb-2 mt-auto absolute bottom-10">
          <div className="flex flex-col g-2 pb-2">
            <div
              className={`ml-4 main-list block py-2 px-3 rounded flex cursor-pointer ${
                activeLink === "/about" ? "bg-gray-300" : ""
              }`}
              onClick={() => setActiveLink("/about")}
            >
              <ExclamationCircleFilled className="mr-2" />
              <p>About</p>
            </div>
          </div>
          <div className="flex flex-col g-2 pb-2">
            <div
              className={`ml-4 main-list block py-2 px-3 rounded flex cursor-pointer ${
                activeLink === "/feedback" ? "bg-gray-300" : ""
              }`}
              onClick={() => setActiveLink("/feedback")}
            >
              <QuestionCircleFilled className="mr-2" />
              <p>Feedback</p>
            </div>
          </div>

          <div className="flex flex-col g-2 pb-2">
            <div
              className={`ml-4 main-list block py-2 px-3 rounded flex cursor-pointer ${
                activeLink === "/setting" ? "bg-gray-300" : ""
              }`}
              onClick={() => setActiveLink("/setting")}
            >
              <SettingOutlined className="mr-2" />
              <p>Setting</p>
            </div>
          </div>

          <Link
            href="/login_admin"
            className="ml-4 main-list block py-2 px-4 rounded flex bg-red-500 text-white hover:bg-red-800 transition-colors"
          >
            <LogoutOutlined className="mr-2" />
            <p>Logout</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
