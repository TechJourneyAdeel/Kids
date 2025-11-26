// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dasboard from "./components/dasboard";
import ProductList from "./components/ProductList";
import SalesReport from "./components/salesReport";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<App />}>
        <Route index element={<Dasboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/reports" element={<SalesReport />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
