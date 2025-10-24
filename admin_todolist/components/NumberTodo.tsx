import { useEffect, useState } from "react";

const UserTodoCell = ({ userId }: { userId: string }) => {
  const [todoCount, setTodoCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchTodoCount = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/tasks/user/stats/${userId}`,
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
        setTodoCount(data.taskCount);
      } catch (error) {
        console.error("Failed to fetch todo count:", error);
      }
    };
    fetchTodoCount();
  }, [userId]);
  return <div>{todoCount !== null ? todoCount : "Loading..."}</div>;
};

export default UserTodoCell;
