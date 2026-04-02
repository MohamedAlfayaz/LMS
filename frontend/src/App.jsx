import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* Layouts */
import MainLayout from "./components/MainLayout";

/* Pages */
import Welcome from "./pages/Welcome";
import AdminPanel from "./pages/AdminPanel";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

import StudentArticles from "./components/student/StudentArticles";
import StudentHistory from "./components/student/StudentHistory";
import MyNotes from "./components/student/MyNotes";

import TeacherArticles from "./components/teacher/ArticlesTable";
import TeacherAnalytics from "./components/teacher/ChartsSection";

import ArticleReader from "./components/student/ArticleReader";
import CreateArticle from "./components/teacher/CreateArticle";

/* Auth */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

/* Routes */
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

/* ---------- Role Wrappers ---------- */

const AdminRoute = ({ children }) => (
  <ProtectedRoute>
    <RoleRoute allowedRoles={["admin"]}>{children}</RoleRoute>
  </ProtectedRoute>
);

const TeacherRoute = ({ children }) => (
  <ProtectedRoute>
    <RoleRoute allowedRoles={["teacher"]}>{children}</RoleRoute>
  </ProtectedRoute>
);

const StudentRoute = ({ children }) => (
  <ProtectedRoute>
    <RoleRoute allowedRoles={["student"]}>{children}</RoleRoute>
  </ProtectedRoute>
);

/* ---------- App ---------- */

const App = () => {
  return (
    <Router>
      <Routes>

        {/* ---------- PUBLIC ---------- */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ---------- ADMIN ---------- */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <MainLayout>
                <AdminPanel />
              </MainLayout>
            </AdminRoute>
          }
        />

        {/* ---------- TEACHER ---------- */}
        <Route
          path="/teacher"
          element={
            <TeacherRoute>
              <MainLayout>
                <TeacherDashboard />
              </MainLayout>
            </TeacherRoute>
          }
        />

        <Route
          path="/teacher/create-article"
          element={
            <TeacherRoute>
              <MainLayout>
                <CreateArticle />
              </MainLayout>
            </TeacherRoute>
          }
        />

        <Route
          path="/teacher/articles"
          element={
            <TeacherRoute>
              <MainLayout>
                <TeacherArticles />
              </MainLayout>
            </TeacherRoute>
          }
        />

        <Route
          path="/teacher/analytics"
          element={
            <TeacherRoute>
              <MainLayout>
                <TeacherAnalytics />
              </MainLayout>
            </TeacherRoute>
          }
        />

        <Route
          path="/teacher/edit-article/:id"
          element={
            <TeacherRoute>
              <MainLayout>
                <CreateArticle />
              </MainLayout>
            </TeacherRoute>
          }
        />

        {/* ---------- STUDENT ---------- */}
        <Route
          path="/student"
          element={
            <StudentRoute>
              <MainLayout>
                <StudentDashboard />
              </MainLayout>
            </StudentRoute>
          }
        />

        <Route
          path="/student/articles"
          element={
            <StudentRoute>
              <MainLayout>
                <StudentArticles />
              </MainLayout>
            </StudentRoute>
          }
        />

        <Route
          path="/student/history"
          element={
            <StudentRoute>
              <MainLayout>
                <StudentHistory />
              </MainLayout>
            </StudentRoute>
          }
        />

        <Route
          path="/student/notes"
          element={
            <StudentRoute>
              <MainLayout>
                <MyNotes />
              </MainLayout>
            </StudentRoute>
          }
        />

        <Route
          path="/student/article/:id"
          element={
            <StudentRoute>
              <MainLayout>
                <ArticleReader />
              </MainLayout>
            </StudentRoute>
          }
        />

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
};

export default App;