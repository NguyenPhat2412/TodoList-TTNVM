import { useEffect, useState } from "react";

const NumberCompletedTodo = ({ userId }: { userId: string }) => {
  const [numberCompleted, setNumberCompleted] = useState<number | null>(null);

  useEffect(() => {
    const fetchNumberCompleted = async () => {
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
        setNumberCompleted(data.completedTaskCount);
      } catch (error) {
        console.error("Failed to fetch number of completed todos:", error);
      }
    };
    fetchNumberCompleted();
  }, []);
  return <div>{numberCompleted !== null ? numberCompleted : "Loading..."}</div>;
};
export default NumberCompletedTodo;
