import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "./icons/DashboardIcon";
import ProductIcon from "./icons/ProductIcon";
import ReportIcon from "./icons/ReportIcon";
import LogoutIcon from "./icons/LogoutIcon";

const NavLink = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { id: "products", label: "Products", icon: <ProductIcon />, path: "/products" },
    { id: "reports", label: "Sales Reports", icon: <ReportIcon />, path: "/reports" },
  ];

  // 🔥 Logout Handler
const handleLogout = () => {
  // Clear localStorage
  localStorage.removeItem('admin');
  localStorage.removeItem('loginTime');

  // Navigate to login page
  navigate("/login");
};


  return (
    <aside className="w-64 flex-shrink-0 bg-white shadow-lg h-screen p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-800 ml-3">TT - TOYS</h1>
      </div>

      <nav className="flex-1 space-y-2 max-h-fit">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

      {/* 🔥 Logout Button */}
      <button
        onClick={handleLogout}
        className="flex space-y-2 mt-2 mb-3 px-3 py-3 text-left font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-all duration-200"
      >
        <LogoutIcon/>
        <span class="ml-3">Logout</span>
      </button>

      <div className="mt-auto text-center text-xs text-gray-400">
        <p>&copy; 2025 - 2026 TT-Toys Store.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
