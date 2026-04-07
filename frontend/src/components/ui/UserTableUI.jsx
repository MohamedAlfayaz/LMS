import Button from "./Button";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function UserTableUI({ data, onEdit, onDelete }) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-sm border-separate border-spacing-y-2">

        <thead>
          <tr className="text-gray-500 text-xs uppercase">
            <th className="text-left px-14">User</th>
            <th className="text-left px-6">Email</th>
            <th className="text-left px-3.5">Role</th>
            <th className="text-right pr-12">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((u) => (
            <tr key={u._id} className="bg-white shadow-sm hover:shadow-md rounded-xl">

              <td className="px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold">
                  {u.name.charAt(0).toUpperCase()}
                </div>

                <p className="font-semibold text-gray-800">{u.name}</p>
              </td>

              <td className="text-gray-600">
                <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">
                  {u.email}
                </span>
              </td>

              <td>
                <span className={`px-3 py-1 text-xs rounded-full
                  ${u.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : u.role === "teacher"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                  {u.role}
                </span>
              </td>

              <td className="pr-6">
                <div className="flex justify-end gap-2">
                  <Button onClick={() => onEdit(u)} variant="warning">
                    <FiEdit2 />
                  </Button>

                  <Button onClick={() => onDelete(u._id)} variant="danger">
                    <FiTrash2 />
                  </Button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}