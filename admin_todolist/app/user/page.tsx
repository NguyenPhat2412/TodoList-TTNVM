"use client";
import { Flex, notification } from "antd";
import { Admin, NotificationType, SearchUser } from "@/types/types";
import React, { useEffect } from "react";
import PaginationComponent from "@/components/pagination";
import Loading from "@/components/Loading";
import ModalConfirmDelete from "@/components/ModalConfirmDelete";
import ComponentSearchUser from "@/components/SearchUser";

const ListUser: React.FC = () => {
  const [dataUser, setDataUser] = React.useState<Admin[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(8);
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = React.useState<string>("");
  const [selectedUserName, setSelectedUserName] = React.useState<string>("");

  // Search User State
  const [searchTerm, setSearchTerm] =
    React.useState<SearchUser["searchTerm"]>("");
  const [filteredUsers, setFilteredUsers] = React.useState<Admin[]>([]);

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = dataUser.filter(
      (user) =>
        (user.name && user.name.toLowerCase().includes(lowercasedTerm)) ||
        (user.email && user.email.toLowerCase().includes(lowercasedTerm)) ||
        (user.phone && user.phone.toLowerCase().includes(lowercasedTerm))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, dataUser]);

  // Notification
  const openNotification = (type: NotificationType, message: string) => {
    api?.[type]?.({
      message: "Notification",
      description: message,
    });
  };

  // Fetch User Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/users`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setDataUser(data);
    } catch (error) {
      openNotification("error", "Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "User List - Admin Todo List";
    fetchData();
  }, []);

  // Handle Delete User
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/delete-users/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      setDataUser((prev) => prev.filter((user) => user._id !== id));
      openNotification("success", "User deleted successfully!");
    } catch (error) {
      openNotification("error", "Failed to delete user.");
      console.error("Delete operation error:", error);
    } finally {
      setIsOpen(false);
    }
  };

  // Handle Open Modal
  const handleOpenModal = (id: string, name: string) => {
    setSelectedUserId(id);
    setSelectedUserName(name);
    setIsOpen(true);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  if (loading) return <Loading />;

  return (
    <div className="flex-grow min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 p-8 relative">
      {contextHolder}

      {/* Modal Confirm Delete */}
      <ModalConfirmDelete
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => handleDelete(selectedUserId)}
        itemType="user"
        itemName={selectedUserName}
      />

      <div className="flex mb-8 flex-row items-center gap-1 border-b border-gray-300 pb-4">
        <p className="text-gray-600 mb-6 text-sm">{`Dashboard > `}</p>
        <p className="text-sm font-bold mb-6">{`User List`}</p>
      </div>
      {/* List User */}
      <div className="mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-700">User List</h1>
          <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-all">
            User TodoList
          </button>
        </div>
        <ComponentSearchUser SearchUser={{ searchTerm, setSearchTerm }} />
        {filteredUsers.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-lg">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300 text-left text-sm font-semibold text-gray-700 uppercase">
                  <th className="py-3 px-4">STT</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Role</th>
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
                      {startIndex + index + 1}
                    </td>
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.phone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>
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
                        onClick={() =>
                          handleOpenModal(user._id, user.name || "Unknown")
                        }
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

export default ListUser;
