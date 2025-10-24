"use client";

import { Input, notification, Upload, Button, Spin } from "antd";
import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Admin, NotificationType } from "@/types/types";
import Loading from "@/components/Loading";

const Setting = () => {
  // State management
  const [adminData, setAdminData] = React.useState<Admin | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string>("");

  // Notification
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type: NotificationType, message: string) => {
    api[type]({
      message: "Notification",
      description: message,
      placement: "topRight",
    });
  };

  // Fetch admin data
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/users/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch admin data");

      const data = await response.json();
      setAdminData(data);
      if (data.avatar) setAvatarPreview(data.avatar);
    } catch (error) {
      openNotification("error", "Cannot fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  // Upload Avatar
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/users/upload-avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Upload failed");

      openNotification("success", "Avatar uploaded successfully!");
      fetchAdminData();
    } catch (error) {
      openNotification("error", "Failed to upload avatar");
    }
  };

  // Update admin info
  const handleUpdateAdminData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminData) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/users/${adminData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify(adminData),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      const updated = await response.json();
      setAdminData(updated);
      openNotification("success", "Profile updated successfully!");
    } catch (error) {
      openNotification("error", "Error updating profile");
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentPassword = (
      document.getElementById("currentPassword") as HTMLInputElement
    ).value;
    const newPassword = (
      document.getElementById("newPassword") as HTMLInputElement
    ).value;
    const confirmPassword = (
      document.getElementById("confirmPassword") as HTMLInputElement
    ).value;

    if (newPassword !== confirmPassword) {
      openNotification("error", "New passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/users/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      if (!response.ok) throw new Error("Failed to update password");

      openNotification("success", "Password updated successfully!");
    } catch (error) {
      openNotification("error", "Error updating password");
    }
  };

  React.useEffect(() => {
    fetchAdminData();
    document.title = "Settings - Admin Todo List";
  }, []);

  if (loading) return <Loading />;

  if (!adminData)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <p className="">You need to be logged in to access this page.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-6 flex justify-center">
      {contextHolder}
      <div className="w-full max-w-8xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-10">
        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your profile, account information, and security.
          </p>
        </div>

        {/* Avatar Upload */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Profile Picture
          </h2>
          <div className="flex items-center space-x-4">
            <div className="w-30 h-30 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <img
                src={avatarPreview || "https://via.placeholder.com/100"}
                alt="Avatar Preview"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col space-y-3">
              <Input
                type="file"
                id="avatar"
                name="avatar"
                onChange={handleAvatarChange}
                className=""
              />
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={handleUploadAvatar}
                className="mt-2"
                disabled={!avatarFile}
              >
                Upload
              </Button>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-10 md:space-y-0">
          {/* Personal Information */}
          <form onSubmit={handleUpdateAdminData} className="flex-1 space-y-5">
            <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b border-gray-200 pb-2">
              Personal Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                value={adminData.name}
                onChange={(e) =>
                  setAdminData({ ...adminData, name: e.target.value })
                }
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                value={adminData.email}
                onChange={(e) =>
                  setAdminData({ ...adminData, email: e.target.value })
                }
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input.Password
                value={adminData.password}
                onChange={(e) =>
                  setAdminData({ ...adminData, password: e.target.value })
                }
                disabled
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Save Changes
            </Button>
          </form>

          {/* Change Password */}
          <form onSubmit={handleChangePassword} className="flex-1 space-y-5">
            <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b border-gray-200 pb-2">
              Change Password
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <Input.Password id="currentPassword" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <Input.Password id="newPassword" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <Input.Password id="confirmPassword" />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setting;
