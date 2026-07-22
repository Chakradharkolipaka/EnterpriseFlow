import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'sales', 'warehouse', 'accounts'] },
    { path: '/customers', label: 'Customers', icon: '👥', roles: ['admin', 'sales', 'warehouse', 'accounts'] },
    { path: '/products', label: 'Products', icon: '📦', roles: ['admin', 'warehouse', 'sales', 'accounts'] },
    { path: '/challans', label: 'Challans', icon: '📄', roles: ['admin', 'sales', 'warehouse', 'accounts'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-accent">EnterpriseFlow</h1>
        <p className="text-xs text-muted mt-1">ERP & CRM Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {filteredNav.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-colors ${
                isActive
                  ? 'bg-accent/20 text-accent font-medium'
                  : 'text-muted hover:bg-surfaceAlt hover:text-text'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted text-center">© 2026 EnterpriseFlow</p>
      </div>
    </div>
  );
}

export default Sidebar;
