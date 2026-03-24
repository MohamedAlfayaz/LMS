import React from "react";
import {
  FiHome,
  FiBookOpen,
  FiEdit3,
  FiClock,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { setActive } from "../../store/uiSlice";

const StudentSidebar = () => {

  const dispatch = useDispatch()
  const active = useSelector((state)=> state.ui.active)

  const menus = [
    { name: "Dashboard", icon: <FiHome size={20} /> },
    { name: "Browse Articles", icon: <FiBookOpen size={20} /> },
    { name: "My Notes", icon: <FiEdit3 size={20} /> },
    { name: "Reading History", icon: <FiClock size={20} /> },
  ];

  return (
    <div className="w-20 bg-white shadow-lg h-screen fixed left-0 top-0 flex flex-col justify-center items-center py-6 space-y-6 z-40">

      <div className="relative group inline-block">
        <h2 className="text-indigo-600 font-bold text-xl cursor-pointer">
          SP
        </h2>

        <span
          className="absolute left-10 top-1/2 -translate-y-1/2
          bg-indigo-600 text-white text-sm px-3 py-1 rounded-md
          opacity-0 group-hover:opacity-100
          transition duration-200 whitespace-nowrap"
        >
          Student Portal
        </span>
      </div>

      {menus.map((menu) => (
        <div
          key={menu.name}
          onClick={() => dispatch(setActive(menu.name))}
          className="relative group"
        >
          {/* Icon */}
          <div
            className={`p-3 rounded-xl cursor-pointer transition ${active === menu.name
              ? "bg-indigo-600 text-white"
              : "hover:bg-gray-100 text-gray-600"
              }`}
          >
            {menu.icon}
          </div>

          {/* Hover Label */}
          <span
            className="
              absolute left-13 top-1/2 -translate-y-1/2
              bg-indigo-600 text-white text-sm px-3 py-1 rounded-md
              opacity-0 group-hover:opacity-100
              transition duration-200 whitespace-nowrap
              z-50 shadow-lg pointer-events-none
            "
          >
            {menu.name}
          </span>

        </div>
      ))}
    </div>
  );
};

export default StudentSidebar;
