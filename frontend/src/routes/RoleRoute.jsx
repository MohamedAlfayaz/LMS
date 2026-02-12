import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RoleRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  const decoded = jwtDecode(token);

  if (decoded.role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RoleRoute;
