import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import ManagerLeads from './pages/manager/ManagerLeads';
import EmployerLeads from './pages/employer/EmployerLeads';
import EmployerManagers from './pages/employer/EmployerManagers';
import Layout from '@/components/Layout';

const PrivateRoute = ({ children, roles = [] }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" />;
  if (roles.length && !roles.includes(user.role)) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* EMPLOYER ROUTES */}
        <Route
          path="/employer/dashboard"
          element={
            <PrivateRoute roles={['employer']}>
              <Layout><EmployerDashboard /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/employer/managers"
          element={
            <PrivateRoute roles={['employer']}>
              <Layout><EmployerManagers /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/employer/leads"
          element={
            <PrivateRoute roles={['employer']}>
              <Layout><EmployerLeads /></Layout>
            </PrivateRoute>
          }
        />

        {/* MANAGER ROUTES */}
        <Route
          path="/manager/leads"
          element={
            <PrivateRoute roles={['manager']}>
              <Layout><ManagerLeads /></Layout>
            </PrivateRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
