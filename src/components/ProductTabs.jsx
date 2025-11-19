import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

// Fetch all unique categories from products table
const useCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("products")
        .select("product_category")
        .neq("product_category", null); // ignore null values

      if (error) {
        console.error(error);
      } else {
        // get unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((item) => item.product_category))
        );
        setCategories(uniqueCategories);
      }
    }

    fetchCategories();
  }, []);

  return categories;
};

// Fetch products by category
const fetchProducts = async (category = null) => {
  let query = supabase.from("products").select("*");

  if (category && category !== "All") {
    query = query.eq("product_category", category); // filter by product_category
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};

export default function ProductTabs() {
  const categories = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await fetchProducts(currentCategory);
      setProducts(data);
    }
    loadProducts();
  }, [currentCategory]);

  const handleTabClick = (category) => {
    setSearchParams({ category });
  };
  return (
    <div className="md:flex md:gap-4">
      {/* Tabs */}
      <ul className="flex flex-col space-y-2 text-sm font-medium md:me-4 mb-4 md:mb-0">
        <li>
          <button
            onClick={() => handleTabClick("All")}
            className={`w-full px-4 py-2 rounded-base ${
              currentCategory === "All"
                ? "bg-brand text-white font-semibold"
                : "hover:bg-neutral-secondary-soft"
            }`}
          >
            All
          </button>
        </li>
        {categories.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => handleTabClick(cat)}
              className={`w-full px-4 py-2 rounded-base ${
                currentCategory === cat
                  ? "bg-brand text-white font-semibold"
                  : "hover:bg-neutral-secondary-soft"
              }`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>

      {/* Product Grid */}
      <div className="p-4 bg-neutral-secondary rounded-base w-full">
        {products.length === 0 ? (
          <p className="text-body">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border p-2 rounded">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.price} PKR</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
