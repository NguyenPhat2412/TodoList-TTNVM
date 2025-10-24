export interface Admin {
  _id: string;
  name?: string;
  email: string;
  password: string;
  currentPassword?: string;
  phone?: string;
  role?: string;
  active?: boolean;
}

export type NotificationType = "success" | "info" | "warning" | "error";

export interface NavbarProps {
  activeLink: string;
  setActiveLink: (link: string) => void;
}

export interface PaginationComponentProps {
  total: number;
  itemsPerPage: number;
  onChange?: (page: number, pageSize: number) => void;
}

export type TreeNode = {
  label: string;
  children?: TreeNode[];
  color?: string;
  hover?: string;
};

export interface ContactFormData {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}
