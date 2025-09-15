import React from "react";
import {
  FaHome,
  FaFileAlt,
  FaChartBar,
  FaInfoCircle,
  FaComments,
  FaIdCard,
  FaUser,
  FaSignOutAlt,
  FaShieldAlt
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

  // Enhanced logout function that clears all data
  const handleLogout = () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm(
      "Are you sure you want to logout? This will clear all your saved data including profile information and Aadhaar verification."
    );

    if (confirmLogout) {
      try {
        // Clear all specific application data
        const keysToRemove = [
          'userProfile',           // Profile data
          'aadhaarVerification',   // Aadhaar verification data
          'complaintDraft',        // Any draft complaints
          'userPreferences',       // User preferences if any
          'sessionData',           // Session data if any
          'tempData'              // Any temporary data
        ];

        // Remove specific keys first (more controlled approach)
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });

        // Alternative: Clear all localStorage (more aggressive approach)
        // Uncomment the line below if you want to clear ALL localStorage data
        // localStorage.clear();

        // Also clear sessionStorage if you're using it
        sessionStorage.clear();

        // Close sidebar if open
        if (sidebarOpen) setSidebarOpen(false);

        // Reset to dashboard page
        if (setCurrentPage) {
          setCurrentPage("dashboard");
        }

        // Call parent logout handler if provided
        if (onLogout) {
          onLogout();
        }

        // Optional: Show success message
        alert("Successfully logged out! All data has been cleared.");

        // Optional: Redirect to login page or refresh the page
        // window.location.reload(); // Uncomment if you want to refresh the page
        // window.location.href = '/login'; // Uncomment if you have a login route

      } catch (error) {
        console.error('Error during logout:', error);
        alert("An error occurred during logout. Please try again.");
      }
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ease-in-out duration-300 bg-white border-r border-gray-200 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      aria-label="Sidebar"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-600 text-white rounded-lg">
            <FaShieldAlt className="text-lg" />
          </div>
          <h1 className="text-xl font-bold text-emerald-600">CivicSecure</h1>
        </div>
        <p className="text-gray-600 text-sm ml-11">Citizen Grievance Hub</p>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-4 py-6">
        <nav>
          <ul className="space-y-3">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => {
                    setCurrentPage(id);
                    if (sidebarOpen) setSidebarOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 group ${currentPage === id
                      ? "bg-emerald-600 text-white shadow-md transform scale-105"
                      : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:transform hover:scale-102"
                    }`}
                  aria-current={currentPage === id ? "page" : undefined}
                >
                  <Icon
                    className={`text-lg mr-4 transition-colors duration-200 ${currentPage === id
                        ? "text-white"
                        : "text-gray-600 group-hover:text-emerald-600"
                      }`}
                  />
                  <span className="text-sm font-medium">{label}</span>
                  {currentPage === id && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="px-4 pb-4">
        {/* Enhanced Logout Button with confirmation */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 border-2 border-red-200 hover:border-red-300 mb-4 group"
        >
          <FaSignOutAlt className="text-lg mr-4 group-hover:animate-pulse" />
          <span className="text-sm font-medium">Logout</span>
        </button>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500 mb-1">Version 1.0.0</p>
          <p className="text-xs text-gray-400">© 2025 CivicSecure</p>
        </div>
      </div>
    </aside>
  );
}
