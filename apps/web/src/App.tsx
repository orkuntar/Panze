import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { PanzeDashboard } from './pages/PanzeDashboard';

function App() {
  const { token } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><PanzeDashboard /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </div>
  );
}

export default App;
