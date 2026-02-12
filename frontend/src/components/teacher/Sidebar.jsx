import React from "react";
import {
  FiHome,
  FiEdit,
  FiFileText,
  FiBarChart2,
} from "react-icons/fi";

const Sidebar = ({ active, setActive }) => {
  const menus = [
    { name: "Dashboard", icon: <FiHome size={20} /> },
    { name: "Create Article", icon: <FiEdit size={20} /> },
    { name: "Articles", icon: <FiFileText size={20} /> },
    { name: "Analytics", icon: <FiBarChart2 size={20} /> },
  ];

  return (
    <div className="w-20 bg-white shadow-lg h-screen fixed left-0 top-0 flex flex-col justify-center items-center py-6 space-y-6">
      
      <h2 className="text-indigo-600 font-bold text-xl mb-6">
        TP
      </h2>

      {menus.map((menu) => (
        <div
          key={menu.name}
          onClick={() => setActive(menu.name)}
          className="relative group"
        >
          {/* Icon */}
          <div
            className={`p-3 rounded-xl cursor-pointer transition ${
              active === menu.name
                ? "bg-indigo-600 text-white"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            {menu.icon}
          </div>

          {/* Hover Label */}
          <span className="absolute left-16 top-1/2 -translate-y-1/2 
            bg-black text-white text-sm px-3 py-1 rounded-md 
            opacity-0 group-hover:opacity-100 
            transition duration-200 whitespace-nowrap">
            {menu.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
