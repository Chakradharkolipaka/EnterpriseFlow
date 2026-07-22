import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomer, createCustomer, updateCustomer } from '../../api/customerApi';
import FormInput from '../../components/common/FormInput';
import toast from 'react-hot-toast';

function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    businessName: '',
    address: '',
    customerType: 'Retail',
    status: 'Lead',
    followUpDate: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setFetchLoading(true);
      const response = await getCustomer(id);
      const customer = response.data;
      setFormData({
        name: customer.name || '',
        mobile: customer.mobile || '',
        email: customer.email || '',
        businessName: customer.businessName || '',
        address: customer.address || '',
        customerType: customer.customerType || 'Retail',
        status: customer.status || 'Lead',
        followUpDate: customer.followUpDate 
          ? new Date(customer.followUpDate).toISOString().split('T')[0] 
          : ''
      });
    } catch (error) {
      toast.error(error.message || 'Failed to load customer');
      navigate('/customers');
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
      newErrors.name = 'Name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Mobile must be 10 digits';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Invalid email format';
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

      // Clean up data
      const submitData = {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        customerType: formData.customerType,
        status: formData.status
      };

      if (formData.email.trim()) submitData.email = formData.email.trim();
      if (formData.businessName.trim()) submitData.businessName = formData.businessName.trim();
      if (formData.address.trim()) submitData.address = formData.address.trim();
      if (formData.followUpDate) submitData.followUpDate = formData.followUpDate;

      if (isEdit) {
        await updateCustomer(id, submitData);
        toast.success('Customer updated successfully');
        navigate(`/customers/${id}`);
      } else {
        const response = await createCustomer(submitData);
        toast.success('Customer created successfully');
        navigate(`/customers/${response.data._id}`);
      }
    } catch (error) {
      if (error.errors && typeof error.errors === 'object') {
        // Handle field-level errors from backend
        setErrors(error.errors);
      }
      toast.error(error.message || `Failed to ${isEdit ? 'update' : 'create'} customer`);
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
            {Array.from({ length: 5 }).map((_, i) => (
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
          onClick={() => navigate(isEdit ? `/customers/${id}` : '/customers')}
          className="text-muted hover:text-text"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-text">
          {isEdit ? 'Edit Customer' : 'Add New Customer'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6">
        <div className="space-y-6">
          {/* Name */}
          <FormInput.TextInput
            label="Customer Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          {/* Mobile */}
          <FormInput.TextInput
            label="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            error={errors.mobile}
            placeholder="10-digit mobile number"
            required
          />

          {/* Email */}
          <FormInput.TextInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          {/* Business Name */}
          <FormInput.TextInput
            label="Business Name"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            error={errors.businessName}
          />

          {/* Customer Type */}
          <FormInput.SelectInput
            label="Customer Type"
            name="customerType"
            value={formData.customerType}
            onChange={handleChange}
            error={errors.customerType}
            options={[
              { value: 'Retail', label: 'Retail' },
              { value: 'Wholesale', label: 'Wholesale' },
              { value: 'Distributor', label: 'Distributor' }
            ]}
            required
          />

          {/* Status */}
          <FormInput.SelectInput
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            error={errors.status}
            options={[
              { value: 'Lead', label: 'Lead' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
            required
          />

          {/* Follow-up Date */}
          <FormInput.DateInput
            label="Follow-up Date"
            name="followUpDate"
            value={formData.followUpDate}
            onChange={handleChange}
            error={errors.followUpDate}
          />

          {/* Address */}
          <FormInput.TextArea
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            rows={3}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(isEdit ? `/customers/${id}` : '/customers')}
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
              {loading ? 'Saving...' : isEdit ? 'Update Customer' : 'Create Customer'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;
