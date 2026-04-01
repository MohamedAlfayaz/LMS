import { useState } from "react";
import { useUsers } from "../hooks/useUsers";

import UsersTable from "../components/admin/UserTable";
import CreateUserModal from "../components/admin/CreateUserModal";
import StatsCard from "../components/ui/StatsCard";
import Button from "../components/ui/Button";

import { Users, Shield, Activity } from "lucide-react";

export default function AdminDashboard() {

  // ✅ React Query (NO useEffect, NO API call)
  const { data: users = [], isLoading } = useUsers();

  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  return (
    <div className="p-4 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>

        <Button
          onClick={() => {
            setEditUser(null);
            setOpen(true);
          }}
        >
          + Create User
        </Button>
      </div>

      {/* STATS */}
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
          icon={Shield}
          accent="bg-gradient-to-r from-emerald-500 to-green-600"
        />

        <StatsCard
          title="Students"
          value={users.filter(u => u.role === "student").length}
          icon={Shield}
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