import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
