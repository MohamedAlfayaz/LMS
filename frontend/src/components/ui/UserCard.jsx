import Button from "./Button";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function UserCard({ user, onEdit, onDelete }) {

  const truncateName = (name) =>
    name.length > 8 ? name.slice(0, 8) + "..." : name;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">

      <div className="flex justify-between items-start">

        <div className="flex gap-3 items-center">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="font-semibold text-gray-800 text-sm">
              {truncateName(user.name)}
            </p>
          </div>
        </div>

        <span className={`px-2 py-1 text-[10px] rounded-full font-medium
          ${user.role === "admin"
            ? "bg-purple-100 text-purple-700"
            : user.role === "teacher"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {user.role}
        </span>
      </div>

      <div className="mt-3 bg-gray-50 rounded-lg px-3 py-2">
        <p className="text-[11px] text-gray-400">Email</p>
        <p className="text-xs text-gray-700 break-all">
          {user.email}
        </p>
      </div>

      <div className="flex justify-between gap-2 mt-4">
        <Button onClick={onEdit} variant="warning">
          <FiEdit2 size={14} /> Edit
        </Button>

        <Button onClick={onDelete} variant="danger">
          <FiTrash2 size={14} /> Delete
        </Button>
      </div>
    </div>
  );
}