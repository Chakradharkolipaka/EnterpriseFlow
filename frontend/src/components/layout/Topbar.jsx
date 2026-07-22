import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';

function Topbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/customers')) return 'Customers';
    if (path.startsWith('/products')) return 'Products';
    if (path.startsWith('/challans')) return 'Challans';
    return 'EnterpriseFlow';
  };

  return (
    <div className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-text">{getPageTitle()}</h2>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-text">{user?.name}</p>
          <Badge status={user?.role} />
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-danger hover:bg-danger/90 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Topbar;
