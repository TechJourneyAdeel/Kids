import React, { useState, useEffect } from "react";
import Header from "./Header";
import StatCard from "./StatCard";
import { supabase } from "../lib/supabaseClient";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // 1. Fetch all products
        const { data: products, error } = await supabase
          .from("Products")
          .select("*");

        if (error) throw error;

        // ---- CALCULATIONS ---- //

        // A) Total Products
        const totalProducts = products.length;

        // B) Total Stock Value (sum of wholesale_price * stock)
        const totalStockValue = products.reduce((sum, p) => {
          console.log(p.whole_price)
          console.log(Number(p.stock))
          return sum + (Number(p.whole_price) || 0) * (Number(p.stock) || 0);
        }, 0);

        // console.log(totalStockValue)

        // C) Low Stock Items (stock <= 1)
        const lowStockItemsCount = products.filter(p => Number(p.stock) <= 1).length;

        // D) This Month Sales — stored in sale_stock? Commenting for now
        const monthlySales = 0; // You mentioned comment this

        setStats({
          totalProducts,
          totalStockValue,
          lowStockItemsCount,
          monthlySales,
        });

      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ---- LOADING SKELETON ---- //
  if (loading) {
    return (
      <>
        <Header title="Dashboard" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-10 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div>
      <Header title="Dashboard" subtitle="Overview of your inventory and sales." />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Total Products */}
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || "0"}
        />

        {/* Total Stock Value */}
        <StatCard
          title="Total Stock Value"
          value={`PKR ${stats.totalStockValue.toLocaleString()}`}
        />

        {/* Low Stock Items */}
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockItemsCount || "0"}
          details="(Stock <= 1)"
        />

        {/* Monthly Sales (Disabled for now) */}
        <StatCard
          title="This Month's Sales"
          value="Coming Soon"
        />
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Welcome to ShopKeep!</h3>
        <p className="text-gray-600">
          This is your central hub for managing your shop's inventory. You can add new products,
          update stock levels, and view sales reports using the navigation on the left.
        </p>
        <p className="text-gray-600 mt-2">
          The cards above give you a quick snapshot of your current business health. Keep an eye on
          'Low Stock Items' to know when to reorder!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
