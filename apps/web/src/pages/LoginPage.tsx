import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../lib/authService';
import { useAuthStore } from '../store/authStore';
import { IconCheck } from '../lib/icons';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = loginUser(email, password);
      const token = crypto.randomUUID();
      login(token, { id: user.id, name: user.name, email: user.email, role: user.role });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Hatalı giriş.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-lg font-bold text-white">M</div>
            <h1 className="text-2xl font-bold text-white">MondayClone</h1>
          </div>

          {/* Title */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">Giriş Yap</h2>
            <p className="mt-2 text-sm text-indigo-200">Başlamak için hesabınıza giriş yapın</p>
          </div>

          {/* Demo info */}
          <div className="mb-6 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-sm text-white">Demo hesap:</p>
            <p className="mt-1 text-xs font-mono text-indigo-200">alice@example.com</p>
            <p className="text-xs font-mono text-indigo-200">Password123!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-white">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                placeholder="you@example.com"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-white">Parola</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                placeholder="••••••••"
              />
            </label>
            {error ? <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 backdrop-blur-sm">{error}</div> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3 font-semibold text-white transition hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-indigo-200">
            Hesabın yok mu?{' '}
            <Link to="/register" className="font-semibold text-white hover:underline">
              Kaydol
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
