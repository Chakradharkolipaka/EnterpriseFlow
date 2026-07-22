import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, createProduct, updateProduct } from '../../api/productApi';
import FormInput from '../../components/common/FormInput';
import toast from 'react-hot-toast';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Gadgets',
    unitPrice: '',
    currentStock: '',
    minStockAlert: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setFetchLoading(true);
      const response = await getProduct(id);
      const product = response.data;
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || 'Gadgets',
        unitPrice: product.unitPrice || '',
        currentStock: product.currentStock || '',
        minStockAlert: product.minStockAlert || '',
        description: product.description || ''
      });
    } catch (error) {
      toast.error(error.message || 'Failed to load product');
      navigate('/products');
    } finally {
      setFetchLoading(false);
    }
  };

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

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.unitPrice || formData.unitPrice <= 0) {
      newErrors.unitPrice = 'Unit price must be greater than 0';
    }

    if (!isEdit) {
      // Current stock is only required when creating
      if (!formData.currentStock || formData.currentStock < 0) {
        newErrors.currentStock = 'Current stock must be 0 or greater';
      }
    }

    if (!formData.minStockAlert || formData.minStockAlert < 0) {
      newErrors.minStockAlert = 'Minimum stock alert must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors');
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        category: formData.category,
        unitPrice: parseFloat(formData.unitPrice),
        minStockAlert: parseInt(formData.minStockAlert)
      };

      if (!isEdit) {
        // Only include currentStock when creating
        submitData.currentStock = parseInt(formData.currentStock);
      }

      if (formData.description.trim()) {
        submitData.description = formData.description.trim();
      }

      if (isEdit) {
        await updateProduct(id, submitData);
        toast.success('Product updated successfully');
        navigate(`/products/${id}`);
      } else {
        const response = await createProduct(submitData);
        toast.success('Product created successfully');
        navigate(`/products/${response.data._id}`);
      }
    } catch (error) {
      if (error.errors && typeof error.errors === 'object') {
        setErrors(error.errors);
      }
      toast.error(error.message || `Failed to ${isEdit ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surfaceAlt rounded w-1/3"></div>
          <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-surfaceAlt rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(isEdit ? `/products/${id}` : '/products')}
          className="text-muted hover:text-text"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-text">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6">
        <div className="space-y-6">
          {/* Product Name */}
          <FormInput.TextInput
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          {/* SKU */}
          <FormInput.TextInput
            label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            error={errors.sku}
            placeholder="e.g., PRD-001"
            disabled={isEdit}
            required
          />

          {/* Category */}
          <FormInput.SelectInput
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
            options={[
              { value: 'Gadgets', label: 'Gadgets' },
              { value: 'Apparel', label: 'Apparel' },
              { value: 'Footwear', label: 'Footwear' },
              { value: 'Accessories', label: 'Accessories' }
            ]}
            required
          />

          {/* Unit Price */}
          <FormInput.TextInput
            label="Unit Price (₹)"
            name="unitPrice"
            type="number"
            step="0.01"
            value={formData.unitPrice}
            onChange={handleChange}
            error={errors.unitPrice}
            min="0"
            required
          />

          {/* Current Stock - only show when creating */}
          {!isEdit && (
            <FormInput.TextInput
              label="Initial Stock"
              name="currentStock"
              type="number"
              value={formData.currentStock}
              onChange={handleChange}
              error={errors.currentStock}
              min="0"
              helpText="Use 'Adjust Stock' button on product detail page to change stock later"
              required
            />
          )}

          {/* Min Stock Alert */}
          <FormInput.TextInput
            label="Minimum Stock Alert"
            name="minStockAlert"
            type="number"
            value={formData.minStockAlert}
            onChange={handleChange}
            error={errors.minStockAlert}
            min="0"
            helpText="Alert when stock falls to or below this level"
            required
          />

          {/* Description */}
          <FormInput.TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            rows={3}
          />

          {isEdit && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-blue-400">
                <strong>Note:</strong> To change the current stock, use the "Adjust Stock" button on the product detail page.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(isEdit ? `/products/${id}` : '/products')}
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
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
