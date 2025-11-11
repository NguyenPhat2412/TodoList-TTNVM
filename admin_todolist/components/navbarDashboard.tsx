import { DatabaseOutlined, SearchOutlined } from "@ant-design/icons";
import { DatePicker, Input, notification } from "antd";
import { Bell } from "lucide-react";
import DarkModeToggle from "./btnDarkMode";

const NavbarDashboard = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.info({
      message: `Notification`,
      description: "Notification feature is coming soon!",
      placement: "topRight",
    });
  };

  const handleNotificationClick = () => {
    alert("Notification feature is coming soon!");
  };

  return (
    <div className="flex space-x-4 items-center">
      {contextHolder}
      {/* Search */}

      {/* <Input
        placeholder="Search..."
        size="large"
        prefix={<SearchOutlined className="text-[var(--text-color)]" />}
        className="w-56 bg-[var(--background)] rounded-lg focus:border-blue-500 focus:shadow-sm"
      />

   
      <div>
        <DatePicker
          size="large"
          className="w-56 rounded-lg border-gray-300 hover:border-blue-500 transition-all"
          suffixIcon={<DatabaseOutlined className="text-gray-500" />}
        />
      </div> */}
      {/* Notification */}
      <button
        className="relative h-10 w-20 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md hover:scale-110 transition-all flex items-center justify-center cursor-pointer"
        onClick={handleNotificationClick}
      >
        <Bell className="text-gray-600 text-lg" />
        <span className="absolute top-1 right-1 inline-block w-3 h-3 bg-red-600 rounded-full border-2 border-white"></span>
      </button>

      {/* Chỉnh màu sắc giao diện web trắng đen */}
      <div>
        <DarkModeToggle />
      </div>
    </div>
  );
};
export default NavbarDashboard;
