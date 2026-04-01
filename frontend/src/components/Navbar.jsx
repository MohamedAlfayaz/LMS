import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  FileText,
  BarChart3,
  BookOpen,
  StickyNote,
  History
} from "lucide-react";
import Button from "./ui/Button"

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const token = localStorage.getItem("token");
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch {
      localStorage.removeItem("token");
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menusByRole = {
    teacher: [
      { name: "Dashboard", path: "/teacher", icon: LayoutDashboard },
      { name: "Create & View Articles", path: "/teacher/articles", icon: FileText },
      { name: "Analytics", path: "/teacher/analytics", icon: BarChart3 },
    ],
    student: [
      { name: "Dashboard", path: "/student", icon: LayoutDashboard },
      { name: "Articles", path: "/student/articles", icon: BookOpen },
      { name: "Notes", path: "/student/notes", icon: StickyNote },
      { name: "History", path: "/student/history", icon: History },
    ],
    admin: [
      { name: "Dashboard", path: "/admin", icon: LayoutDashboard }
    ],
  };

  const menus = menusByRole[role] || [];

  const roleBadge = {
    teacher: "bg-blue-100 text-blue-700 ring-blue-200",
    student: "bg-green-100 text-green-700 ring-green-200",
    admin: "bg-amber-100 text-amber-700 ring-amber-200",
  };

  const roleDot = {
    teacher: "bg-blue-400",
    student: "bg-green-400",
    admin: "bg-amber-400",
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
          ${scrolled
            ? "bg-slate-900/90 backdrop-blur-xl shadow-lg"
            : "bg-slate-900/70 backdrop-blur-md"
          }`}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-6">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/40 transition-shadow duration-300">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Dash<span className="text-indigo-400">board</span>
            </span>
          </Link>

          {/* ROLE BADGE */}
          {token && role && (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ring-1 capitalize
                ${roleBadge[role] || "bg-slate-700 text-slate-300 ring-slate-600"}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${roleDot[role] || "bg-slate-400"}`} />
              {role}
            </span>
          )}

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {menus.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <button
                  key={menu.name}
                  onClick={() => navigate(menu.path)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? "text-white bg-indigo-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {menu.name}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-indigo-400" />
                  )}
                </button>
              );
            })}

            {menus.length > 0 && token && (
              <div className="w-px h-5 bg-white/10 mx-2" />
            )}

            {token && (
              <Button
                onClick={handleLogout}
                variant="danger"
              >
                <LogOut size={14} />
                Logout
              </Button>
            )}
          </div>

          {/* HAMBURGER */}
          <button
            onClick={() => setMobileOpen(true)}
            variant="secondary"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>

      {/* OVERLAY */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all duration-300
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 bg-slate-900 border-l border-white/[0.07] flex flex-col
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg">
              <LayoutDashboard size={15} className="text-white" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">
              Dash<span className="text-indigo-400">board</span>
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Menu */}
        <div className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {menus.map((menu) => {
            const isActive = location.pathname === menu.path;
            const Icon = menu.icon;

            return (
              <button
                key={menu.name}
                onClick={() => {
                  navigate(menu.path);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left
                 ${isActive
                    ? "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/25"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{menu.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Drawer Footer */}
        {token && (
          <div className="px-3 pb-6 border-t border-white/[0.06] pt-4">
            <Button
                onClick={handleLogout}
                variant="danger"
              >
              <LogOut size={15} />
              Logout
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;