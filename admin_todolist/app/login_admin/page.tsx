"use client";
import { Admin, NotificationType } from "@/types/types";
import { notification } from "antd";
import Link from "next/link";
import React from "react";
const LoginAdmin = () => {
  // useState for admin login
  const [admin, setAdmin] = React.useState<Admin>({
    email: "",
    password: "",
  });

  // Get token from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
          localStorage.setItem("token", data.token);
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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white px-4">
      {contextHolder}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-blue-400 tracking-wide">
          Admin Login
        </h1>
        <p className="text-gray-300">
          Welcome back to our Todo List Management System
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-gray-800/70 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-400">
          Login to Your Account
        </h2>

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={admin.email}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={admin.password}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="w-full py-2 mt-4 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
          <div className="mt-4 text-center text-gray-400">
            <span>{`Don't have an account?`} </span>
            <Link
              href="/register_admin"
              className="text-blue-400 hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
