import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers } from '../../api/customerApi';
import { getProducts } from '../../api/productApi';
import { createChallan } from '../../api/challanApi';
import FormInput from '../../components/common/FormInput';
import toast from 'react-hot-toast';

function ChallanBuilder() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [lineItems, setLineItems] = useState([{ product: '', quantity: '' }]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setFetchLoading(true);
      const [customersRes, productsRes] = await Promise.all([
        getCustomers({ limit: 100 }), // Get all customers
        getProducts({ limit: 100 })  // Get all products
      ]);
      setCustomers(customersRes.data.items);
      setProducts(productsRes.data.items);
    } catch (error) {
      toast.error('Failed to load data');
      navigate('/challans');
    } finally {
      setFetchLoading(false);
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { product: '', quantity: '' }]);
  };

  const removeLineItem = (index) => {
    if (lineItems.length === 1) {
      toast.error('At least one product is required');
      return;
    }
    const newItems = lineItems.filter((_, i) => i !== index);
    setLineItems(newItems);
    // Clear errors for this line
    const newErrors = { ...errors };
    delete newErrors[`line_${index}`];
    setErrors(newErrors);
  };

  const updateLineItem = (index, field, value) => {
    const newItems = [...lineItems];
    newItems[index][field] = value;
    setLineItems(newItems);
    // Clear error for this line
    if (errors[`line_${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`line_${index}`];
      setErrors(newErrors);
    }
  };

  const getProductDetails = (productId) => {
    return products.find(p => p._id === productId);
  };

  const validate = () => {
    const newErrors = {};

    if (!selectedCustomer) {
      newErrors.customer = 'Please select a customer';
    }

    lineItems.forEach((item, index) => {
      if (!item.product) {
        newErrors[`line_${index}`] = 'Product is required';
      } else if (!item.quantity || item.quantity <= 0) {
        newErrors[`line_${index}`] = 'Quantity must be greater than 0';
      } else {
        // Check available stock
        const product = getProductDetails(item.product);
        if (product && item.quantity > product.currentStock) {
          newErrors[`line_${index}`] = `Only ${product.currentStock} units available`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (confirmImmediately) => {
    if (!validate()) {
      toast.error('Please fix the errors');
      return;
    }

    try {
      setLoading(true);

      const challanData = {
        customer: selectedCustomer,
        products: lineItems.map(item => ({
          product: item.product,
          quantity: parseInt(item.quantity)
        })),
        confirmImmediately
      };

      const response = await createChallan(challanData);
      toast.success(response.message || `Challan created as ${confirmImmediately ? 'Confirmed' : 'Draft'}`);
      navigate(`/challans/${response.data._id}`);
    } catch (error) {
      // Handle per-line insufficient stock errors
      if (error.errors && Array.isArray(error.errors)) {
        const lineErrors = {};
        error.errors.forEach((errMsg, index) => {
          lineErrors[`line_${index}`] = errMsg;
        });
        setErrors(lineErrors);
        toast.error('Some products have insufficient stock');
      } else {
        toast.error(error.message || 'Failed to create challan');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surfaceAlt rounded w-1/3"></div>
          <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-surfaceAlt rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/challans')}
          className="text-muted hover:text-text"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-text">Create New Challan</h1>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="space-y-6">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Select Customer <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) => {
                setSelectedCustomer(e.target.value);
                if (errors.customer) {
                  setErrors(prev => ({ ...prev, customer: '' }));
                }
              }}
              className={`w-full px-4 py-2 bg-surfaceAlt border ${
                errors.customer ? 'border-red-500' : 'border-border'
              } rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent`}
            >
              <option value="">-- Select Customer --</option>
              {customers.map(customer => (
                <option key={customer._id} value={customer._id}>
                  {customer.name} - {customer.mobile} {customer.businessName ? `(${customer.businessName})` : ''}
                </option>
              ))}
            </select>
            {errors.customer && (
              <p className="text-red-500 text-sm mt-1">{errors.customer}</p>
            )}
          </div>

          {/* Product Line Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-text">
                Products <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addLineItem}
                className="px-3 py-1 text-sm bg-accent/10 text-accent hover:bg-accent/20 rounded transition-colors"
              >
                + Add Product
              </button>
            </div>

            <div className="space-y-4">
              {lineItems.map((item, index) => {
                const product = getProductDetails(item.product);
                return (
                  <div key={index} className="bg-surfaceAlt rounded-lg p-4 border border-border">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Product Selector */}
                        <div>
                          <label className="block text-xs text-muted mb-1">Product</label>
                          <select
                            value={item.product}
                            onChange={(e) => updateLineItem(index, 'product', e.target.value)}
                            className="w-full px-3 py-2 bg-surface border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                          >
                            <option value="">-- Select Product --</option>
                            {products.map(prod => (
                              <option key={prod._id} value={prod._id}>
                                {prod.name} (SKU: {prod.sku}) - Stock: {prod.currentStock}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Quantity */}
                        <div>
                          <label className="block text-xs text-muted mb-1">Quantity</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 bg-surface border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Enter quantity"
                          />
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        className="mt-5 text-red-500 hover:text-red-400 text-sm"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Product Info */}
                    {product && item.quantity && (
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-muted">
                          Unit Price: ₹{product.unitPrice.toFixed(2)}
                        </span>
                        <span className="text-text font-medium">
                          Line Total: ₹{(product.unitPrice * parseInt(item.quantity || 0)).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Line Error */}
                    {errors[`line_${index}`] && (
                      <p className="text-red-500 text-sm mt-2">{errors[`line_${index}`]}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grand Total */}
          {lineItems.some(item => item.product && item.quantity) && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-text font-medium">Grand Total:</span>
                <span className="text-2xl font-bold text-accent">
                  ₹
                  {lineItems
                    .reduce((sum, item) => {
                      if (item.product && item.quantity) {
                        const product = getProductDetails(item.product);
                        return sum + (product ? product.unitPrice * parseInt(item.quantity) : 0);
                      }
                      return sum;
                    }, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/challans')}
              className="flex-1 px-4 py-2 border border-border hover:bg-surfaceAlt text-text rounded-lg transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-accent text-accent hover:bg-accent/10 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Save as Draft'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Confirm & Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallanBuilder;
