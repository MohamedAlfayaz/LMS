import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ArticleReader from "./components/student/ArticleReader";
import CreateArticle from "./components/teacher/CreateArticle";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

/* ---------------- Layout Component ---------------- */
const Layout = ({ children }) => {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="min-h-screen">
        {children}
      </div>
    </>
  );
};

/* ---------------- App Component ---------------- */
const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Teacher Dashboard */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRole="teacher">
                  <TeacherDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          
           <Route
            path="/create-article"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRole="teacher">
                  <CreateArticle />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
           <Route
            path="/edit-article/:id"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRole="teacher">
                  <CreateArticle />
                </RoleRoute>
              </ProtectedRoute>
            }
          />


          {/* Student Dashboard */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRole="student">
                  <StudentDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Student Article Reader */}
          <Route
            path="/student/article/:id"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRole="student">
                  <ArticleReader />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="*" element={<Login />} />

        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
