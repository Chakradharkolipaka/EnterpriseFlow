import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCustomer, addFollowUpNote } from '../../api/customerApi';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';

function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const canEdit = ['admin', 'sales'].includes(user?.role);

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await getCustomer(id);
      setCustomer(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to load customer');
      navigate('/customers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      setAddingNote(true);
      const response = await addFollowUpNote(id, noteText.trim());
      setCustomer(response.data);
      setNoteText('');
      toast.success('Follow-up note added successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to add note');
    } finally {
      setAddingNote(false);
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

  if (!customer) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <p className="text-muted">Customer not found</p>
        <button
          onClick={() => navigate('/customers')}
          className="mt-4 text-accent hover:text-accent/80"
        >
          Back to Customers
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
              onClick={() => navigate('/customers')}
              className="text-muted hover:text-text"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-text">{customer.name}</h1>
            <Badge status={customer.status} />
          </div>
          <p className="text-muted mt-1">{customer.businessName || 'No business name'}</p>
        </div>
        {canEdit && (
          <button
            onClick={() => navigate(`/customers/${id}/edit`)}
            className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium"
          >
            Edit Customer
          </button>
        )}
      </div>

      {/* Customer Details */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-text mb-4">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted mb-1">Mobile</p>
            <p className="text-text font-medium">{customer.mobile}</p>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Email</p>
            <p className="text-text font-medium">{customer.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Customer Type</p>
            <Badge status={customer.customerType} />
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Follow-up Date</p>
            <p className="text-text font-medium">
              {customer.followUpDate 
                ? new Date(customer.followUpDate).toLocaleDateString() 
                : 'Not set'}
            </p>
          </div>
          {customer.address && (
            <div className="md:col-span-2">
              <p className="text-sm text-muted mb-1">Address</p>
              <p className="text-text">{customer.address}</p>
            </div>
          )}
        </div>
      </div>

      {/* Follow-up Notes */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text mb-4">Follow-up Notes</h2>

        {/* Add Note Form */}
        {canEdit && (
          <form onSubmit={handleAddNote} className="mb-6">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a follow-up note..."
              className="w-full px-4 py-3 bg-surfaceAlt border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              rows="3"
              disabled={addingNote}
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={addingNote || !noteText.trim()}
                className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingNote ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </form>
        )}

        {/* Notes List */}
        {customer.notes && customer.notes.length > 0 ? (
          <div className="space-y-4">
            {customer.notes
              .slice()
              .reverse()
              .map((note, index) => (
                <div key={index} className="border-l-4 border-accent pl-4 py-2">
                  <p className="text-text mb-2">{note.text}</p>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span>
                      {note.createdBy?.name || note.createdBy?.email || 'Unknown'}
                    </span>
                    <span>
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-muted text-center py-8">No follow-up notes yet</p>
        )}
      </div>
    </div>
  );
}

export default CustomerDetail;
