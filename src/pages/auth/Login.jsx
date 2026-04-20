import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate('/'), 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] bg-amber-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-5%] w-[500px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[420px] px-6 animate-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-accent-400)] to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/20 mb-5">
            <Crown className="w-7 h-7 text-[var(--color-surface-900)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>CEO's Office</h1>
          <p className="text-[var(--color-text-tertiary)] text-[13px] mt-1.5">Executive Command Center</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="card p-6 space-y-5 glow-ring">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-tertiary)] mb-2">Email Address</label>
            <input
              type="email"
              defaultValue="ceo@dynamixgroup.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-surface-700)] border border-[var(--color-border)] text-[13px] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-400)]/40 focus:ring-1 focus:ring-[var(--color-accent-400)]/20 transition-all placeholder:text-[var(--color-text-tertiary)]"
              placeholder="admin@company.com"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-tertiary)] mb-2">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                defaultValue="ceo123"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-[var(--color-surface-700)] border border-[var(--color-border)] text-[13px] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-400)]/40 focus:ring-1 focus:ring-[var(--color-accent-400)]/20 transition-all"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-accent-400)] to-amber-500 text-[var(--color-surface-900)] text-[13px] font-bold hover:shadow-lg hover:shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[var(--color-surface-900)] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Enter Dashboard <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="text-center text-[11px] text-[var(--color-text-tertiary)] mt-6">
          Restricted access · Authorized personnel only
        </p>
      </div>
    </div>
  );
}
