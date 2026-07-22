import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getChallans } from '../../api/challanApi';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';

function ChallanList() {
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const canCreate = ['admin', 'sales'].includes(user?.role);

  useEffect(() => {
    fetchChallans();
  }, [page, statusFilter]);

  const fetchChallans = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;

      const response = await getChallans(params);
      setChallans(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error(error.message || 'Failed to load challans');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'challanNumber', label: 'Challan No.' },
    { 
      key: 'customer', 
      label: 'Customer',
      render: (row) => row.customer?.name || row.customerSnapshot?.name || 'N/A'
    },
    { 
      key: 'totalQuantity', 
      label: 'Total Items',
      render: (row) => `${row.totalQuantity} items`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => <Badge status={row.status} />
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          onClick={() => navigate(`/challans/${row._id}`)}
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
          <h1 className="text-2xl font-bold text-text">Challans</h1>
          <p className="text-muted mt-1">Manage delivery challans</p>
        </div>
        {canCreate && (
          <button
            onClick={() => navigate('/challans/new')}
            className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium"
          >
            + Create Challan
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-surface border border-border rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-surfaceAlt border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={challans}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No challans found"
      />
    </div>
  );
}

export default ChallanList;
