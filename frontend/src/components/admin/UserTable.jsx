import Loader from "../ui/Loader";
import Button from "../ui/Button";
import Input from "../ui/Input";
import CreateUserModal from "./CreateUserModal";

import { useState } from "react";
import { FiTrash2, FiEdit2, FiSearch } from "react-icons/fi";

// ✅ NEW
import { useDeleteUser } from "../../hooks/useUsers";
import { useDebounce } from "../../hooks/useDebounce"

export default function UsersTable({ users, loading }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400)

  const [roleFilter, setRoleFilter] = useState("all");

  const [editUser, setEditUser] = useState(null);
  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(1);
  const perPage = 5;

  // ✅ React Query delete
  const deleteUser = useDeleteUser();

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchRole =
      roleFilter === "all" ? true : u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // ✅ FIXED DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;

    try {
      await deleteUser.mutateAsync(id);

    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const roleTag = (role) =>
    role === "teacher"
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-blue-700";

  const truncateName = (name) =>
    name.length > 8 ? name.slice(0, 8) + "..." : name;

  const truncateEmail = (email) =>
    email.length > 12 ? email.slice(0, 12) + "..." : email;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">

      {/* HEADER */}
      <div className="p-4 border-b flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

        <h2 className="font-semibold text-lg text-center">Users Lists</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-end">

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

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
        <div className="p-6 flex justify-center">
          <Loader />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No users found 🚫
        </div>
      ) : (
        <>
          {/* DESKTOP */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-4 text-left">User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((u) => (
                  <tr key={u._id} className="border-t hover:bg-gray-50">

                    <td className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-medium">{u.name}</p>
                    </td>

                    <td>{u.email}</td>

                    <td>
                      <span className={`px-3 py-1 text-xs rounded-full ${roleTag(u.role)}`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="pr-6">
                      <div className="flex justify-end gap-2">

                        <Button
                          variant="warning"
                          onClick={() => {
                            setEditUser(u);
                            setOpen(true);
                          }}
                        >
                          <FiEdit2 />
                        </Button>

                        <Button
                          onClick={() => handleDelete(u._id)}
                          variant="danger"
                        >
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
              <div key={u._id} className="bg-gray-100 rounded-2xl p-4 shadow-lg">

                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                      {u.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-sm">
                        {truncateName(u.name)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {truncateEmail(u.email)}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-1 text-xs rounded-full ${roleTag(u.role)}`}>
                    {u.role}
                  </span>
                </div>

                <div className="border-t my-3"></div>

                <div className="flex justify-end gap-2">

                  <Button
                    variant="warning"
                    onClick={() => {
                      setEditUser(u);
                      setOpen(true);
                    }}
                  >
                    <FiEdit2 size={14} />
                  </Button>

                  <Button
                    onClick={() => handleDelete(u._id)}
                    variant="danger"
                  >
                    <FiTrash2 size={14} />
                  </Button>

                </div>

              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center gap-2 p-4">
            <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Prev
            </Button>

            <span className="px-3">{page}</span>

            <Button
              onClick={() => setPage(page + 1)}
              disabled={page * perPage >= filtered.length}
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