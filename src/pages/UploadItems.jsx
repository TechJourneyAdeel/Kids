import { useState } from "react";
import { supabase } from "../lib/supabaseClient"; // your Supabase client

export default function UploadItems() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [wholePrice, setWholePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productImage) {
      setMessage("Please select an image");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // 1️⃣ Upload image to Supabase Storage
      const fileExt = productImage.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images") // your bucket name
        .upload(fileName, productImage);

      if (uploadError) throw uploadError;

      // 2️⃣ Get public URL
      const { data: urlData, error: urlError } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      if (urlError) throw urlError;

      const publicURL = urlData.publicUrl;

      // 3️⃣ Insert record into products table
      const { data, error } = await supabase.from("Products").insert([
        {
          title: productName,
          product_category: category,
          stock: Number(stock),
          whole_price: Number(wholePrice),
          sale_price: Number(salePrice),
          Image_url: publicURL,
        },
      ]);

      if (error) throw error;

      setMessage("Product uploaded successfully!");
      setProductName("");
      setCategory("");
      setStock("");
      setWholePrice("");
      setSalePrice("");
      setProductImage(null);
    } catch (err) {
      console.error(err);
      setMessage("Error uploading product");
    }

    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">
        Upload Items
      </h1>

      <div className="max-w-5xl mx-auto flex items-start justify-center gap-10">
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-[800px] rounded-xl p-6 space-y-5 bg-white shadow"
        >
          {/* Product Name + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>

          {/* Whole Price + Sale Price + Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Whole Price
              </label>
              <input
                type="number"
                required
                value={wholePrice}
                onChange={(e) => setWholePrice(e.target.value)}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sale Price
              </label>
              <input
                type="number"
                required
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>

          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 bg-neutral-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                  {productImage && (
                    <p className="mt-2 text-green-600 text-sm">
                      {productImage.name} selected
                    </p>
                  )}
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={(e) => setProductImage(e.target.files[0])}
                  required
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Item"}
          </button>

          {message && (
            <p className="mt-2 text-center text-sm text-gray-700">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
