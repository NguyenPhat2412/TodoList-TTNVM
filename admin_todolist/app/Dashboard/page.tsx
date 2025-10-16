"use client";

import {
  BellFilled,
  DatabaseOutlined,
  FundOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { DatePicker, Input } from "antd";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

const DashboardPage = () => {
  return (
    <div className="flex-grow min-h-screen bg-gray-50 flex flex-col px-6">
      {/* Header */}
      <div className="flex justify-between items-center py-6 border-b border-gray-200">
        {/* Title */}
        <div>
          <p className="text-gray-500 text-sm">
            Dashboard <span className="text-gray-400">{">"}</span>{" "}
            <strong className="text-gray-800">Home</strong>
          </p>
          <h1 className="text-2xl font-semibold text-gray-800 mt-1">
            Welcome Back 👋
          </h1>
        </div>

        {/* Right side icons */}
        <div className="flex space-x-4 items-center">
          {/* Search */}
          <Input
            placeholder="Search..."
            size="large"
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-56 border-gray-300 rounded-lg focus:border-blue-500 focus:shadow-sm"
          />

          <div>
            {/* Calendar */}
            <DatePicker
              size="large"
              className="w-56 rounded-lg border-gray-300 hover:border-blue-500 transition-all"
              suffixIcon={<DatabaseOutlined className="text-gray-500" />}
            />
          </div>
          {/* Notification */}
          <button className="relative h-10 w-20 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center">
            <BellFilled className="text-gray-600 text-lg" />
            <span className="absolute top-1 right-1 inline-block w-3 h-3 bg-red-600 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Overview */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Overview</h2>

        <div className="grid grid-cols-4 gap-6">
          {/* Chart 1 */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4">
            <h3 className="text-gray-700 font-medium mb-2">Visitors</h3>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="pv"
                  stroke="#3b82f6"
                  fill="#bfdbfe"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2 */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4">
            <h3 className="text-gray-700 font-medium mb-2">Revenue</h3>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke="#10b981"
                  fill="#a7f3d0"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 3 */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4">
            <h3 className="text-gray-700 font-medium mb-2">Traffic</h3>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amt"
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
            <button className="self-start px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all">
              Get insights →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
