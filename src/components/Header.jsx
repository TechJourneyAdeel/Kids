export default function Header({ onLogout, onAddItem }) {
  return (
    <header className="w-full bg-white shadow flex items-center justify-between px-4 py-3 relative">

      {/* Left – Logout */}
      <button
        onClick={onLogout}
        className="absolute left-4 text-sm font-semibold text-red-500 hover:text-red-600"
      >
        Logout
      </button>

      {/* Center – Logo */}
      <div className="mx-auto text-xl font-bold text-gray-800">
        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="" class="h-8 w-auto m-auto" />
      </div>

      {/* Right – Add Item */}
      <button
        onClick={onAddItem}
        className="absolute right-4 bg-indigo-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-400"
      >
        Add Item
      </button>
    </header>
  )
}
