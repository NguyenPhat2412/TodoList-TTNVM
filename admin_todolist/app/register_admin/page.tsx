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
import { useRouter } from "next/navigation";
import React from "react";

const AdminRegistrationPage: React.FC = () => {
  const handleNotificationClick = () => {
    alert("Notification feature is coming soon!");
  };
  // useState
  const [admin, setAdmin] = React.useState<Admin>({
    _id: "",
    name: "",
    email: "",
    password: "",
    currentPassword: "",
    phone: "",
  });

  const navigate = useRouter();

  // Notification
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

    if (admin.password !== admin.currentPassword) {
      openNotification("error", "Password and Current Password do not match.");
      return;
    }
    if (admin.password && admin.password.length < 6) {
      openNotification("error", "Password must be at least 6 characters long.");
      return;
    }

    if (!admin.phone?.match(/^\d{10,15}$/)) {
      openNotification(
        "error",
        "Phone number must be between 10 to 15 digits."
      );
      return;
    }
    if (!admin.email?.includes("@")) {
      openNotification("error", "Please enter a valid email address.");
      return;
    }
    if (
      !admin.email ||
      !admin.name ||
      !admin.password ||
      !admin.currentPassword ||
      !admin.phone
    ) {
      openNotification("error", "Please fill in all required fields.");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(admin),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Admin registered successfully") {
          openNotification("success", "Registration successful!");

          setTimeout(() => {
            navigate.push("/login_admin");
          }, 1500);

          resetForm();
        } else {
          openNotification(
            "error",
            data.message || "Registration failed. Please try again."
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        openNotification("error", "An error occurred. Please try again.");
      });
  };

  const resetForm = () => {
    // Reset form
    setAdmin({
      _id: "",
      name: "",
      email: "",
      password: "",
      currentPassword: "",
      phone: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {contextHolder}
      <div className="flex justify-between items-center py-6 border-b border-gray-200 px-6">
        {/* Title */}
        <div>
          <p className="text-gray-500 text-sm">
            Dashboard <span className="text-gray-400">{">"}</span>{" "}
            <strong className="text-gray-800">Register</strong>
          </p>
          <h1 className="text-2xl font-semibold text-gray-800 mt-1">
            Sign Up 👋
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

      <div className="bg-white text-white flex flex-col justify-center items-center">
        <div className="flex flex-row border justify-center items-center rounded-lg shadow-lg mx-4">
          <div className="text-center px-8 py-54 bg-gradient-to-r from-[#61058bff] via-[#6c3d8bff] to-[#bd6cecff] rounded-l-lg hidden md:block">
            <h1 className="text-3xl font-bold mb-2 text-white tracking-wide">
              Admin Registration
            </h1>
            <p className="text-white">
              Welcome to our Todo List Management System
            </p>
          </div>

          {/* Form Container */}
          <div className="p-8 rounded-lg w-full max-w-md bg-white backdrop-blur-md">
            <h2
              className="text-2xl font-semibold text-center mb-6 
             bg-gradient-to-r from-[#61058bff] via-[#9c56caff] to-[#bd6cecff] 
             bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
            >
              Create an Account
            </h2>

            {/* Form Register */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Full Name"
                type="text"
                value={admin.name}
                className="w-full px-4 py-2 rounded-md bg-white border text-gray-800 
               focus:outline-none focus:ring-2 focus:ring-[#9c56caff]"
                onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
                required
              />
              <input
                placeholder="Phone Number"
                type="text"
                value={admin.phone}
                className="w-full px-4 py-2 rounded-md bg-white border text-gray-800 
               focus:outline-none focus:ring-2 focus:ring-[#9c56caff]"
                onChange={(e) => setAdmin({ ...admin, phone: e.target.value })}
                required
              />
              <input
                placeholder="Email"
                type="email"
                value={admin.email}
                className="w-full px-4 py-2 rounded-md bg-white border text-gray-800 
               focus:outline-none focus:ring-2 focus:ring-[#9c56caff]"
                onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                required
              />
              <input
                placeholder="New Password"
                type="password"
                value={admin.password}
                className="w-full px-4 py-2 rounded-md bg-white border text-gray-800 
               focus:outline-none focus:ring-2 focus:ring-[#9c56caff]"
                onChange={(e) =>
                  setAdmin({ ...admin, password: e.target.value })
                }
                required
              />
              <input
                placeholder="Current Password"
                type="password"
                value={admin.currentPassword}
                className="w-full px-4 py-2 rounded-md bg-white border text-gray-800 
               focus:outline-none focus:ring-2 focus:ring-[#9c56caff]"
                onChange={(e) =>
                  setAdmin({ ...admin, currentPassword: e.target.value })
                }
                required
              />
              <button
                type="submit"
                className="w-full py-2 mt-2 rounded-md bg-gradient-to-r from-[#61058bff] via-[#9c56caff] to-[#bd6cecff] text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Register
              </button>
            </form>
            <div className="mt-4 text-center text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login_admin"
                className="bg-gradient-to-r from-[#61058bff] via-[#9c56caff] to-[#bd6cecff] 
                   bg-clip-text text-transparent hover:underline"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
};
export default AdminRegistrationPage;
