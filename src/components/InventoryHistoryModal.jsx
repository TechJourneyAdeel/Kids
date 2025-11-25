import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const reasonStyles = {
  sale: "bg-red-100 text-red-800",
  purchase: "bg-green-100 text-green-800",
  initial_stock: "bg-blue-100 text-blue-800",
  correction: "bg-yellow-100 text-yellow-800",
};

const InventoryHistoryModal = ({ product, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Products")
          .select("*")
          .eq("id", product.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setHistory(data);
        console.log(history);
      } catch (error) {
        console.error("Failed to fetch inventory history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [product.id]);

  return (
    <div className="fixed inset-0 bg- bg-opacity-90 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Inventory History for{" "}
            <span className="text-blue-600">{product.title}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto space-y-3">
          {loading ? (
            <p>Loading history...</p>
          ) : history.length === 0 ? (
            <p>No inventory history found for this product.</p>
          ) : (
            <ul className="space-y-3">
                 {history.map((log, index) => (
                <li
                  key={index}
                  className="p-3 bg-gray-50 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      Sale Items
                    </p>

                    {/* <p
                      className={`text-xs capitalize font-semibold px-2 py-1 rounded-full inline-block 
                        ${
                          reasonStyles[log.reason] ||
                          "bg-gray-200 text-gray-700"
                        }
                    `}
                    >
                      initial Stocks
                    </p> */}
                  </div>

                  {/* Sale stock — only show if > 0 */}
                  {/* {log.sale_stock > 0 && (
                    <p className="text-lg font-bold text-green-600">
                      +{log.sale_stock}
                    </p>
                  )} */}

                  {/* Stock changes */}
                  <p
                    className={`text-lg font-bold ${
                      log.sale_stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {log.sale_stock > 0 ? `${log.sale_stock}` : 0}
                  </p>
                </li>
                
              ))}
              {history.map((log, index) => (
                <li
                  key={index}
                  className="p-3 bg-gray-50 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      Current Stock
                    </p>

                    {/* <p
                      className={`text-xs capitalize font-semibold px-2 py-1 rounded-full inline-block 
                        ${
                          reasonStyles[log.reason] ||
                          "bg-gray-200 text-gray-700"
                        }
                    `}
                    >
                      initial Stocks
                    </p> */}
                  </div>

                  {/* Sale stock — only show if > 0 */}
                  {/* {log.sale_stock > 0 && (
                    <p className="text-lg font-bold text-green-600">
                      +{log.sale_stock}
                    </p>
                  )} */}

                  {/* Stock changes */}
                  <p
                    className={`text-lg font-bold ${
                      log.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {log.stock > 0 ? `${log.stock}` : log.stock}
                  </p>
                </li>
                
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryHistoryModal;
