import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import Dashboard from "../src/pages/Dashboard";
import ProjectDetails from "../src/pages/ProjectDetails";
import ProtectedRoute from "../src/components/ProtectedRoute";
import GuestRoute from "../src/components/GuestRoute";


export const router = createBrowserRouter([
   {
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: [
      { path: "/", element: <Login /> },
      { path: "/register", element: <Register /> }
    ]
  },

  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/project/:id", element: <ProjectDetails /> }
    ]
  }
]);