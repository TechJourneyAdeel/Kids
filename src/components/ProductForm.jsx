import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const ProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    stock: 0,
    sale_price: 0,
    whole_price: 0,
    product_category: "",
    image_url: "https://picsum.photos/seed/placeholder/400/300",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(formData.image_url);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        stock: product.stock,
        sale_price: product.sale_price,
        whole_price: product.whole_price,
        product_category: product.product_category,
        image_url: product.image_url,
      });
      setImagePreview(product.image_url);
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "stock" || name === "sale_price" || name === "whole_price"
          ? Number(value)
          : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSaving(true);

  try {
    let finalImageUrl = formData.image_url; // default old URL

    // If user selected a new image
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(`public/${fileName}`, imageFile, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData, error: urlError } = supabase.storage
        .from("product-images")
        .getPublicUrl(`public/${fileName}`);

      if (urlError) throw urlError;

      finalImageUrl = urlData.publicUrl; // final correct URL
    }

    const productData = { ...formData, image_url: finalImageUrl };

    if (product) {
      // UPDATE product
      const { error } = await supabase
        .from("Products")
        .update(productData)
        .eq("id", product.id);

      if (error) throw error;
    } else {
      // INSERT product
      const { error } = await supabase
        .from("Products")
        .insert([productData]);

      if (error) throw error;
    }

    onSave();
  } catch (error) {
    console.error("Failed to save product:", error);
    alert(error.message || "Error saving product");
  } finally {
    setIsSaving(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="product_category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <input
                type="text"
                name="product_category"
                id="product_category"
                value={formData.product_category}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="sale_price"
                className="block text-sm font-medium text-gray-700"
              >
                Sale Price
              </label>
              <input
                type="number"
                name="sale_price"
                id="sale_price"
                value={formData.sale_price}
                onChange={handleInputChange}
                step="0.01"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="whole_price"
                className="block text-sm font-medium text-gray-700"
              >
                Whole Price
              </label>
              <input
                type="number"
                name="whole_price"
                id="whole_price"
                value={formData.whole_price}
                onChange={handleInputChange}
                step="0.01"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700"
              >
                Stock
              </label>
              <input
                type="number"
                name="stock"
                id="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <div className="mt-1 flex items-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 rounded-md object-cover mr-4"
              />
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSaving ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
