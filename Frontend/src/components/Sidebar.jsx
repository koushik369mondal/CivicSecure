import React from "react";
import { 
  FaHome, 
  FaFileAlt, 
  FaChartBar, 
  FaInfoCircle, 
  FaComments, 
  FaIdCard,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: FaHome },
  { id: "file-complaint", label: "File Complaint", icon: FaFileAlt },
  { id: "track-status", label: "Track Status", icon: FaChartBar },
  { id: "info-hub", label: "Info Hub", icon: FaInfoCircle },
  { id: "community", label: "Community", icon: FaComments },
  { id: "aadhaar-verify", label: "Aadhaar Verify", icon: FaIdCard },
  { id: "profile", label: "Profile", icon: FaUser } // Added profile back to menuItems
];

export default function Sidebar({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, onLogout }) {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ease-in-out duration-300 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0`}
      aria-label="Sidebar"
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-1">CivicSecure</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Citizen Grievance Hub</p>
      </div>

      {/* Menu Items */}
      <div className="px-3 py-3 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                onClick={() => {
                  setCurrentPage(id);
                  if (sidebarOpen) setSidebarOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                  currentPage === id
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-800 dark:hover:text-green-400"
                }`}
                aria-current={currentPage === id ? "page" : undefined}
              >
                <Icon
                  className={`text-lg mr-3 ${
                    currentPage === id 
                      ? "text-white" 
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                />
                <span className="text-sm font-medium">{label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className="mt-8 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              if (sidebarOpen) setSidebarOpen(false);
              if (onLogout) onLogout();
            }}
            className="flex items-center w-full px-3 py-2.5 rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
          >
            <FaSignOutAlt className="text-lg mr-3" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Version 1.0.0
        </p>
      </div>
    </aside>
  );
}
