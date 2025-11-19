import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Header from "./components/Header";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

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

  if (!isLoggedIn) return null;

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
