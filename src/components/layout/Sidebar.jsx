import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, FolderKanban, IndianRupee,
  BarChart3, Bell, Settings, LogOut, Crown, ClipboardCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/employees', icon: Users, label: 'Workforce' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/attendance', icon: ClipboardCheck, label: 'Attendance' },
  { to: '/salary', icon: IndianRupee, label: 'Payroll' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
];

const BOTTOM_ITEMS = [
  { to: '/notifications', icon: Bell, label: 'Alerts' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `group relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 ${
      isActive
        ? 'bg-white/[0.07] text-[var(--color-accent-400)] shadow-[inset_0_0_0_1px_rgba(245,200,66,0.15)]'
        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.04]'
    }`;

  return (
    <aside className="fixed top-0 left-0 bottom-0 z-40 w-[260px] flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface-800)]/80 backdrop-blur-xl">

      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-[var(--color-border)]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent-400)] to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/10">
          <Crown className="w-4 h-4 text-[var(--color-surface-900)]" />
        </div>
        <div className="leading-none">
          <span className="text-sm font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>CEO's Office</span>
          <span className="block text-[10px] text-[var(--color-text-tertiary)] font-medium tracking-wide uppercase mt-0.5">Command Center</span>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 pt-6 space-y-1.5">
        <span className="block px-4 mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-tertiary)]">
          Main
        </span>
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
            <item.icon className="w-[20px] h-[20px] shrink-0" strokeWidth={1.8} />
            {item.label}
            {/* Active indicator bar */}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-4 pb-6 space-y-1.5 border-t border-[var(--color-border)] pt-4">
        {BOTTOM_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} className={linkClass}>
            <item.icon className="w-[20px] h-[20px] shrink-0" strokeWidth={1.8} />
            {item.label}
          </NavLink>
        ))}

        {/* CEO Profile Mini */}
        <div className="mt-4 px-4 py-3 rounded-xl bg-white/[0.03] border border-[var(--color-border)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-[13px] font-bold text-white">
            RM
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-[var(--color-text-primary)] truncate">Raj Malhotra</div>
            <div className="text-[12px] text-[var(--color-text-tertiary)]">Chief Executive</div>
          </div>
          <LogOut className="w-4 h-4 text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] cursor-pointer transition-colors shrink-0" />
        </div>
      </div>
    </aside>
  );
}
