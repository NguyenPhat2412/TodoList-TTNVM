"use client";
import { Admin, NotificationType } from "@/types/types";
import { notification } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const AdminRegistrationPage: React.FC = () => {
  // useState
  const [admin, setAdmin] = React.useState<Admin>({
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
      name: "",
      email: "",
      password: "",
      currentPassword: "",
      phone: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white px-4">
      {contextHolder}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-blue-400 tracking-wide">
          Admin Registration
        </h1>
        <p className="text-gray-300">
          Welcome to our Todo List Management System
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-gray-800/70 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-400">
          Create an Account
        </h2>

        {/* Form Register */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Full Name"
            type="text"
            value={admin.name}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
            required
          />
          <input
            placeholder="Phone Number"
            type="text"
            value={admin.phone}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setAdmin({ ...admin, phone: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={admin.email}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
            required
          />
          <input
            placeholder="New Password"
            type="password"
            value={admin.password}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
            required
          />
          <input
            placeholder="Current Password"
            type="password"
            value={admin.currentPassword}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) =>
              setAdmin({ ...admin, currentPassword: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="w-full py-2 mt-4 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/login_admin" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};
export default AdminRegistrationPage;
