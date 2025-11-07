"use client";
import Footer from "@/components/footer";
import { Admin, NotificationType } from "@/types/types";
import {
  BellFilled,
  DatabaseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { DatePicker, Input, notification } from "antd";
import Link from "next/link";
import React from "react";
const LoginAdmin = () => {
  // useState for admin login
  const [admin, setAdmin] = React.useState<Admin>({
    _id: "",
    email: "",
    password: "",
  });

  // Get token from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type: NotificationType, message: string) => {
    api[type]({
      message: "Notification",
      description: message,
    });
  };

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!admin.email || !admin.password) {
      openNotification("error", "Please fill in all fields.");
      return;
    }
    if (!admin.email?.includes("@")) {
      openNotification("error", "Please enter a valid email address.");
      return;
    }
    if (admin.password && admin.password.length < 6) {
      openNotification("error", "Password must be at least 6 characters long.");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(admin),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Login successful") {
          openNotification("success", "Login successful!");
          localStorage.setItem("adminToken", data.token);
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else {
          openNotification("error", data.message || "Login failed.");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        openNotification("error", "An error occurred. Please try again.");
      });
  };

  // if (!token) {
  //   openNotification("warning", "You are already logged in.");
  // }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex justify-between items-center py-6 border-b border-gray-200 px-6">
        {/* Title */}
        <div>
          <p className="text-gray-500 text-sm">
            Dashboard <span className="text-gray-400">{">"}</span>{" "}
            <strong className="text-gray-800">Login</strong>
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
          <button className="relative h-10 w-20 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center cursor-pointer">
            <BellFilled className="text-gray-600 text-lg" />
            <span className="absolute top-1 right-1 inline-block w-3 h-3 bg-red-600 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      <div className="bg-white text-white flex flex-col justify-center items-center">
        {contextHolder}
        <div className="flex flex-row border justify-center items-center rounded-lg shadow-lg mx-4">
          <div className="text-center px-8 py-39 bg-gradient-to-r from-[#61058bff] via-[#6c3d8bff] to-[#bd6cecff] rounded-l-lg hidden md:block">
            <h1 className="text-3xl font-bold mb-2 text-white tracking-wide">
              Admin Login
            </h1>
            <p className="text-white">
              Welcome back to our Todo List Management System
            </p>
          </div>

          {/* Form Container */}
          <div className="p-8 rounded-lg w-full max-w-md bg-white backdrop-blur-md">
            <h2
              className="text-2xl font-semibold text-center mb-6 
             bg-gradient-to-r from-[#61058bff] via-[#9c56caff] to-[#bd6cecff] 
             bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
            >
              Login to Your Account
            </h2>
            {/* Form Login */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={admin.email}
                onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-md bg-white border text-gray-800 
               focus:outline-none focus:ring-2 focus:ring-[#9c56caff]"
              />

              <input
                type="password"
                placeholder="Password"
                value={admin.password}
                className="w-full px-4 py-2 rounded-md bg-white border text-gray-800 
               focus:outline-none focus:ring-2 focus:ring-[#9c56caff]"
                onChange={(e) =>
                  setAdmin({ ...admin, password: e.target.value })
                }
                required
              />
              <div className="text-right">
                <Link
                  href="/login_admin/forgot_password"
                  className="text-sm text-center    
             bg-gradient-to-r from-[#61058bff] via-[#9c56caff] to-[#bd6cecff] 
             bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] hover:underline"
                >
                  Forgot Password ?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full py-2 mt-2 rounded-md bg-gradient-to-r from-[#61058bff] via-[#9c56caff] to-[#bd6cecff] text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Login
              </button>
              <div className="text-center text-gray-400 mt-4">
                <span>{`Don't have an account?`} </span>
                <Link
                  href="/register_admin"
                  className="bg-gradient-to-r from-[#61058bff] via-[#9c56caff] to-[#bd6cecff] 
                   bg-clip-text text-transparent hover:underline"
                >
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default LoginAdmin;
