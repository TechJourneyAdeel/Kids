import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // --- LOGIN CHECK ---
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    const loginTime = localStorage.getItem("loginTime");
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours

    if (!admin || !loginTime || Date.now() - loginTime > oneDay) {
      localStorage.removeItem("admin");
      localStorage.removeItem("loginTime");
      navigate("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  // If not logged in → do NOT show app layout
  if (!isLoggedIn) return null;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}
