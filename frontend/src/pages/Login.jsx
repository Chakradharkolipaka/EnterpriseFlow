import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface border border-border rounded-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text mb-2">EnterpriseFlow</h1>
            <p className="text-muted">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-surfaceAlt border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="admin@enterpriseflow.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-surfaceAlt border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-sm text-muted">
            <p className="font-medium mb-2">Test Credentials:</p>
            <ul className="space-y-1">
              <li>Admin: admin@enterpriseflow.com / admin123</li>
              <li>Sales: sales@enterpriseflow.com / sales123</li>
              <li>Warehouse: warehouse@enterpriseflow.com / warehouse123</li>
              <li>Accounts: accounts@enterpriseflow.com / accounts123</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
