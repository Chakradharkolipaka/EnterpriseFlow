import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCustomers } from '../../api/customerApi';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const canEdit = ['admin', 'sales'].includes(user?.role);

  useEffect(() => {
    fetchCustomers();
  }, [page, search, status, type]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (status) params.status = status;
      if (type) params.type = type;

      const response = await getCustomers(params);
      setCustomers(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error(error.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'businessName', label: 'Business' },
    { key: 'mobile', label: 'Mobile' },
    { 
      key: 'customerType', 
      label: 'Type',
      render: (row) => <Badge status={row.customerType} />
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => <Badge status={row.status} />
    },
    {
      key: 'followUpDate',
      label: 'Follow-up',
      render: (row) => row.followUpDate ? new Date(row.followUpDate).toLocaleDateString() : '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          onClick={() => navigate(`/customers/${row._id}`)}
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
          <h1 className="text-2xl font-bold text-text">Customers</h1>
          <p className="text-muted mt-1">Manage your customer relationships</p>
        </div>
        {canEdit && (
          <button
            onClick={() => navigate('/customers/new')}
            className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium"
          >
            + Add Customer
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-surface border border-border rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={handleSearchChange}
            className="px-4 py-2 bg-surfaceAlt border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-surfaceAlt border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">All Statuses</option>
            <option value="Lead">Lead</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-surfaceAlt border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">All Types</option>
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Distributor">Distributor</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={customers}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No customers found"
      />
    </div>
  );
}

export default CustomerList;
