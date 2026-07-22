import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProduct, getStockLog } from '../../api/productApi';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import StockAdjustModal from './StockAdjustModal';
import toast from 'react-hot-toast';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [stockLog, setStockLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logLoading, setLogLoading] = useState(true);
  const [logPage, setLogPage] = useState(1);
  const [logTotalPages, setLogTotalPages] = useState(1);
  const [showStockModal, setShowStockModal] = useState(false);

  const canEdit = ['admin', 'warehouse'].includes(user?.role);

  useEffect(() => {
    fetchProduct();
    fetchStockLog();
  }, [id]);

  useEffect(() => {
    fetchStockLog();
  }, [logPage]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProduct(id);
      setProduct(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchStockLog = async () => {
    try {
      setLogLoading(true);
      const response = await getStockLog(id, { page: logPage, limit: 10 });
      setStockLog(response.data.items);
      setLogTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error(error.message || 'Failed to load stock log');
    } finally {
      setLogLoading(false);
    }
  };

  const handleStockAdjustSuccess = () => {
    setShowStockModal(false);
    fetchProduct();
    fetchStockLog();
  };

  const isLowStock = product && product.currentStock <= product.minStockAlert;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surfaceAlt rounded w-1/3"></div>
          <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
            <div className="h-4 bg-surfaceAlt rounded w-1/2"></div>
            <div className="h-4 bg-surfaceAlt rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <p className="text-muted">Product not found</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 text-accent hover:text-accent/80"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/products')}
              className="text-muted hover:text-text"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-text">{product.name}</h1>
            {isLowStock && (
              <span className="px-3 py-1 bg-red-500/10 text-red-500 text-sm rounded font-medium">
                Low Stock
              </span>
            )}
          </div>
          <p className="text-muted mt-1">SKU: {product.sku}</p>
        </div>
        <div className="flex gap-3">
          {canEdit && (
            <>
              <button
                onClick={() => setShowStockModal(true)}
                className="px-4 py-2 border border-accent text-accent hover:bg-accent/10 rounded-lg transition-colors font-medium"
              >
                Adjust Stock
              </button>
              <button
                onClick={() => navigate(`/products/${id}/edit`)}
                className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium"
              >
                Edit Product
              </button>
            </>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-text mb-4">Product Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted mb-1">Category</p>
            <p className="text-text font-medium">{product.category}</p>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Unit Price</p>
            <p className="text-text font-medium">₹{product.unitPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Current Stock</p>
            <p className={`text-2xl font-bold ${isLowStock ? 'text-red-500' : 'text-green-500'}`}>
              {product.currentStock} units
            </p>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Minimum Stock Alert</p>
            <p className="text-text font-medium">{product.minStockAlert} units</p>
          </div>
          {product.description && (
            <div className="md:col-span-2">
              <p className="text-sm text-muted mb-1">Description</p>
              <p className="text-text">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Stock Movement Log */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text mb-4">Stock Movement History</h2>

        {logLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-surfaceAlt rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surfaceAlt rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : stockLog.length > 0 ? (
          <>
            <div className="space-y-3">
              {stockLog.map((log) => (
                <div 
                  key={log._id} 
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        log.movementType === 'IN' 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {log.movementType === 'IN' ? '+' : '-'}{log.quantityChanged}
                      </span>
                      <span className="text-text">{log.reason}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span>{log.createdBy?.name || 'Unknown'}</span>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {logTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border">
                <button
                  onClick={() => setLogPage(prev => Math.max(1, prev - 1))}
                  disabled={logPage === 1}
                  className="px-3 py-1 border border-border rounded hover:bg-surfaceAlt disabled:opacity-50 disabled:cursor-not-allowed text-text"
                >
                  Previous
                </button>
                <span className="text-muted text-sm">
                  Page {logPage} of {logTotalPages}
                </span>
                <button
                  onClick={() => setLogPage(prev => Math.min(logTotalPages, prev + 1))}
                  disabled={logPage === logTotalPages}
                  className="px-3 py-1 border border-border rounded hover:bg-surfaceAlt disabled:opacity-50 disabled:cursor-not-allowed text-text"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-muted text-center py-8">No stock movements yet</p>
        )}
      </div>

      {/* Stock Adjust Modal */}
      {showStockModal && (
        <StockAdjustModal
          product={product}
          onClose={() => setShowStockModal(false)}
          onSuccess={handleStockAdjustSuccess}
        />
      )}
    </div>
  );
}

export default ProductDetail;
