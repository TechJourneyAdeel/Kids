import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import Header from "./Header";
import ProductForm from "./ProductForm";
import InventoryHistoryModal from "./InventoryHistoryModal";
import PlusIcon from "./icons/PlusIcon";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleViewHistory = (product) => {
    setSelectedProduct(product);
    setIsHistoryOpen(true);
  };

  // Optional: simple stock decrease for demonstration
  const handleRecordSale = async (product) => {
    if (product.stock < 1) {
      alert("Cannot sell out of stock item.");
      return;
    }
    if (window.confirm(`Record sale of one ${product.title}?`)) {
      try {
        const { data, error } = await supabase
          .from("Products")
          .update({
            stock: product.stock - 1,
            sale_stock: product.sale_stock + 1,
          })
          .eq("id", product.id);
        if (error) throw error;
        fetchProducts(); // refresh products
      } catch (error) {
        console.error("Failed to record sale:", error);
        alert("Error recording sale. Check stock levels.");
      }
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
        return;
    }

    try {
        const { error } = await supabase
            .from("Products")
            .delete()
            .eq("id", product.id);

        if (error) throw error;

        // Refresh product list
        fetchProducts();

        alert("Product deleted successfully.");
    } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Error deleting product.");
    }
};


  return (
    <div>
      <Header title="Products" subtitle="Manage your product inventory.">
        <button
          onClick={handleAddProduct}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
        >
          <PlusIcon />
          <span className="ml-2">Add Product</span>
        </button>
      </Header>

      <div className="bg-white p-6 rounded-xl shadow-md mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Whole Price</th>
                <th className="px-6 py-3">Sale Price</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-6">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-6">
                    No products found. Add one to get started!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center">
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-10 h-10 rounded-md object-cover mr-4"
                      />
                      {product.title}
                    </td>
                    <td
                      className={`px-6 py-4 font-semibold ${
                        product.stock <= 10 ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      PKR{product.whole_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      PKR{product.sale_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">{product.product_category}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleRecordSale(product)}
                        className="font-medium text-green-600 hover:underline"
                      >
                        Sell
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewHistory(product)}
                        className="font-medium text-purple-600 hover:underline"
                      >
                        History
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          onClose={() => setIsFormOpen(false)}
          onSave={() => {
            setIsFormOpen(false);
            fetchProducts();
          }}
        />
      )}

      {isHistoryOpen && selectedProduct && (
        <InventoryHistoryModal
          product={selectedProduct}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductList;
