import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./redux/slices/authSlice";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import EmployerManagers from "./pages/employer/EmployerManagers";
import EmployerLeads from "./pages/employer/EmployerLeads";
import ManagerLeads from "./pages/manager/ManagerLeads";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch current user data when app loads
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Employer routes */}
        <Route
          path="/employer/dashboard"
          element={
            <PrivateRoute allowedRoles={["employer"]}>
              <EmployerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/employer/managers"
          element={
            <PrivateRoute allowedRoles={["employer"]}>
              <EmployerManagers />
            </PrivateRoute>
          }
        />
        <Route
          path="/employer/leads"
          element={
            <PrivateRoute allowedRoles={["employer"]}>
              <EmployerLeads />
            </PrivateRoute>
          }
        />

        {/* Manager routes */}
        <Route
          path="/manager/leads"
          element={
            <PrivateRoute allowedRoles={["manager"]}>
              <ManagerLeads />
            </PrivateRoute>
          }
        />

        {/* Redirect to login by default */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
