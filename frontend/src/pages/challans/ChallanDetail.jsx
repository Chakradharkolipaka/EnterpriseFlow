import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getChallan, confirmChallan, cancelChallan } from '../../api/challanApi';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

function ChallanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challan, setChallan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const canEdit = ['admin', 'sales'].includes(user?.role);

  useEffect(() => {
    fetchChallan();
  }, [id]);

  const fetchChallan = async () => {
    try {
      setLoading(true);
      const response = await getChallan(id);
      setChallan(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to load challan');
      navigate('/challans');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setActionLoading(true);
      const response = await confirmChallan(id);
      setChallan(response.data);
      setShowConfirmModal(false);
      toast.success('Challan confirmed successfully');
    } catch (error) {
      // Show specific insufficient stock errors
      if (error.errors && Array.isArray(error.errors)) {
        const errorList = error.errors.join('\n');
        toast.error(`Insufficient stock:\n${errorList}`, { duration: 5000 });
      } else {
        toast.error(error.message || 'Failed to confirm challan');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setActionLoading(true);
      const response = await cancelChallan(id);
      setChallan(response.data);
      setShowCancelModal(false);
      toast.success('Challan cancelled successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel challan');
    } finally {
      setActionLoading(false);
    }
  };

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

  if (!challan) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <p className="text-muted">Challan not found</p>
        <button
          onClick={() => navigate('/challans')}
          className="mt-4 text-accent hover:text-accent/80"
        >
          Back to Challans
        </button>
      </div>
    );
  }

  const isDraft = challan.status === 'Draft';
  const isConfirmed = challan.status === 'Confirmed';
  const isCancelled = challan.status === 'Cancelled';

  const grandTotal = challan.products.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/challans')}
              className="text-muted hover:text-text"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-text">{challan.challanNumber}</h1>
            <Badge status={challan.status} />
          </div>
          <p className="text-muted mt-1">
            Created by {challan.createdBy?.name || 'Unknown'} on{' '}
            {new Date(challan.createdAt).toLocaleString()}
          </p>
        </div>
        {canEdit && (
          <div className="flex gap-3">
            {isDraft && (
              <>
                <button
                  onClick={() => navigate(`/challans/${id}/edit`)}
                  className="px-4 py-2 border border-border hover:bg-surfaceAlt text-text rounded-lg transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                >
                  Confirm
                </button>
              </>
            )}
            {(isDraft || isConfirmed) && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>

      {/* Customer Info */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-text mb-4">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted mb-1">Name</p>
            <p className="text-text font-medium">
              {challan.customer?.name || challan.customerSnapshot?.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Business Name</p>
            <p className="text-text font-medium">
              {challan.customer?.businessName || challan.customerSnapshot?.businessName || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Mobile</p>
            <p className="text-text font-medium">
              {challan.customer?.mobile || challan.customerSnapshot?.mobile}
            </p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-text mb-4">Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted">SKU</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted">Product Name</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted">Unit Price</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted">Quantity</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {challan.products.map((item, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 text-text">{item.sku}</td>
                  <td className="py-3 px-4 text-text">{item.name}</td>
                  <td className="py-3 px-4 text-text text-right">
                    ₹{item.unitPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-text text-right">{item.quantity}</td>
                  <td className="py-3 px-4 text-text text-right font-medium">
                    ₹{(item.unitPrice * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border">
                <td colSpan="4" className="py-3 px-4 text-right font-semibold text-text">
                  Grand Total:
                </td>
                <td className="py-3 px-4 text-right font-bold text-accent text-lg">
                  ₹{grandTotal.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan="4" className="py-2 px-4 text-right text-sm text-muted">
                  Total Quantity:
                </td>
                <td className="py-2 px-4 text-right text-sm text-muted">
                  {challan.totalQuantity} items
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Additional Info */}
      {isConfirmed && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-green-400">
            ✓ This challan has been confirmed and stock has been deducted.
          </p>
        </div>
      )}

      {isCancelled && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-400">
            ✕ This challan has been cancelled. Stock has been restored if it was previously confirmed.
          </p>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <Modal onClose={() => setShowConfirmModal(false)} title="Confirm Challan">
          <div className="space-y-4">
            <p className="text-text">
              Are you sure you want to confirm this challan? This will deduct stock for all products.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-sm text-yellow-400">
                <strong>Warning:</strong> If any product has insufficient stock, the confirmation will fail.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-border hover:bg-surfaceAlt text-text rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Confirming...' : 'Confirm Challan'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <Modal onClose={() => setShowCancelModal(false)} title="Cancel Challan">
          <div className="space-y-4">
            <p className="text-text">
              Are you sure you want to cancel this challan?
              {isConfirmed && ' Stock will be restored to inventory.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-border hover:bg-surfaceAlt text-text rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Cancelling...' : 'Cancel Challan'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ChallanDetail;
