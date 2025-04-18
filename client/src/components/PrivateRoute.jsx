import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, isLoading } = useSelector(
    (state) => state.auth
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(role)) {
    return (
      <Navigate
        to={role === "manager" ? "/manager/leads" : "/employer/dashboard"}
        replace
      />
    );
  }

  // Render the protected component with header
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">{children}</div>
    </>
  );
};

export default PrivateRoute;
