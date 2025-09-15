import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ComplaintForm from "./components/ComplaintForm";
import Profile from "./components/Profile";
import AadhaarVerification from "./components/AadhaarVerification";
import { FaBars } from "react-icons/fa";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case "file-complaint":
        return <ComplaintForm />;
      case "profile":
        return <Profile setCurrentPage={setCurrentPage} />;
      case "aadhaar-verify":
        return <AadhaarVerification setCurrentPage={setCurrentPage} />;
      case "track-status":
      case "info-hub":
      case "community":
      default:
        return (
          <div className="p-10 text-center text-gray-700 text-lg font-semibold">
            Page under construction
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-col flex-1">
        <div className="navbar bg-white shadow-sm px-4 sm:hidden border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Toggle sidebar"
          >
            <FaBars className="text-xl" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-3">CivicSecure</h1>
        </div>

        <main className="flex-grow overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
}

export default App;
