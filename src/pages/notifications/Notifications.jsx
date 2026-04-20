import { useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, Clock, Trash2, Check } from 'lucide-react';
import { notifications as allNotifications, delayedProjects, highRisk, promotionReady } from '../../data/seed';

export default function Notifications() {
  const [filter, setFilter] = useState('all');
  const [dismissed, setDismissed] = useState(new Set());

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'danger', label: 'Critical' },
    { key: 'warning', label: 'Warnings' },
    { key: 'info', label: 'Info' },
    { key: 'positive', label: 'Positive' },
  ];

  const visibleNotifs = allNotifications
    .filter(n => !dismissed.has(n.id))
    .filter(n => filter === 'all' || n.type === filter);

  const typeIcon = (type) => {
    switch (type) {
      case 'danger': return <AlertTriangle className="w-4 h-4 text-[var(--color-danger)]" />;
      case 'warning': return <Clock className="w-4 h-4 text-[var(--color-warning)]" />;
      case 'positive': return <CheckCircle className="w-4 h-4 text-[var(--color-positive)]" />;
      default: return <Info className="w-4 h-4 text-[var(--color-info)]" />;
    }
  };

  const typeBg = (type) => {
    switch (type) {
      case 'danger': return 'border-l-[var(--color-danger)]';
      case 'warning': return 'border-l-[var(--color-warning)]';
      case 'positive': return 'border-l-[var(--color-positive)]';
      default: return 'border-l-[var(--color-info)]';
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between animate-in">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Notifications</h1>
          <p className="text-[13px] text-[var(--color-text-tertiary)] mt-0.5">
            {visibleNotifs.length} active alerts across the organization
          </p>
        </div>
        <button
          onClick={() => setDismissed(new Set(allNotifications.map(n => n.id)))}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-[var(--color-border)] text-[12px] text-[var(--color-text-secondary)] hover:bg-white/[0.06] transition-colors"
        >
          <Check className="w-4 h-4" /> Mark All Read
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 animate-in">
        {[
          { label: 'Critical Alerts', value: allNotifications.filter(n => n.type === 'danger').length, color: 'var(--color-danger)', icon: AlertTriangle },
          { label: 'Warnings', value: allNotifications.filter(n => n.type === 'warning').length, color: 'var(--color-warning)', icon: Clock },
          { label: 'Delayed Projects', value: delayedProjects.length, color: 'var(--color-warning)', icon: AlertTriangle },
          { label: 'High Risk Staff', value: highRisk.length, color: 'var(--color-danger)', icon: Bell },
        ].map((kpi, i) => (
          <div key={i} className="card p-4 glow-ring flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${kpi.color} 12%, transparent)` }}>
              <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} strokeWidth={1.8} />
            </div>
            <div>
              <div className="text-[20px] font-bold text-[var(--color-text-primary)] leading-tight">{kpi.value}</div>
              <div className="text-[11px] text-[var(--color-text-tertiary)]">{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 animate-in">
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all ${filter === f.key ? 'bg-white/[0.08] text-[var(--color-text-primary)] border border-white/10' : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-white/[0.03] border border-transparent'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-2 stagger">
        {visibleNotifs.map(n => (
          <div key={n.id} className={`card px-5 py-4 flex items-start gap-4 border-l-[3px] animate-in ${typeBg(n.type)}`}>
            <div className="mt-0.5 shrink-0">{typeIcon(n.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-[var(--color-text-primary)]">{n.title}</div>
              <div className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">{n.subtitle}</div>
            </div>
            <span className="text-[10px] text-[var(--color-text-tertiary)] whitespace-nowrap shrink-0">{n.time}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setDismissed(prev => new Set([...prev, n.id])); }}
              className="p-1 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] hover:bg-white/[0.04] transition-colors shrink-0"
              title="Dismiss"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {visibleNotifs.length === 0 && (
          <div className="card p-12 text-center animate-in">
            <CheckCircle className="w-10 h-10 text-[var(--color-positive)] mx-auto mb-3 opacity-50" />
            <div className="text-[14px] font-medium text-[var(--color-text-secondary)]">All clear!</div>
            <div className="text-[12px] text-[var(--color-text-tertiary)] mt-1">No notifications in this category</div>
          </div>
        )}
      </div>
    </div>
  );
}
