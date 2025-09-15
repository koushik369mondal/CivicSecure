import React from "react";
import { FaExclamationTriangle, FaCheckCircle, FaClock, FaEye, FaPlus, FaMoon, FaSun } from "react-icons/fa";
import Layout from "./shared/Layout";

function Dashboard({ toggleTheme, theme, setCurrentPage }) {
  const stats = [
    { label: "Total Complaints", value: "24", icon: FaExclamationTriangle, color: "text-emerald-600" },
    { label: "Resolved", value: "18", icon: FaCheckCircle, color: "text-emerald-700" },
    { label: "Pending", value: "6", icon: FaClock, color: "text-amber-500" },
    { label: "In Review", value: "3", icon: FaEye, color: "text-blue-600" }
  ];

  const recentComplaints = [
    { id: "CMP-2024-001", category: "Safety", status: "Pending", date: "2025-09-12" },
    { id: "CMP-2024-002", category: "Civic", status: "Resolved", date: "2025-09-11" },
    { id: "CMP-2024-003", category: "Disaster", status: "In Review", date: "2025-09-10" }
  ];

  return (
    <Layout>
      <div className="space-y-8 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-gray-100 mb-2">Dashboard</h1>
            <p className="text-emerald-700 dark:text-emerald-400 text-base">Welcome back! Here's your complaint overview</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm btn-md flex items-center gap-2"
              onClick={() => setCurrentPage("file-complaint")}
            >
              <FaPlus />
              New Complaint
            </button>
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="btn btn-outline border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 dark:border-gray-600 dark:hover:border-emerald-400 dark:hover:bg-emerald-900/20 btn-square"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <FaMoon className="text-slate-600" /> : <FaSun className="text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {stats.map(({ label, value, icon: Icon, color }, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100">{value}</h3>
                  <p className="text-slate-600 dark:text-gray-400 font-medium text-sm">{label}</p>
                </div>
                <Icon className={`${color} text-3xl`} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Complaints */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-100 mb-4">Recent Complaints</h2>
            <div className="divide-y divide-slate-200 dark:divide-gray-700">
              {recentComplaints.map(({ id, category, status, date }) => (
                <div key={id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-gray-100">{id}</p>
                    <p className="text-sm text-slate-600 dark:text-gray-400">{category}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`badge ${
                        status === "Resolved"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                          : status === "Pending"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                      } border-none`}
                    >
                      {status}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">{date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button className="btn btn-outline border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-900/20">
                View All
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
