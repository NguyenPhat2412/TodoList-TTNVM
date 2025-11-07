import React from "react";
import { SearchUser } from "@/types/types";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
const ComponentSearchUser = ({ SearchUser }: { SearchUser: SearchUser }) => {
  const { searchTerm, setSearchTerm } = SearchUser;
  return (
    <div className="mb-4 w-1/5">
      <Input
        type="text"
        placeholder="Search users..."
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default ComponentSearchUser;
