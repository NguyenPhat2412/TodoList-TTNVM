import React from "react";
import type { PaginationProps } from "antd";
import { Pagination } from "antd";
import { PaginationComponentProps } from "@/types/types";

const onChange: PaginationProps["onChange"] = (pageNumber) => {
  console.log("Page: ", pageNumber);
};

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  total,
  itemsPerPage,
  onChange,
}) => (
  <>
    <Pagination
      showQuickJumper
      defaultCurrent={1}
      total={total}
      pageSize={itemsPerPage}
      onChange={onChange}
      className="!text-[var(--foreground)] [&_.ant-pagination-item-active]:!border-[var(--foreground)] [&_.ant-pagination-item-active]:!text-[var(--foreground)] [&_.ant-pagination-item:hover]:!border-[var(--foreground)] [&_.ant-pagination-item:hover]:!text-[var(--foreground)]"
    />
  </>
);

export default PaginationComponent;
