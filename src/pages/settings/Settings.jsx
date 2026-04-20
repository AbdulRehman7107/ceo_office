import { useState } from 'react';
import { User, Palette, Shield, Bell, Moon, Sun, Monitor, Check } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'appearance', label: 'Appearance', icon: Palette },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between animate-in">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
          <p className="text-[13px] text-[var(--color-text-tertiary)] mt-0.5">Manage your preferences and account</p>
        </div>
      </div>

      <div className="flex gap-6 animate-in">
        {/* Sidebar tabs */}
        <div className="w-52 shrink-0 space-y-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left ${
                activeTab === t.key
                  ? 'bg-white/[0.07] text-[var(--color-text-primary)] border border-white/[0.06]'
                  : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-white/[0.03] border border-transparent'
              }`}>
              <t.icon className="w-4 h-4" strokeWidth={1.8} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 card p-6 animate-in">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Profile Information</h2>
                <p className="text-[12px] text-[var(--color-text-tertiary)]">Update your personal details</p>
              </div>
              <div className="flex items-center gap-5 pb-5 border-b border-[var(--color-border)]">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xl font-bold text-white">RM</div>
                <div>
                  <div className="text-[14px] font-semibold text-[var(--color-text-primary)]">Raj Malhotra</div>
                  <div className="text-[12px] text-[var(--color-text-tertiary)]">Chief Executive Officer</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: 'Raj Malhotra' },
                  { label: 'Email', value: 'ceo@dynamixgroup.com' },
                  { label: 'Phone', value: '+91 98765 43210' },
                  { label: 'Department', value: 'Executive Office' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-tertiary)] mb-2">{f.label}</label>
                    <input
                      defaultValue={f.value}
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-surface-700)] border border-[var(--color-border)] text-[13px] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-400)]/40 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <button onClick={save} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-accent-400)] to-amber-500 text-[var(--color-surface-900)] text-[13px] font-bold hover:shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2">
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Appearance</h2>
                <p className="text-[12px] text-[var(--color-text-tertiary)]">Customize the look and feel of your dashboard</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-tertiary)] mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Dark', icon: Moon, active: true },
                    { label: 'Light', icon: Sun, active: false },
                    { label: 'System', icon: Monitor, active: false },
                  ].map(t => (
                    <button key={t.label}
                      className={`p-4 rounded-xl border text-center text-[12px] font-medium transition-all ${
                        t.active
                          ? 'border-[var(--color-accent-400)]/40 bg-[var(--color-accent-400)]/[0.06] text-[var(--color-accent-400)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-tertiary)] hover:bg-white/[0.03]'
                      }`}>
                      <t.icon className="w-5 h-5 mx-auto mb-2" />
                      {t.label}
                      {t.active && <div className="mt-1 text-[10px] opacity-70">Active</div>}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-tertiary)] mb-3">Accent Color</label>
                <div className="flex gap-3">
                  {[
                    { name: 'Gold', color: '#f5c842', active: true },
                    { name: 'Blue', color: '#60a5fa', active: false },
                    { name: 'Green', color: '#34d399', active: false },
                    { name: 'Purple', color: '#a78bfa', active: false },
                    { name: 'Rose', color: '#fb7185', active: false },
                  ].map(c => (
                    <button key={c.name} className={`w-9 h-9 rounded-xl transition-all ${c.active ? 'ring-2 ring-offset-2 ring-offset-[var(--color-card)] scale-110' : 'hover:scale-105'}`}
                      style={{ background: c.color, ringColor: c.active ? c.color : undefined }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Notification Preferences</h2>
                <p className="text-[12px] text-[var(--color-text-tertiary)]">Control what alerts you receive</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Project Delays', desc: 'Alert when a project falls behind schedule', enabled: true },
                  { label: 'Low Performance', desc: 'Flag employees below productivity threshold', enabled: true },
                  { label: 'Material Delays', desc: 'Vendor delivery timeline warnings', enabled: true },
                  { label: 'Payroll Reminders', desc: 'Upcoming salary review cycles', enabled: false },
                  { label: 'Promotion Eligibility', desc: 'When employees qualify for advancement', enabled: true },
                  { label: 'Safety Incidents', desc: 'On-site safety event reporting', enabled: true },
                ].map(pref => (
                  <div key={pref.label} className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0">
                    <div>
                      <div className="text-[13px] font-medium text-[var(--color-text-primary)]">{pref.label}</div>
                      <div className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">{pref.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={pref.enabled} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[var(--color-surface-500)] rounded-full peer peer-checked:bg-[var(--color-accent-400)] transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Security</h2>
                <p className="text-[12px] text-[var(--color-text-tertiary)]">Manage access and authentication</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-tertiary)] mb-2">Current Password</label>
                  <input type="password" defaultValue="••••••••" className="w-full max-w-sm px-3 py-2.5 rounded-xl bg-[var(--color-surface-700)] border border-[var(--color-border)] text-[13px] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-400)]/40 transition-colors" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-tertiary)] mb-2">New Password</label>
                  <input type="password" placeholder="Enter new password" className="w-full max-w-sm px-3 py-2.5 rounded-xl bg-[var(--color-surface-700)] border border-[var(--color-border)] text-[13px] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-400)]/40 transition-colors placeholder:text-[var(--color-text-tertiary)]" />
                </div>
                <button onClick={save} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-accent-400)] to-amber-500 text-[var(--color-surface-900)] text-[13px] font-bold hover:shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2">
                  {saved ? <><Check className="w-4 h-4" /> Updated!</> : 'Update Password'}
                </button>
              </div>
              <div className="pt-4 border-t border-[var(--color-border)]">
                <h3 className="text-[13px] font-medium text-[var(--color-text-primary)] mb-2">Active Sessions</h3>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-[var(--color-border)] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-positive)]/10 flex items-center justify-center">
                    <Monitor className="w-4 h-4 text-[var(--color-positive)]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] font-medium text-[var(--color-text-primary)]">Current Session — Chrome on Windows</div>
                    <div className="text-[10px] text-[var(--color-text-tertiary)]">Mumbai, India · Active now</div>
                  </div>
                  <span className="pill pill-positive text-[9px]">Active</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
