"use client";
import Footer from "@/components/footer";
import Loading from "@/components/Loading";
import { NotificationType } from "@/types/types";
import {
  BellFilled,
  DatabaseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { DatePicker, Input, notification } from "antd";
import { nav } from "framer-motion/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const email = searchParams.get("email") || "";
  const navigation = useRouter();

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (type: NotificationType, message: string) => {
    api[type]({
      message: "Notification",
      description: message,
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      openNotification("error", "Passwords do not match");
      return;
    }

    const resetPassword = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/reset-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, newPassword, confirmPassword }),
          }
        );
        const data = await response.json();
        if (data.message === "Password reset successfully") {
          openNotification("success", "Password reset successfully");
          navigation.push("/login_admin");
          setLoading(false);
        } else {
          openNotification("error", "Password reset failed");
        }
      } catch (error) {
        openNotification("error", "An error occurred");
      }
    };
    resetPassword();
  };
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      {contextHolder}
      <div className="flex justify-between items-center py-6 border-b border-gray-200 px-6">
        {/* Title */}
        <div>
          <p className="text-gray-500 text-sm">
            Dashboard <span className="text-gray-400">{">"}</span>{" "}
            <strong className="text-gray-800">Forgot Password</strong>
          </p>
          <h1 className="text-2xl font-semibold text-gray-800 mt-1">
            Reset Password
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

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loading />
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Reset Password
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-4 rounded-md bg-gradient-to-r from-[#61058bff] via-[#9c56caff] to-[#bd6cecff]  text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Reset Password
            </button>
          </form>
        </div>
      )}

      <div>
        <Footer />
      </div>
    </div>
  );
};
export default ResetPasswordPage;
