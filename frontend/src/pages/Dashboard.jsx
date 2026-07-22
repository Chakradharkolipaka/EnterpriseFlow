import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-surface border border-border rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text">Dashboard</h1>
              <p className="text-muted mt-1">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-text">{user?.name}</p>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-accent/20 text-accent rounded">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-danger hover:bg-danger/90 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="text-muted">
            <p>Dashboard content will be added in the next phases.</p>
            <p className="mt-2">API Health check passed - backend connected successfully!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
