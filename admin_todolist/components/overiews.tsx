import { FundOutlined } from "@ant-design/icons";
import { number } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ExportCSVButton from "./ExportCSVButton";
import { Admin } from "@/types/types";

// const data = [
//   { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
//   { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
//   { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
//   { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
//   { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
//   { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
//   { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
// ];
const Overview: React.FC = () => {
  // Declare State
  const [numberTasksByUserOnDate, setNumberTasksByUserOnDate] = useState<
    { date: string; count: number }[]
  >([]);

  const [
    numberCompletedTasksByUserOnDate,
    setNumberCompletedTasksByUserOnDate,
  ] = useState<{ date: string; count: number }[]>([]);

  const [numberUsersOnDate, setNumberUsersOnDate] = useState<
    { date: string; count: number }[]
  >([]);

  const [allUsers, setAllUsers] = useState<Admin[]>([]);

  // use Promise.all
  // get all users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const usersResult = await usersResponse.json();
        setAllUsers(usersResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Cleanup or final actions if needed
      }
    };
    fetchData();
  }, []);

  // Fetch Number of Tasks Created by Users on Date
  useEffect(() => {
    const fetchData = async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 6);

      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/users/stats?start=${start}&end=${end}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        console.log("Fetched data:", result);

        // Dữ liệu có 7 ngày liên tiếp
        const allDays: {
          date: string;
          count: number;
          completedCount: number;
        }[] = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date(startDate);
          d.setDate(startDate.getDate() + i);
          const dateStr = d.toISOString().split("T")[0];
          const found = result.find(
            (item: { date: string; count: number }) => item.date === dateStr
          );
          allDays.push({
            date: dateStr,
            count: found ? found.count : 0,
            completedCount: found ? found.completedCount : 0,
          });

          // Completed Tasks
          const foundCompleted = result.find(
            (item: { date: string; completedCount: number }) =>
              item.date === dateStr
          );
          setNumberCompletedTasksByUserOnDate((prev) => [
            ...prev,
            {
              date: dateStr,
              count: foundCompleted ? foundCompleted.completedCount : 0,
              completedCount: foundCompleted
                ? foundCompleted.completedCount
                : 0,
            },
          ]);
        }
        setNumberTasksByUserOnDate(allDays);
        console.log("Processed data for chart:", allDays);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Cleanup or final actions if needed
      }
    };
    fetchData();
  }, []);

  // Fetch Number Created Users on Date
  useEffect(() => {
    const fetchData = async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 6);

      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DATABASE}/api/admin/users/number?start=${start}&end=${end}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        // console.log("Fetched data:", result);
        // Dữ liệu có 7 ngày liên tiếp
        const allDays: {
          date: string;
          count: number;
        }[] = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date(startDate);
          d.setDate(startDate.getDate() + i);
          const dateStr = d.toISOString().split("T")[0];
          const found = result.find(
            (item: { date: string; count: number }) => item.date === dateStr
          );
          allDays.push({
            date: dateStr,
            count: found ? found.count : 0,
          });
        }
        setNumberUsersOnDate(allDays);
        console.log("Processed data for chart:", allDays);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Cleanup or final actions if needed
      }
    };
    fetchData();
  }, []);

  // Custom Axis Tick Renderer
  const CustomXAxisTick = ({ x, y, payload }: any) => {
    const date = new Date(payload.value);

    return (
      <g transform={`translate(${x},${y + 10})`}>
        <text
          x={0}
          y={0}
          textAnchor="middle"
          fill="#666"
          fontSize={12}
          fontWeight="bold"
          transform="rotate(-10)"
        >
          {date.getDate()}/{date.getMonth() + 1}
        </text>
      </g>
    );
  };
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Overview</h2>

      <div className="grid grid-cols-4 gap-6">
        {/* Chart 1 */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4">
          <h3 className="text-gray-700 font-medium mb-2">
            Create Task on 7 days
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart
              data={numberTasksByUserOnDate}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <Tooltip />
              <XAxis dataKey="date" tick={<CustomXAxisTick />} />
              <YAxis />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                fill="#bfdbfe"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2 */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4">
          <h3 className="text-gray-700 font-medium mb-2">
            Completed Tasks on 7 days
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart
              data={numberCompletedTasksByUserOnDate}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <Tooltip />
              <XAxis dataKey="date" tick={<CustomXAxisTick />} />
              <YAxis />
              <Area
                type="monotone"
                dataKey="completedCount"
                stroke="#10b981"
                fill="#a7f3d0"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3 */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4">
          <h3 className="text-gray-700 font-medium mb-2">
            Number of Users on 7 days
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart
              data={numberUsersOnDate}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <Tooltip />
              <XAxis dataKey="date" tick={<CustomXAxisTick />} />
              <YAxis />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#1037b9ff"
                fill="#5861b6ff"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Explore Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl shadow-md flex flex-col justify-between p-6">
          <div>
            <FundOutlined />
            <h3 className="text-lg font-semibold mb-2">Explore Your Data</h3>
            <p className="text-sm text-gray-300 mb-4">
              Uncover performance and visitor insights with our data wizardry.
            </p>
          </div>
          <ExportCSVButton data={allUsers} filename="getAllUsers.csv" />
        </div>
      </div>
    </div>
  );
};
export default Overview;
