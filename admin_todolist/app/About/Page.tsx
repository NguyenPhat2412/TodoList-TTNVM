import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    document.title = "About - Admin Todo List";
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-400 mb-2">
          About the Admin Dashboard
        </h1>
        <p className="text-gray-400">
          Manage tasks efficiently and keep your workflow organized.
        </p>
      </div>

      {/* Card Section */}
      <div className="max-w-3xl w-full bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-blue-300 mb-4">
          Project Overview
        </h2>
        <p className="text-gray-300 leading-relaxed">
          The{" "}
          <span className="font-semibold text-blue-400">Admin Todo List </span>
          is a management interface designed to help administrators handle daily
          tasks, monitor user progress, and streamline operations through a
          simple yet powerful dashboard.
        </p>

        <div className="mt-6 border-t border-gray-700 pt-6">
          <h3 className="text-xl font-semibold text-blue-300 mb-2">
            Key Features
          </h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Real-time task management</li>
            <li>Role-based access control</li>
            <li>Responsive admin interface using Tailwind CSS</li>
            <li>Analytics dashboard and performance insights</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-500 text-sm">
        © {new Date().getFullYear()} Admin Todo List. All rights reserved.
      </footer>
    </div>
  );
};

export default About;
