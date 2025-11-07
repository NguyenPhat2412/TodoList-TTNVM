"use client";
import { notification } from "antd";
import { useState } from "react";
import { NotificationType } from "@/types/types";
import Loading from "@/components/Loading";
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
      console.log({ email, otp });
      if (data.message === "OTP verified successfully") {
        openNotification(
          "success",
          "OTP verified. You can reset your password."
        );
        window.location.href = `/login_admin/reset_password?email=${encodeURIComponent(
          email
        )}`;
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {contextHolder}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {hiddenOtp && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
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
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 mt-4 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Send Reset Link
              </button>
            </form>
          </>
        )}
        {!hiddenOtp && (
          <div className="mt-4 text-center text-green-600">
            <form className="space-y-4 mt-4" onSubmit={handleVerifyOtp}>
              <label className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-2 mt-4 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Verify OTP
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
