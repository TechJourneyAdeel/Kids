import React from "react";

const StatCard = ({ title, value, details }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md transition-transform transform hover:-translate-y-1">
      <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
      {details && <p className="text-xs text-gray-400 mt-1">{details}</p>}
    </div>
  );
};

export default StatCard;
