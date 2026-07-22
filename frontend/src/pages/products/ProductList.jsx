import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProducts } from '../../api/productApi';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [lowStock, setLowStock] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const canEdit = ['admin', 'warehouse'].includes(user?.role);

  useEffect(() => {
    fetchProducts();
  }, [page, search, category, lowStock]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (lowStock) params.lowStock = 'true';

      const response = await getProducts(params);
      setProducts(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const isLowStock = (product) => {
    return product.currentStock <= product.minStockAlert;
  };

  const columns = [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { 
      key: 'currentStock', 
      label: 'Stock',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className={isLowStock(row) ? 'text-red-500 font-semibold' : 'text-text'}>
            {row.currentStock}
          </span>
          {isLowStock(row) && (
            <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-xs rounded">
              Low
            </span>
          )}
        </div>
      )
    },
    { 
      key: 'unitPrice', 
      label: 'Unit Price',
      render: (row) => `₹${row.unitPrice.toFixed(2)}`
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          onClick={() => navigate(`/products/${row._id}`)}
          className="text-accent hover:text-accent/80 text-sm font-medium"
        >
          View
        </button>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Products</h1>
          <p className="text-muted mt-1">Manage your product inventory</p>
        </div>
        {canEdit && (
          <button
            onClick={() => navigate('/products/new')}
            className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium"
          >
            + Add Product
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-surface border border-border rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
            className="px-4 py-2 bg-surfaceAlt border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-surfaceAlt border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">All Categories</option>
            <option value="Gadgets">Gadgets</option>
            <option value="Apparel">Apparel</option>
            <option value="Footwear">Footwear</option>
            <option value="Accessories">Accessories</option>
          </select>
          <label className="flex items-center gap-2 px-4 py-2 bg-surfaceAlt border border-border rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={lowStock}
              onChange={(e) => { setLowStock(e.target.checked); setPage(1); }}
              className="w-4 h-4 text-accent focus:ring-accent focus:ring-2"
            />
            <span className="text-text">Show Low Stock Only</span>
          </label>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={products}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No products found"
      />
    </div>
  );
}

export default ProductList;
