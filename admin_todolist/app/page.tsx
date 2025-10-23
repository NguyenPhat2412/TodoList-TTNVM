"use client";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import ListUser from "./user/page";
import DashboardPage from "./Dashboard/page";
import Feedback from "./Feedback/page";
import Setting from "./setting/page";
import About from "./About/Page";

const Home = () => {
  const [activeLink, setActiveLink] = useState<string>("/");

  return (
    <>
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
