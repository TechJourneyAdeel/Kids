import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import ProductTabs from "../components/ProductTabs";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("loginTime");
    navigate("/login");
  };

  const handleAddItem = () => {
    navigate("/upload-items");
  };

  return (
    <>
      <Banner onAddItem={handleAddItem} />
      <ProductTabs/>
    </>
  );
}
