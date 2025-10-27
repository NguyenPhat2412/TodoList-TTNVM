"use client";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ListUser from "./user/page";
import DashboardPage from "./Dashboard/page";
import Feedback from "./Feedback/page";
import Setting from "./setting/page";
import About from "./About/Page";
import { io } from "socket.io-client";
import { notification } from "antd";
import { NotificationType } from "@/types/types";
import { data } from "framer-motion/m";

const Home = () => {
  const [activeLink, setActiveLink] = useState<string>("/");
  const [adminData, setAdminData] = useState<any>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);

  const socketRef = useRef<any>(null);

  // Notification
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (type: NotificationType, message: string) => {
    api[type]({
      message: "Notification",
      description: message,
    });
  };

  const checkToken = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/login_admin";
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
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
    fetchAdminData();
  }, []);

  // set up socket connection with useEffect vs useRef to persist socket instance
  useEffect(() => {
    if (!adminData?._id) return;
    const socketSetup = io(`${process.env.NEXT_PUBLIC_API_DATABASE}`, {
      transports: ["websocket"],
    });

    socketRef.current = socketSetup;

    socketSetup.on("connect", () => {
      console.log("Socket connected:", socketSetup.id);
      if (adminData?._id) {
        socketSetup.emit("register", { userId: adminData._id });
      }
    });

    // socketSetup.emit("register", { userId: adminData?._id });

    // socketSetup.emit("disconnectUser", { userId: adminData?._id });

    socketSetup.on("users_status", ({ status, userId }) => {
      setUsers((prev) => ({
        ...prev,
        [userId]: status,
      }));

      fetch(
        `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/users/status/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ status }),
        }
      ).catch((err) => console.error("Failed to update user status", err));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [adminData]);

  return (
    <>
      {contextHolder}
      <div className="min-h-screen relative flex ">
        <div className="fixed">
          <Navbar activeLink={activeLink} setActiveLink={setActiveLink} />
        </div>

        <div className="flex-grow ml-64">
          {activeLink === "/" && <DashboardPage />}
          {activeLink === "/user" && <ListUser />}
          {activeLink === "/Feedback" && <Feedback />}
          {activeLink === "/setting" && <Setting />}
          {activeLink === "/About" && <About />}
        </div>
        <div className="absolute bottom-0 w-full">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
