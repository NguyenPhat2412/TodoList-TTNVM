"use client";

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckSquareOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { TreeNode } from "@/types/types";

const ProductTree = () => {
  // Dữ liệu cây sản phẩm
  const treeData: TreeNode[] = [
    {
      label: "Website",
      children: [
        { label: " Home", color: "text-black", hover: "hover:bg-gray-300" },
        { label: " Pricing", color: "text-black", hover: "hover:bg-gray-300" },
        {
          label: " About us",
          color: "text-black",
          hover: "hover:bg-gray-300",
        },
        {
          label: "Blog",
          children: [
            {
              label: " Announcements",
              color: "text-black",
              hover: "hover:bg-gray-300",
            },
            {
              label: " April lookahead",
              color: "text-black",
              hover: "hover:bg-gray-300",
            },
            {
              label: " What's new",
              color: "text-black",
              hover: "hover:bg-gray-300",
            },
            {
              label: " Meet the team",
              color: "text-black",
              hover: "hover:bg-gray-300",
            },
          ],
        },
      ],
    },
    {
      label: "Store",
      children: [
        {
          label: " All products",
          color: "text-black",
          hover: "hover:bg-gray-300",
        },
        {
          label: " Categories",
          children: [
            {
              label: " Gadgets",
              color: "text-black",
              hover: "hover:bg-gray-300",
            },
            {
              label: " Phones",
              color: "text-black",
              hover: "hover:bg-gray-300",
            },
            {
              label: " Wearables",
              color: "text-black",
              hover: "hover:bg-gray-300",
            },
          ],
        },
        {
          label: " Bestsellers",
          color: "text-black",
          hover: "hover:bg-gray-300",
        },
        { label: " Sales", color: "text-black", hover: "hover:bg-gray-300" },
      ],
    },
    { label: "Contact", color: "text-black", hover: "hover:bg-gray-300" },
    { label: "Help", color: "text-black", hover: "hover:bg-gray-300" },
    {
      label: "settings",
      color: "text-black",
      hover: "hover:bg-gray-300",
    },
  ];

  // Trạng thái mở/đóng của các nhánh
  const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (label: string) => {
    setOpenNodes((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Lấy chữ cái đầu tiên trong label con
  const getFirstLetter = (label: string) => {
    return label.charAt(0);
  };

  // Component đệ quy để hiển thị cây
  const renderNode = (node: TreeNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isOpen = openNodes[node.label];

    const dotColor = depth >= 2 ? "text-green-500 mr-2" : "text-blue-500 mr-2";
    return (
      <li key={node.label} className="ml-4">
        <div
          className={`flex items-center cursor-pointer rounded-md px-2 py-1 animate
            ${node.color || "text-black"} ${node.hover || "hover:bg-gray-300"}
          `}
          onClick={() => hasChildren && toggleNode(node.label)}
        >
          {hasChildren && (
            <>
              <AnimatePresence>
                {isOpen ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <ArrowDownOutlined className="w-4 h-4 mr-1 text-gray-400" />
                  </motion.div>
                ) : (
                  <ArrowUpOutlined className="w-4 h-4 mr-1 text-gray-400" />
                )}
              </AnimatePresence>
            </>
          )}
          {!hasChildren && <span className={dotColor}>• </span>}
          <span>{node.label}</span>
        </div>
        <AnimatePresence>
          {hasChildren && isOpen && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="ml-4 border-l border-gray-700 pl-3"
            >
              {node.children!.map((child) => renderNode(child, depth + 1))}
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    );
  };

  return (
    <div className="p-6 bg-white rounded-xl text-white w-full max-w-sm border border-gray-800 shadow-lg">
      <h2 className="text-xl font-semibold mb-3 text-blue-400">Product tree</h2>
      <ul className="space-y-1">{treeData.map((node) => renderNode(node))}</ul>
    </div>
  );
};

export default ProductTree;
