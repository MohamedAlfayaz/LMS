import { useNavigate } from "react-router-dom";
import { FaBookOpen, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import Button from "../components/ui/Button";

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center px-4">

            {/* LOGO / TITLE */}
            <div className="text-center max-w-xl">

                <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                        <FaBookOpen size={24} />
                    </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    Welcome to Learning Management System
                </h1>

                <p className="text-gray-500 mt-3 text-sm sm:text-base">
                    Manage students, teachers, and learning content efficiently.
                </p>

            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl w-full">

                <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <FaUserGraduate className="mx-auto text-indigo-600 mb-2" size={20} />
                    <p className="text-sm font-medium">Student Management</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <FaChalkboardTeacher className="mx-auto text-green-600 mb-2" size={20} />
                    <p className="text-sm font-medium">Teacher Dashboard</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <FaBookOpen className="mx-auto text-purple-600 mb-2" size={20} />
                    <p className="text-sm font-medium">Learning Content</p>
                </div>

            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-10">

                <Button
                    onClick={() => navigate("/login")}
                    variant="login"
                >
                    Login
                </Button>

                <Button
                    onClick={() => navigate("/register")}
                    variant="register"
                >
                    Register
                </Button>

            </div>

        </div>
    );
}