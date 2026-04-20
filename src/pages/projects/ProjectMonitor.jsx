import { useState } from 'react';
import {
  MapPin, Calendar, AlertTriangle, Truck, ShieldCheck, TrendingUp, ChevronDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { projects, employees } from '../../data/seed';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-[11px] shadow-xl shadow-black/30">
      <div className="font-semibold text-[var(--color-text-primary)] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="text-[var(--color-text-secondary)]">{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function ProjectMonitor() {
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = statusFilter === 'All' ? projects : projects.filter(p => p.status === statusFilter);

  const statuses = ['All', 'On Track', 'Delayed', 'Critical', 'Completed'];
  const statusColor = (s) => s === 'On Track' ? 'pill-positive' : s === 'Delayed' ? 'pill-warning' : s === 'Critical' ? 'pill-danger' : s === 'Completed' ? 'pill-info' : 'pill-neutral';

  const laborData = projects.map(p => ({ name: p.name.split(' ').slice(0, 2).join(' '), labor: p.laborProductivity }));

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between animate-in">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Project Monitor</h1>
          <p className="text-[13px] text-[var(--color-text-tertiary)] mt-0.5">{projects.length} construction sites tracked</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 animate-in">
        {statuses.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all ${statusFilter === s ? 'bg-white/[0.08] text-[var(--color-text-primary)] border border-white/10' : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-white/[0.03] border border-transparent'}`}>
            {s}
            {s !== 'All' && <span className="ml-1.5 text-[10px] opacity-70">({projects.filter(p => s === 'All' || p.status === s).length})</span>}
          </button>
        ))}
      </div>

      {/* Labor Productivity Chart */}
      <div className="card p-5 animate-in">
        <h2 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Labor Productivity by Site</h2>
        <p className="text-[11px] text-[var(--color-text-tertiary)] mb-3">Percentage efficiency of on-site workforce</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={laborData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={18}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} />
            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="labor" name="Productivity %" radius={[5, 5, 0, 0]}>
              {laborData.map((d, i) => (
                <Cell key={i} fill={d.labor >= 80 ? 'var(--color-positive)' : d.labor >= 60 ? 'var(--color-warning)' : 'var(--color-danger)'} fillOpacity={0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 stagger">
        {filtered.map(project => (
          <div key={project.id} className="card p-5 glow-ring animate-in">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">{project.name}</h3>
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-tertiary)] mt-1">
                  <MapPin className="w-3 h-3" /> {project.location}
                </div>
              </div>
              <span className={`pill ${statusColor(project.status)}`}>{project.status}</span>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-[var(--color-text-tertiary)]">Progress</span>
                <span className="font-semibold text-[var(--color-text-primary)]">{project.progressPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--color-surface-500)] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{
                  width: `${project.progressPct}%`,
                  background: project.status === 'Critical' ? 'var(--color-danger)' : project.status === 'Delayed' ? 'var(--color-warning)' : 'var(--color-positive)'
                }} />
              </div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">{project.milestonesCompleted}/{project.totalMilestones} milestones</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--color-border)]">
              <div>
                <div className="text-[10px] text-[var(--color-text-tertiary)]">Budget</div>
                <div className="text-[13px] font-semibold text-[var(--color-text-primary)]">₹{project.budget}Cr</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--color-text-tertiary)]">Spent</div>
                <div className={`text-[13px] font-semibold ${project.spent > project.budget ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-primary)]'}`}>₹{project.spent}Cr</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--color-text-tertiary)]">Labor Prod.</div>
                <div className="text-[13px] font-semibold text-[var(--color-text-primary)]">{project.laborProductivity}%</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--color-text-tertiary)]">Safety</div>
                <div className={`text-[13px] font-semibold ${project.safetyIncidents > 2 ? 'text-[var(--color-danger)]' : 'text-[var(--color-positive)]'}`}>{project.safetyIncidents} incidents</div>
              </div>
            </div>

            {/* Material Delay Alert */}
            {project.materialDelay && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-danger)]/[0.08] border border-[var(--color-danger)]/20">
                <Truck className="w-3.5 h-3.5 text-[var(--color-danger)]" />
                <span className="text-[11px] text-[var(--color-danger)] font-medium">Material delayed by {project.materialDelay}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
