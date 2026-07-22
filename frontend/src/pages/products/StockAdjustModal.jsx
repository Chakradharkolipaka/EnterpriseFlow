import { useState } from 'react';
import { adjustStock } from '../../api/productApi';
import Modal from '../../components/common/Modal';
import FormInput from '../../components/common/FormInput';
import toast from 'react-hot-toast';

function StockAdjustModal({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    movementType: 'IN',
    quantity: '',
    reason: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }

    // Check if OUT would cause negative stock
    if (formData.movementType === 'OUT') {
      const quantity = parseInt(formData.quantity);
      if (quantity > product.currentStock) {
        newErrors.quantity = `Cannot remove ${quantity} units. Only ${product.currentStock} available.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      await adjustStock(product._id, {
        movementType: formData.movementType,
        quantity: parseInt(formData.quantity),
        reason: formData.reason.trim()
      });

      toast.success('Stock adjusted successfully');
      onSuccess();
    } catch (error) {
      // Show specific error message from backend
      if (error.message && error.message.includes('Insufficient stock')) {
        setErrors({ quantity: error.message });
      } else {
        toast.error(error.message || 'Failed to adjust stock');
      }
    } finally {
      setLoading(false);
    }
  };

  const newStock = formData.quantity 
    ? product.currentStock + (formData.movementType === 'IN' ? parseInt(formData.quantity) : -parseInt(formData.quantity))
    : product.currentStock;

  return (
    <Modal onClose={onClose} title="Adjust Stock">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Current Stock Info */}
          <div className="bg-surfaceAlt rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted">Current Stock</span>
              <span className="text-lg font-bold text-text">{product.currentStock} units</span>
            </div>
            {formData.quantity && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">New Stock</span>
                <span className={`text-lg font-bold ${newStock < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {newStock} units
                </span>
              </div>
            )}
          </div>

          {/* Movement Type */}
          <FormInput.SelectInput
            label="Movement Type"
            name="movementType"
            value={formData.movementType}
            onChange={handleChange}
            error={errors.movementType}
            options={[
              { value: 'IN', label: 'Stock In (Add)' },
              { value: 'OUT', label: 'Stock Out (Remove)' }
            ]}
            required
          />

          {/* Quantity */}
          <FormInput.TextInput
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            error={errors.quantity}
            min="1"
            required
          />

          {/* Reason */}
          <FormInput.TextArea
            label="Reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            error={errors.reason}
            placeholder="e.g., Purchase from supplier, Damaged goods, etc."
            rows={3}
            required
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border hover:bg-surfaceAlt text-text rounded-lg transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adjusting...' : 'Adjust Stock'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default StockAdjustModal;
