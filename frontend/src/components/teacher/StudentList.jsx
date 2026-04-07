import React, { useState } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiUsers } from "react-icons/fi";

import Input from "../ui/Input";
import Button from "../ui/Button";
import Loading from "../ui/Loading";
import ConfirmModal from "../ui/ConfirmModal";
import AddStudent from "./AddStudent";
import { useDeleteUser, useUsers } from "../../hooks/useUsers";
import { useTable } from "../../hooks/useTable";
import toast from "react-hot-toast";
import { FaUserPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { openModal, closeModal } from "../../store/modalSlice";
import Pagination from "../ui/Pagination";
import UserTableUI from "../ui/UserTableUI";
import UserCard from "../ui/UserCard";

export default function StudentList() {
  const dispatch = useDispatch();
  const { modalOpen } = useSelector((state) => state.modal);

  // ✅ FETCH USERS
  const { data: users = [], isLoading } = useUsers();
  // ✅ FILTER STUDENTS
  const studentUsers = users.filter((u) => u.role === "student");
  const deleteUser = useDeleteUser();

  // ✅ STATE
  const [editUser, setEditUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // ✅ TABLE
  const {
    search,
    page,
    totalPages,
    filtered,
    paginated,
    setSearch,
    setPage,
  } = useTable(studentUsers, "name");

  // ✅ DELETE
  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting student...");

    try {
      await deleteUser.mutateAsync(deleteId);
      toast.success("Student deleted", { id: loadingToast });
      setDeleteId(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed", {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md mt-4 overflow-hidden">

      {/* HEADER */}
      <div className="relative p-5 border-b bg-gradient-to-r from-blue-50 via-white to-blue-50">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            {/* ICON */}
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl 
                      bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <FiUsers size={20} />
            </div>

            {/* TEXT */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                Student Management
              </h2>

              <p className="text-sm text-gray-500">
                Manage all students, track records & activities
              </p>

              <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                {filtered.length} Active Students
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col sm:flex-row items-center gap-3">

            {/* SEARCH */}
            <div className="w-full sm:w-64">
              <Input
                label="Search Students"
                placeholder="Search by name..."
                icon={<FiSearch />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* ADD BUTTON */}
            <Button
              variant="success"
              className="flex items-center gap-2 shadow-md hover:shadow-lg transition"
              onClick={() => {
                setEditUser(null);
                dispatch(openModal());
              }}
            >
              <FaUserPlus />
              Add Student
            </Button>

          </div>

        </div>
      </div>

      {/* LOADING */}
      {isLoading ? (
        <div className="p-6">
          <Loading />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No students found 🚫
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

      {/* 🔥 MODAL (CREATE + EDIT) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => dispatch(closeModal())}
          />

          {/* MODAL */}
          <div
            className="relative bg-white w-full max-w-md mx-4 rounded-2xl shadow-2xl 
                       animate-slideUp overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            {/* HEADER */}
            <div className="flex justify-between items-center px-5 py-3 border-b">
              <h2 className="text-sm font-semibold text-gray-700">
                Add Student
              </h2>

              <button
                onClick={() => dispatch(closeModal())}
                className="text-gray-400 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-5 max-h-[80vh] overflow-y-auto">
              <AddStudent
                editUser={editUser}
                onClose={() => {
                  dispatch(closeModal());
                  setEditUser(null);
                }}
              />
            </div>

          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Student"
        message="Are you sure you want to delete this student?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

    </div>
  );
}