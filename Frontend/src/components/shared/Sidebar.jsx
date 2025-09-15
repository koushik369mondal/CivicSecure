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
  { id: "profile", label: "Profile", icon: FaUser }
];

export default function Sidebar({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, onLogout }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 text-slate-800 dark:text-gray-200 flex flex-col transition-transform ease-in-out duration-300 z-40 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
      aria-label="Sidebar"
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">CivicSecure</h1>
        <p className="text-slate-600 dark:text-gray-400 text-sm">Citizen Grievance Hub</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setCurrentPage(id);
              if (sidebarOpen) setSidebarOpen(false);
            }}
            className={`w-full flex items-center py-2.5 px-3 rounded-lg font-medium text-sm transition-colors duration-200 ${
              currentPage === id
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400"
            }`}
            aria-current={currentPage === id ? "page" : undefined}
          >
            <Icon
              className={`text-base mr-3 ${
                currentPage === id 
                  ? "text-white" 
                  : "text-slate-600 dark:text-gray-400"
              }`}
            />
            <span>{label}</span>
          </button>
        ))}

        {/* Logout Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-gray-800">
          <button
            onClick={() => {
              if (sidebarOpen) setSidebarOpen(false);
              if (onLogout) onLogout();
            }}
            className="w-full flex items-center py-2.5 px-3 rounded-lg font-medium text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
          >
            <FaSignOutAlt className="text-base mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-200 dark:border-gray-800 text-xs text-slate-500 dark:text-gray-400">
        <p>Version 1.0.0</p>
      </div>
    </aside>
  );
}