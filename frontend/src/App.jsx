import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#15151d',
              color: '#f2f2f5',
              border: '1px solid #2a2a35',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#15151d',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#15151d',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
