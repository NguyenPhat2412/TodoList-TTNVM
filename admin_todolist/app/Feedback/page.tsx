"use client";

import { Input, notification } from "antd";
import React, { useEffect } from "react";
import { ContactFormData, NotificationType } from "@/types/types";
import Loading from "@/components/Loading";

const Feedback = () => {
  const [formData, setFormData] = React.useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = React.useState<boolean>(false);

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type: NotificationType, message: string) => {
    api[type]({
      message: "Notification",
      description: message,
      placement: "topRight",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/contact`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        if (response.ok) {
          openNotification(
            "success",
            "Your message has been sent successfully!"
          );
        } else {
          openNotification("error", "An error occurred. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        openNotification("error", "An error occurred. Please try again.");
      } finally {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    };

    submitData();
  };

  useEffect(() => {
    document.title = "Feedback - Admin Todo List";
    setLoading(true);
  }, []);

  if (!loading) {
    return <Loading />;
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {contextHolder}

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-2 text-gray-800 text-center">
          Contact for <span className="text-blue-600 font-bold">Support</span>
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          If you need assistance, please reach out to our support team.
          <br />
          Provide your email address and a brief description of your issue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name:
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email:
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject:
            </label>
            <Input
              id="subject"
              name="subject"
              type="text"
              required
              value={formData.subject}
              onChange={handleChange}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter subject"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message:
            </label>
            <Input.TextArea
              id="message"
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your issue..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-all duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
