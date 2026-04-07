import Input from "../ui/Input";
import Pagination from "../ui/Pagination";
import UserTableUI from "../ui/UserTableUI";
import UserCard from "../ui/UserCard";

import { useState } from "react";
import {
  FiSearch,
  FiUsers,
  FiUser,
  FiUserCheck,
  FiUserPlus,
} from "react-icons/fi";

import { useDeleteUser } from "../../hooks/useUsers";
import { useTable } from "../../hooks/useTable";
import Loading from "../ui/Loading";
import ConfirmModal from "../ui/ConfirmModal";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { openModal } from "../../store/modalSlice";

const roles = [
  { key: "All", label: "All", icon: <FiUsers /> },
  { key: "admin", label: "Admin", icon: <FiUserCheck /> },
  { key: "teacher", label: "Teacher", icon: <FiUser /> },
  { key: "student", label: "Student", icon: <FiUserPlus /> },
];

export default function UsersTable({ users = [], loading, setEditUser }) {

  const dispatch = useDispatch();
  const deleteUser = useDeleteUser();

  const [deleteId, setDeleteId] = useState(null);

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

  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting user...");

    try {
      await deleteUser.mutateAsync(deleteId);

      toast.success("User deleted successfully", {
        id: loadingToast,
      });

      setDeleteId(null);
    } catch (err) {
      toast.error("Delete failed", { id: loadingToast });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">

      {/* HEADER */}
      <div className="p-4 border-b flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <FiUsers />
          </div>

          <div className="flex md:flex-col sm:flex-row gap-2 sm:gap-0 items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Users
            </h2>
            <p className="text-xs mt-1 sm:mt-0 text-gray-500">
              {filtered.length} {filtered.length === 0 || filtered.length === 1 ? "user" : "users"}
            </p>
            <p className="text-xs mt-1 sm:mt-0 text-gray-500">
              {totalPages} {totalPages === 0 || totalPages === 1 ? "page" : "pages"}
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
        <div className="p-6">
          <Loading />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No users found 🚫
        </div>
      ) : (
        <>
          {/* DESKTOP */}
          <UserTableUI
            data={paginated}
            onEdit={(u) => {
              setEditUser(u);
              dispatch(openModal());
            }}
            onDelete={(id) => setDeleteId(id)}
          />

          {/* MOBILE */}
          <div className="md:hidden p-4 space-y-4">
            {paginated.map((u) => (
              <UserCard
                key={u._id}
                user={u}
                onEdit={() => {
                  setEditUser(u);
                  dispatch(openModal());
                }}
                onDelete={() => setDeleteId(u._id)}
              />
            ))}
          </div>

          {/* 🔥 PAGINATION */}
          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </>
      )}

      {/* DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}