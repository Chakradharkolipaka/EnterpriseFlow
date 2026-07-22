import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="bg-surface border border-border rounded-xl p-8 max-w-md text-center">
          <div className="text-danger text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-text mb-2">Access Denied</h2>
          <p className="text-muted mb-6">
            You don't have permission to access this page.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
