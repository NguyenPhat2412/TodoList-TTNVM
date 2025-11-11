"use client";
import { DatePicker, Input, notification } from "antd";
import { useState } from "react";
import { NotificationType } from "@/types/types";
import Loading from "@/components/Loading";
import {
  BellFilled,
  DatabaseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Footer from "@/components/footer";
import NavbarDashboard from "@/components/navbarDashboard";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hiddenOtp, setHiddenOtp] = useState(true);
  const [otp, setOtp] = useState("");

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (type: NotificationType, message: string) => {
    api[type]({
      message: "Notification",
      description: message,
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      setMessage(data.message);
      setHiddenOtp(false);
      openNotification("info", data.message);
    } catch (error) {
      openNotification("error", "An error occurred");
      setMessage("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
      const data = await response.json();
      setMessage(data.message);
      if (data.message === "OTP verified successfully") {
        openNotification(
          "success",
          "OTP verified. You can reset your password."
        );
        window.location.href = `/login_admin/reset_password?email=${encodeURIComponent(
          email
        )}&otp=${encodeURIComponent(otp)}`;
      } else {
        openNotification("error", data.message || "OTP verification failed.");
      }
    } catch (error) {
      openNotification("error", "An error occurred");
      setMessage("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--background)] text-[var(--text-dashboard)]">
      {contextHolder}
      <div className="flex justify-between items-center py-6 border-b border-gray-200 px-6">
        {/* Title */}
        <div>
          <p className="text-[var(--text-dashboard)] text-sm">
            Dashboard <span className="text-gray-400">{">"}</span>{" "}
            <strong className="text-[var(--text-dashboard)]">
              Forgot Password
            </strong>
          </p>
          <h1 className="text-2xl font-semibold text-[var(--text-dashboard)] mt-1">
            {hiddenOtp ? "Forgot Password 👋" : "Verify OTP 👋"}
          </h1>
        </div>

        <NavbarDashboard />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md mx-auto mt-10">
          {hiddenOtp && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Forgot Password
              </h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Enter your email address
                  </label>
                  <input
                    type="email"
                    required
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 mt-4 rounded-md bg-gradient-to-r from-[#61058bff] via-[#9c56caff] to-[#bd6cecff]  text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Send Reset Link
                </button>
              </form>
            </>
          )}

          {!hiddenOtp && (
            <div className="mt-4 text-center text-black-600">
              <form className="space-y-4 mt-4" onSubmit={handleVerifyOtp}>
                <label className="block text-xl font-medium text-gray-700">
                  Enter OTP
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white-500 text-gray-800"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full py-2 mt-4 rounded-md bg-gradient-to-r from-[#61058bff] via-[#9c56caff] to-[#bd6cecff]  text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Verify OTP
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
};

export default ForgotPassword;
