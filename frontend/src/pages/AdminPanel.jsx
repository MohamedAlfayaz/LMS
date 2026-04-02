import { useState } from "react";
import { useUsers } from "../hooks/useUsers";

import UsersTable from "../components/admin/UserTable";
import CreateUserModal from "../components/admin/CreateUserModal";
import StatsCard from "../components/ui/StatsCard";
import Button from "../components/ui/Button";

import { Users, Shield, Activity, GraduationCap } from "lucide-react";

export default function AdminDashboard() {

  const { data: users = [], isLoading } = useUsers();

  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  return (
    <div className="p-4 min-h-screen bg-gray-50">

      {/* 🔥 HEADER (UPGRADED) */}
      <div className="flex justify-between items-center mb-4">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <Users size={20} />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Users
            </h1>
            <p className="text-xs text-gray-500">
              Manage all users and roles
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            setEditUser(null);
            setOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Users size={16} />
          Create User
        </Button>
      </div>

      {/* 🔥 STATS (IMPROVED ICONS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">

        <StatsCard
          title="Total Users"
          value={users.length}
          icon={Users}
          accent="bg-gradient-to-r from-indigo-500 to-indigo-600"
        />

        <StatsCard
          title="Teachers"
          value={users.filter(u => u.role === "teacher").length}
          icon={Shield} // teacher
          accent="bg-gradient-to-r from-emerald-500 to-green-600"
        />

        <StatsCard
          title="Students"
          value={users.filter(u => u.role === "student").length}
          icon={GraduationCap} // ✅ FIXED (better icon)
          accent="bg-gradient-to-r from-purple-500 to-purple-600"
        />

        <StatsCard
          title="Active Users"
          value={users.length}
          icon={Activity}
          accent="bg-gradient-to-r from-pink-500 to-rose-500"
        />

      </div>

      {/* TABLE */}
      <UsersTable
        users={users}
        loading={isLoading}
        setEditUser={setEditUser}
        setOpen={setOpen}
      />

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