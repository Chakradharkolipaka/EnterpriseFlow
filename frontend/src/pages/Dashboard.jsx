import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCustomers } from '../api/customerApi';
import { getProducts } from '../api/productApi';
import { getChallans } from '../api/challanApi';
import Badge from '../components/common/Badge';
import toast from 'react-hot-toast';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalChallans: 0,
    lowStockCount: 0
  });
  const [recentChallans, setRecentChallans] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch based on user role
      const promises = [];
      
      // All roles can see customers
      if (['admin', 'sales', 'accounts'].includes(user?.role)) {
        promises.push(getCustomers({ limit: 1 }).then(res => res.data.total));
      } else {
        promises.push(Promise.resolve(0));
      }
      
      // All roles can see products
      promises.push(getProducts({ limit: 1 }).then(res => res.data.total));
      
      // All roles except warehouse can see challans
      if (['admin', 'sales', 'accounts'].includes(user?.role)) {
        promises.push(getChallans({ limit: 1 }).then(res => res.data.total));
      } else {
        promises.push(Promise.resolve(0));
      }
      
      // Get low stock count
      promises.push(getProducts({ lowStock: 'true', limit: 1 }).then(res => res.data.total));
      
      // Get recent challans (limit 5)
      if (['admin', 'sales', 'accounts'].includes(user?.role)) {
        promises.push(getChallans({ limit: 5 }).then(res => res.data.items));
      } else {
        promises.push(Promise.resolve([]));
      }
      
      // Get low stock products (limit 5)
      promises.push(getProducts({ lowStock: 'true', limit: 5 }).then(res => res.data.items));
      
      const [totalCustomers, totalProducts, totalChallans, lowStockCount, challans, lowStock] = await Promise.all(promises);
      
      setStats({
        totalCustomers,
        totalProducts,
        totalChallans,
        lowStockCount
      });
      setRecentChallans(challans);
      setLowStockProducts(lowStock);
    } catch (error) {
      toast.error(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatsForRole = () => {
    const role = user?.role;
    
    if (role === 'admin' || role === 'accounts') {
      return [
        { label: 'Total Customers', value: stats.totalCustomers, color: 'text-blue-500' },
        { label: 'Total Products', value: stats.totalProducts, color: 'text-green-500' },
        { label: 'Total Challans', value: stats.totalChallans, color: 'text-purple-500' },
        { label: 'Low Stock Alerts', value: stats.lowStockCount, color: 'text-red-500' }
      ];
    } else if (role === 'sales') {
      return [
        { label: 'Total Customers', value: stats.totalCustomers, color: 'text-blue-500' },
        { label: 'Total Challans', value: stats.totalChallans, color: 'text-purple-500' },
        { label: 'Total Products', value: stats.totalProducts, color: 'text-green-500' }
      ];
    } else if (role === 'warehouse') {
      return [
        { label: 'Total Products', value: stats.totalProducts, color: 'text-green-500' },
        { label: 'Low Stock Alerts', value: stats.lowStockCount, color: 'text-red-500' }
      ];
    }
    return [];
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Welcome to EnterpriseFlow</h1>
        <p className="text-muted mt-1">Overview of your business operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-surfaceAlt rounded w-24 mb-3"></div>
              <div className="h-8 bg-surfaceAlt rounded w-16"></div>
            </div>
          ))
        ) : (
          getStatsForRole().map((stat, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-6 hover:border-accent/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted text-sm">{stat.label}</span>
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        {['admin', 'warehouse', 'accounts'].includes(user?.role) && (
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Low Stock Alerts</h2>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-surfaceAlt rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-surfaceAlt rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.map(product => (
                  <div key={product._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-text font-medium">{product.name}</p>
                      <p className="text-sm text-muted">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-500 font-semibold">{product.currentStock} units</p>
                      <p className="text-xs text-muted">Min: {product.minStockAlert}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-center py-8">No low stock alerts</p>
            )}
          </div>
        )}

        {/* Recent Challans */}
        {['admin', 'sales', 'accounts'].includes(user?.role) && (
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Recent Challans</h2>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-surfaceAlt rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-surfaceAlt rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentChallans.length > 0 ? (
              <div className="space-y-3">
                {recentChallans.map(challan => (
                  <div key={challan._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-text font-medium">{challan.challanNumber}</p>
                      <p className="text-sm text-muted">
                        {challan.customer?.name || challan.customerSnapshot?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge status={challan.status} />
                      <p className="text-xs text-muted mt-1">{challan.totalQuantity} items</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-center py-8">No recent challans</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
