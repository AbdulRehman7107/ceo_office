import { useState } from 'react';
import { Search, Bell, Command } from 'lucide-react';
import { notifications } from '../../data/seed';
import { useNavigate } from 'react-router-dom';
import { employees } from '../../data/seed';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();

  const filtered = query.length >= 2
    ? employees.filter(e =>
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.role.toLowerCase().includes(query.toLowerCase()) ||
        e.id.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  return (
    <>
      <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-border)] bg-[var(--color-surface-800)]/50 backdrop-blur-md sticky top-0 z-30">
        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-[var(--color-border)] text-[var(--color-text-tertiary)] text-[13px] hover:bg-white/[0.06] hover:border-white/10 transition-all w-72"
        >
          <Search className="w-4 h-4" strokeWidth={1.8} />
          <span>Search employees, projects...</span>
          <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-[var(--color-border)] font-mono text-[var(--color-text-tertiary)]">⌘K</kbd>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.04] transition-all"
            >
              <Bell className="w-[18px] h-[18px]" strokeWidth={1.8} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-danger)] rounded-full ring-2 ring-[var(--color-surface-800)]" />
            </button>

            {/* Dropdown */}
            {showNotifs && (
              <div className="absolute right-0 top-12 w-96 card p-0 shadow-2xl shadow-black/40 overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--color-border)] flex justify-between items-center">
                  <span className="text-[13px] font-semibold">Notifications</span>
                  <span className="pill pill-danger">{notifications.length}</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[var(--color-border)]">
                  {notifications.slice(0, 8).map(n => (
                    <div key={n.id} className="px-4 py-3 flex gap-3 hover:bg-white/[0.02] transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        n.type === 'danger' ? 'bg-[var(--color-danger)]' :
                        n.type === 'warning' ? 'bg-[var(--color-warning)]' :
                        n.type === 'positive' ? 'bg-[var(--color-positive)]' : 'bg-[var(--color-info)]'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium text-[var(--color-text-primary)] truncate">{n.title}</div>
                        <div className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">{n.subtitle}</div>
                      </div>
                      <span className="text-[10px] text-[var(--color-text-tertiary)] whitespace-nowrap">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date */}
          <div className="text-[12px] text-[var(--color-text-tertiary)] px-3 py-1.5 rounded-lg bg-white/[0.03] border border-[var(--color-border)]">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </header>

      {/* Command Palette Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div className="w-[540px] card p-0 shadow-2xl shadow-black/50 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
              <Search className="w-5 h-5 text-[var(--color-text-tertiary)]" strokeWidth={1.8} />
              <input
                className="flex-1 bg-transparent text-[14px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
                placeholder="Search by name, role, or ID..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-[var(--color-border)] font-mono text-[var(--color-text-tertiary)]">ESC</kbd>
            </div>
            {filtered.length > 0 && (
              <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.03]">
                {filtered.map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => { navigate(`/employees/${emp.id}`); setSearchOpen(false); setQuery(''); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] text-left transition-colors"
                  >
                    <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full bg-[var(--color-surface-600)]" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-[var(--color-text-primary)] truncate">{emp.name}</div>
                      <div className="text-[11px] text-[var(--color-text-tertiary)]">{emp.role} · {emp.department}</div>
                    </div>
                    <span className="pill pill-neutral text-[10px]">{emp.id}</span>
                  </button>
                ))}
              </div>
            )}
            {query.length >= 2 && filtered.length === 0 && (
              <div className="px-4 py-8 text-center text-[13px] text-[var(--color-text-tertiary)]">No results found</div>
            )}
            {query.length < 2 && (
              <div className="px-4 py-6 text-center text-[12px] text-[var(--color-text-tertiary)]">
                Start typing to search across the organization...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
