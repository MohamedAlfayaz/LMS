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
  History,
  User,
} from "lucide-react";
import Button from "./ui/Button";

const roleBadgeClass = {
  teacher: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
  student: "bg-emerald-500/12 text-emerald-300 border border-emerald-500/25",
  admin:   "bg-violet-500/15 text-violet-300 border border-violet-500/30",
};

const roleDotClass = {
  teacher: "bg-blue-400",
  student: "bg-emerald-400",
  admin:   "bg-violet-400",
};

const Navbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  const token = localStorage.getItem("token");
  let role     = null;
  let username = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role     = decoded.role;
      username = decoded.name || decoded.username;
    } catch {
      localStorage.removeItem("token");
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menusByRole = {
    teacher: [
      { name: "Dashboard",             path: "/teacher",           icon: LayoutDashboard },
      { name: "Create & View Articles", path: "/teacher/articles",  icon: FileText        },
      { name: "Analytics",             path: "/teacher/analytics", icon: BarChart3       },
      { name: "Students",              path: "/teacher/students",  icon: User            },
    ],
    student: [
      { name: "Dashboard", path: "/student",          icon: LayoutDashboard },
      { name: "Articles",  path: "/student/articles", icon: BookOpen        },
      { name: "Notes",     path: "/student/notes",    icon: StickyNote      },
      { name: "History",   path: "/student/history",  icon: History         },
    ],
    admin: [
      { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    ],
  };

  const menus = menusByRole[role] || [];

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
          border-b border-white/[0.06]
          ${scrolled
            ? "bg-[#0a081e]/90 shadow-[0_4px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]"
            : "bg-[#0f0c29]/60 shadow-[0_4px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]"
          }`}
        style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
      >
        <div className="max-w-6xl mx-auto px-5 h-[60px] flex items-center gap-3">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-[34px] h-[34px] bg-gradient-to-br from-indigo-500 to-violet-500
              rounded-[10px] flex items-center justify-center
              shadow-[0_0_20px_rgba(99,102,241,0.35)]
              group-hover:shadow-[0_0_28px_rgba(99,102,241,0.55)]
              group-hover:scale-105 transition-all duration-200">
              <LayoutDashboard size={15} className="text-white" />
            </div>
            <span className="text-white font-bold text-[17px] tracking-tight">
              Dash<span className="text-indigo-400">board</span>
            </span>
          </Link>

          {/* ROLE BADGE */}
          {token && role && (
            <div className="flex items-center gap-2.5 ml-1">
              {username && (
                <span className="text-[13px] text-white/60 font-light hidden sm:block">
                  {username}
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold
                  px-2.5 py-1 rounded-full uppercase tracking-[0.5px]
                  ${roleBadgeClass[role] ?? "bg-slate-700/50 text-slate-300 border border-slate-600/40"}`}
              >
                <span
                  className={`w-[5px] h-[5px] rounded-full animate-pulse
                    ${roleDotClass[role] ?? "bg-slate-400"}`}
                />
                {role}
              </span>
            </div>
          )}

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-0.5 ml-auto">
            {menus.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <button
                  key={menu.name}
                  onClick={() => navigate(menu.path)}
                  className={`relative px-3.5 py-[7px] rounded-lg text-[13.5px] transition-all duration-200
                    ${isActive
                      ? "text-white bg-indigo-500/20 font-medium"
                      : "text-white/50 hover:text-white/90 hover:bg-white/5 font-normal"
                    }`}
                >
                  {menu.name}
                  {isActive && (
                    <span className="absolute bottom-[5px] left-1/2 -translate-x-1/2
                      w-4 h-0.5 rounded-full bg-indigo-400" />
                  )}
                </button>
              );
            })}

            {menus.length > 0 && token && (
              <div className="w-px h-5 bg-white/10 mx-2" />
            )}

            {token && (
              <Button onClick={handleLogout} variant="danger">
                <LogOut size={14} />
                Logout
              </Button>
            )}
          </div>

          {/* HAMBURGER */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden ml-auto flex items-center justify-center
              w-9 h-9 rounded-[9px]
              border border-white/10 bg-white/[0.04]
              text-white/60 hover:bg-white/[0.09] hover:text-white/90
              transition-all duration-200"
          >
            <Menu size={17} />
          </button>
        </div>
      </nav>

      {/* ── OVERLAY ── */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 transition-all duration-300
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
      />

      {/* ── MOBILE DRAWER ── */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 flex flex-col
          border-l border-white/[0.07]
          shadow-[-8px_0_40px_rgba(0,0,0,0.4)]
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          background: "rgba(13,11,32,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 h-[60px] border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-[32px] h-[32px] bg-gradient-to-br from-indigo-500 to-violet-500
              rounded-[9px] flex items-center justify-center
              shadow-[0_0_16px_rgba(99,102,241,0.35)]">
              <LayoutDashboard size={14} className="text-white" />
            </div>
            <span className="text-white font-bold text-[16px] tracking-tight">
              Dash<span className="text-indigo-400">board</span>
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg
              border border-white/10 bg-white/[0.04]
              text-white/50 hover:bg-white/[0.09] hover:text-white
              transition-all duration-200"
          >
            <X size={15} />
          </button>
        </div>

        {/* User info strip */}
        {token && role && (
          <div className="px-5 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30
                flex items-center justify-center text-indigo-300 text-sm font-semibold flex-shrink-0">
                {username?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{username}</p>
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-semibold
                    px-2 py-0.5 rounded-full uppercase tracking-[0.5px] mt-0.5
                    ${roleBadgeClass[role] ?? "bg-slate-700/50 text-slate-300 border border-slate-600/40"}`}
                >
                  <span className={`w-[4px] h-[4px] rounded-full ${roleDotClass[role] ?? "bg-slate-400"}`} />
                  {role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Links */}
        <div className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto">
          {menus.map((menu) => {
            const isActive = location.pathname === menu.path;
            const Icon     = menu.icon;
            return (
              <button
                key={menu.name}
                onClick={() => {
                  navigate(menu.path);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                  text-sm text-left transition-all duration-150
                  ${isActive
                    ? "bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-500/25 font-medium"
                    : "text-white/50 hover:bg-white/5 hover:text-white/90 font-normal"
                  }`}
              >
                <Icon size={17} className="flex-shrink-0" />
                <span>{menu.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Drawer Footer */}
        {token && (
          <div className="px-3 pb-6 pt-3 border-t border-white/[0.06]">
            <Button onClick={handleLogout} variant="danger">
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