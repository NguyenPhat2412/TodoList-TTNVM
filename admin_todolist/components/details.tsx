"use client";
import { Flex, notification, Pagination, Spin } from "antd";
import { Admin, NotificationType } from "@/types/types";
import React, { useEffect } from "react";
import PaginationComponent from "@/components/pagination";
import { LoadingOutlined } from "@ant-design/icons";
import UserTodoCell from "./NumberTodo";
import NumberCompletedTodo from "./NumberCompletedTodo";

const Details: React.FC = () => {
  const [dataUser, setDataUser] = React.useState<Admin[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(9);
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [numberTasks, setNumberTasks] = React.useState<number>(0);

  // Notification
  const openNotification = (type: NotificationType, message: string) => {
    api?.[type]?.({
      message: "Notification",
      description: message,
    });
  };

  // Handle Delete User
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/delete-users/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      openNotification("success", "User deleted successfully.");
      setDataUser(dataUser.filter((user) => user._id !== id));
    } catch (error) {
      openNotification("error", "Failed to delete user.");
      console.error("There was a problem with the delete operation:", error);
    }
  };

  // Fetch User Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const filteredData = data.filter(
          (user: Admin) => user.role !== "admin"
        );
        setDataUser(filteredData);
        setLoading(true);
      } catch (error) {
        openNotification("error", "Failed to fetch user data.");
      } finally {
        setLoading(true);
      }
    };
    fetchData();
  }, []);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentUsers = dataUser.slice(startIndex, endIndex);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  if (!loading) {
    return (
      <Flex justify="center" align="center" className="min-h-screen">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} />} />
      </Flex>
    );
  }
  return (
    <div className="flex-grow mt-5 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      {contextHolder}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-700">Users</h1>
      </div>
      <div className=" bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        {dataUser.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-lg">Users</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300 text-left text-sm font-semibold text-gray-700 uppercase">
                  <th className="py-3 px-4">STT</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Number Tasks</th>
                  <th className="py-3 px-4">Completed Tasks</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 border-b border-gray-200 transition"
                  >
                    <td className="py-3 px-4 font-medium text-gray-600">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      {<UserTodoCell userId={user._id} />}
                    </td>
                    <td className="py-3 px-4">
                      {<NumberCompletedTodo userId={user._id} />}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.status === "online"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status === "online" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        className="text-white font-medium py-1 px-2 rounded transition-colors bg-red-400 hover:bg-red-800"
                        onClick={() => handleDelete(user._id!)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <PaginationComponent
          total={dataUser.length}
          itemsPerPage={pageSize}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Details;
