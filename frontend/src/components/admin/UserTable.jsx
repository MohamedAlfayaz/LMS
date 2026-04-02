import Button from "../ui/Button";
import Input from "../ui/Input";
import CreateUserModal from "./CreateUserModal";

import { useState } from "react";
import {
  FiTrash2,
  FiEdit2,
  FiSearch,
  FiUsers,
  FiUser,
  FiUserCheck,
  FiUserPlus,
} from "react-icons/fi";

import { useDeleteUser } from "../../hooks/useUsers";
import { useTable } from "../../hooks/useTable"; // 🔥 NEW

const roles = [
  { key: "All", label: "All", icon: <FiUsers /> },
  { key: "admin", label: "Admin", icon: <FiUserCheck /> },
  { key: "teacher", label: "Teacher", icon: <FiUser /> },
  { key: "student", label: "Student", icon: <FiUserPlus /> },
];

export default function UsersTable({ users, loading }) {
  const [editUser, setEditUser] = useState(null);
  const [open, setOpen] = useState(false);

  const deleteUser = useDeleteUser();

  // 🔥 GLOBAL TABLE STATE
  const {
    search,
    category,
    page,
    totalPages,
    filtered,
    paginated,
    setSearch,
    setCategory,
    setPage,
  } = useTable(users, "name", "role");

  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;

    try {
      await deleteUser.mutateAsync(id);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const truncateName = (name) =>
    name.length > 8 ? name.slice(0, 8) + "..." : name;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">

      {/* HEADER */}
      <div className="p-4 border-b flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <FiUsers />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Users
            </h2>
            <p className="text-xs text-gray-500">
              {filtered.length} users found
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-end">

          <div className="flex justify-center w-full">
            <div className="flex bg-gray-100 border border-gray-300 rounded-full p-1 shadow-sm 
                  overflow-x-auto no-scrollbar max-w-full">

              {roles.map((role) => (
                <button
                  key={role.key}
                  onClick={() => setCategory(role.key)}
                  className={`flex items-center gap-1 sm:gap-2 
                    px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-medium 
                    whitespace-nowrap rounded-full transition-all duration-300
                    ${category === role.key
                      ? "bg-white text-indigo-600 shadow-md scale-105"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  <span className="text-xs sm:text-sm">{role.icon}</span>
                  <span>{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full sm:w-64">
            <Input
              label="Search"
              placeholder="Search user..."
              icon={<FiSearch />}
              value={search}
              onChange={(e) => setSearch(e.target.value)} // ✅ local state
            />
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="p-6">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No users found 🚫
        </div>
      ) : (
        <>
          {/* DESKTOP */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-y-2">

              {/* HEADER */}
              <thead>
                <tr className="text-gray-500 text-xs uppercase">
                  <th className="text-left px-14">User</th>
                  <th className="text-left px-6">Email</th>
                  <th className="text-left px-3.5">Role</th>
                  <th className="text-right pr-12">Actions</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {paginated.map((u) => (
                  <tr
                    key={u._id}
                    className="bg-white shadow-sm hover:shadow-md transition rounded-xl"
                  >

                    {/* USER */}
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold">
                        {u.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800">{u.name}</p>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">
                        {u.email}
                      </span>
                    </td>

                    {/* ROLE */}
                    <td>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium 
                          ${u.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : u.role === "teacher"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        `}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="pr-6">
                      <div className="flex justify-end gap-2">

                        <Button
                          onClick={() => {
                            setEditUser(u);
                            setOpen(true);
                          }}
                          variant="warning"
                        >
                          <FiEdit2 />
                        </Button>

                        <Button
                          onClick={() => handleDelete(u._id)}
                          variant="danger">
                          <FiTrash2 />
                        </Button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}
          <div className="md:hidden p-4 space-y-4">
            {paginated.map((u) => (
              <div
                key={u._id}
                className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
              >

                {/* TOP */}
                <div className="flex justify-between items-start">

                  {/* USER INFO */}
                  <div className="flex gap-3 items-center">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm shadow">
                      {u.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {truncateName(u.name)}
                      </p>
                    </div>
                  </div>

                  {/* ROLE BADGE */}
                  <span
                    className={`px-2 py-1 text-[10px] rounded-full font-medium
                      ${u.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : u.role === "teacher"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }
                    `}
                  >
                    {u.role}
                  </span>
                </div>

                {/* EMAIL BLOCK */}
                <div className="mt-3 bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-[11px] text-gray-400">Email</p>
                  <p className="text-xs text-gray-700 break-all">
                    {u.email}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-between gap-2 mt-4">

                  <Button
                    onClick={() => {
                      setEditUser(u);
                      setOpen(true);
                    }}
                    variant="warning"
                  >
                    <FiEdit2 size={14} />
                    Edit
                  </Button>

                  <Button
                    onClick={() => handleDelete(u._id)}
                    variant="danger"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </Button>

                </div>

              </div>
            ))}
          </div>

          {/* 🔥 PAGINATION */}
          <div className="flex justify-center items-center gap-2 my-3">

            <Button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              variant="lightgray"
            >
              Prev
            </Button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;

              return (
                <button
                  key={i}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 text-xs border rounded-lg
                              ${page === pageNum
                      ? "bg-indigo-600 text-white"
                      : "bg-white hover:bg-gray-100"
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <Button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              variant="lightgray"
            >
              Next
            </Button>

          </div>
        </>
      )}

      {/* MODAL */}
      {open && (
        <CreateUserModal
          onClose={() => {
            setOpen(false);
            setEditUser(null);
          }}
          editUser={editUser}
        />
      )}
    </div>
  );
}