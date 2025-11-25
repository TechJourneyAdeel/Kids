import React, { useState, useMemo } from "react";
import Header from "./Header";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SalesReport = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // -------------------------------
  // ✅ Dummy Sales Data
  // -------------------------------
  const sales = [
    { id: 1, saleDate: "2025-02-01", productName: "Car Toy", quantity: 2, totalPrice: 3000 },
    { id: 2, saleDate: "2025-02-01", productName: "Doll House", quantity: 1, totalPrice: 2500 },
    { id: 3, saleDate: "2025-02-03", productName: "Bike Toy", quantity: 3, totalPrice: 4500 },
    { id: 4, saleDate: "2025-02-05", productName: "Remote Car", quantity: 1, totalPrice: 2000 },
    { id: 5, saleDate: "2025-02-05", productName: "Electric Truck", quantity: 1, totalPrice: 3500 },
  ];

  // -------------------------------
  // Convert to chart-friendly data
  // -------------------------------
  const chartData = useMemo(() => {
    const map = new Map();

    sales.forEach((sale) => {
      const date = new Date(sale.saleDate).toLocaleDateString();
      const existing = map.get(date) || { date, sales: 0 };
      existing.sales += sale.totalPrice;
      map.set(date, existing);
    });

    return Array.from(map.values());
  }, [sales]);

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);
  const totalItemsSold = sales.reduce((sum, s) => sum + s.quantity, 0);

  const handleMonthChange = (inc) => {
    setCurrentDate((prev) => {
      const newD = new Date(prev);
      newD.setMonth(newD.getMonth() + inc);
      return newD;
    });
  };

  return (
    <div>
      <Header title="Sales Reports" subtitle="Analyze your monthly sales performance." />

      {/* Month Switcher */}
      <div className="my-6 flex justify-center items-center space-x-4">
        <button
          onClick={() => handleMonthChange(-1)}
          className="px-4 py-2 bg-white rounded-md shadow hover:bg-gray-100"
        >
          &lt; Prev
        </button>

        <h2 className="text-xl font-semibold text-gray-700">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>

        <button
          onClick={() => handleMonthChange(1)}
          className="px-4 py-2 bg-white rounded-md shadow hover:bg-gray-100"
        >
          Next &gt;
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-800">Rs {totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-500">Items Sold</h3>
          <p className="text-3xl font-bold text-gray-800">{totalItemsSold}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Sales Chart</h3>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `Rs ${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white p-6 rounded-xl shadow-md mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Details</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Total Price</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{sale.productName}</td>
                  <td className="px-6 py-4">{sale.quantity}</td>
                  <td className="px-6 py-4">Rs {sale.totalPrice.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
