import { useState } from "react";
import { useEffect } from "react";

const Information = () => {
  const [info, setInfo] = useState("");
  const TOKEN = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/info`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": TOKEN,
          },
        }
      );
      const data = await response.json();
      if (TOKEN) setInfo(data);
    };
    fetchData();
  }, []);

  if (!TOKEN) {
    return (
      <div className="absolute top-8 left-1/2 -translate-x-1/2   text-2xl font-bold">
        Please log in to the admin page 🥰
      </div>
    );
  }

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2   text-2xl font-bold">
      Welcome {info.username}! to the admin page
    </div>
  );
};

export default Information;
