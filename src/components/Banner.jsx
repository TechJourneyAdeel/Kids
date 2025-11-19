export default function Banner({ onAddItem }) {
  return (
    <div className="w-full bg-indigo-50 text-center py-10 px-4">

      {/* H1 title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        All Products
      </h1>

      {/* Add Item button under title */}
      <button
        onClick={onAddItem}
        className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-base hover:bg-indigo-500"
      >
        Add Item
      </button>
    </div>
  )
}
