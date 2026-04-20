import { useNavigate } from 'react-router-dom';
import {
  Users, FolderKanban, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight,
  Award, ShieldAlert, Zap, Clock, IndianRupee, Target
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell, PieChart, Pie
} from 'recharts';
import {
  totalEmployees, activeProjects, delayedProjects, avgProductivity, avgAttendance,
  topPerformers, highRisk, departmentStats, monthlyTrend, hierarchyStats,
  promotionReady, incentiveEligible, notifications, projects
} from '../../data/seed';

/* Custom recharts tooltip */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-[11px] shadow-xl shadow-black/30 border-[var(--color-border)]">
      <div className="font-semibold text-[var(--color-text-primary)] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[var(--color-text-secondary)]">{p.name}: {p.value}%</span>
        </div>
      ))}
    </div>
  );
};

/* Circular progress ring */
function ProgressRing({ value, size = 56, stroke = 5, color = 'var(--color-accent-400)' }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--color-surface-600)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        className="progress-ring-circle" />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        fill="var(--color-text-primary)" fontSize="13" fontWeight="700">{value}%</text>
    </svg>
  );
}

export default function Overview() {
  const navigate = useNavigate();

  const kpis = [
    { label: 'Total Workforce', value: totalEmployees, icon: Users, trend: '+12', up: true, color: 'var(--color-info)' },
    { label: 'Active Projects', value: activeProjects.length, icon: FolderKanban, trend: `${delayedProjects.length} delayed`, up: false, color: 'var(--color-accent-400)' },
    { label: 'Avg. Productivity', value: `${avgProductivity}%`, icon: Zap, trend: '+3.2%', up: true, color: 'var(--color-positive)' },
    { label: 'Avg. Attendance', value: `${avgAttendance}%`, icon: Clock, trend: '-1.1%', up: false, color: 'var(--color-warning)' },
  ];

  const radarData = departmentStats.slice(0, 6).map(d => ({
    dept: d.name.split(' ')[0],
    productivity: d.avgProductivity,
    attendance: d.avgAttendance,
  }));

  const projectPie = [
    { name: 'On Track', value: projects.filter(p => p.status === 'On Track').length, color: '#34d399' },
    { name: 'Delayed', value: projects.filter(p => p.status === 'Delayed').length, color: '#fbbf24' },
    { name: 'Critical', value: projects.filter(p => p.status === 'Critical').length, color: '#f87171' },
    { name: 'Completed', value: projects.filter(p => p.status === 'Completed').length, color: '#60a5fa' },
  ];

  return (
    <div className="space-y-5 stagger">

      {/* Greeting */}
      <div className="flex items-end justify-between animate-in">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, Raj
          </h1>
          <p className="text-[13px] text-[var(--color-text-tertiary)] mt-0.5">
            Here's your organizational pulse for {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="pill pill-info" onClick={() => navigate('/reports')}>
            <BarChart3Icon /> Quarterly Report
          </button>
        </div>
      </div>

      {/* ═══ KPI STRIP ═══ */}
      <div className="grid grid-cols-4 gap-4 animate-in">
        {kpis.map((kpi, i) => (
          <div key={i} className="card p-4 glow-ring flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${kpi.color} 12%, transparent)` }}>
              <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wide">{kpi.label}</div>
              <div className="text-[20px] font-bold text-[var(--color-text-primary)] leading-tight mt-0.5">{kpi.value}</div>
            </div>
            <div className={`flex items-center gap-0.5 text-[11px] font-semibold ${kpi.up ? 'text-[var(--color-positive)]' : 'text-[var(--color-danger)]'}`}>
              {kpi.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ BENTO GRID — ASYMMETRIC LAYOUT ═══ */}
      <div className="bento-grid">

        {/* ── Productivity Trend (large) ── */}
        <div className="span-8 card p-6 animate-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>Performance Trend</h2>
              <p className="text-[13px] text-[var(--color-text-tertiary)] mt-0.5">Company-wide monthly averages</p>
            </div>
            <div className="flex gap-4 text-[12px]">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent-400)]" /> Productivity</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[var(--color-info)]" /> Attendance</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradProd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accent-400)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-accent-400)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradAtt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-info)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--color-info)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }} />
              <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="productivity" name="Productivity" stroke="var(--color-accent-400)" fill="url(#gradProd)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="attendance" name="Attendance" stroke="var(--color-info)" fill="url(#gradAtt)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Project Status Breakdown (small) ── */}
        <div className="span-4 card p-6 animate-in flex flex-col">
          <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>Project Status</h2>
          <p className="text-[13px] text-[var(--color-text-tertiary)] mt-0.5 mb-3">{projects.length} total projects</p>
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={projectPie} dataKey="value" innerRadius={60} outerRadius={85} paddingAngle={3} strokeWidth={0}>
                  {projectPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {projectPie.map(p => (
              <div key={p.name} className="flex items-center gap-2 text-[12px] text-[var(--color-text-secondary)]">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.color }} />
                {p.name} ({p.value})
              </div>
            ))}
          </div>
        </div>

        {/* ── Department Radar ── */}
        <div className="span-6 card p-6 animate-in">
          <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Department Intelligence</h2>
          <p className="text-[13px] text-[var(--color-text-tertiary)] mb-4">Cross-department comparison</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData} outerRadius={90}>
              <PolarGrid stroke="var(--color-surface-500)" />
              <PolarAngleAxis dataKey="dept" tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Productivity" dataKey="productivity" stroke="var(--color-accent-400)" fill="var(--color-accent-400)" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Attendance" dataKey="attendance" stroke="var(--color-positive)" fill="var(--color-positive)" fillOpacity={0.1} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Hierarchy Bar Chart ── */}
        <div className="span-6 card p-6 animate-in">
          <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Hierarchy Performance</h2>
          <p className="text-[13px] text-[var(--color-text-tertiary)] mb-4">Average productivity by designation</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hierarchyStats} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={24}>
              <XAxis dataKey="role" axisLine={false} tickLine={false}
                tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }}
                tickFormatter={v => v.split(' ').slice(0,2).join(' ')} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="avgProductivity" name="Productivity" radius={[6, 6, 0, 0]}>
                {hierarchyStats.map((entry, i) => (
                  <Cell key={i} fill={entry.avgProductivity >= 75 ? 'var(--color-positive)' : entry.avgProductivity >= 60 ? 'var(--color-warning)' : 'var(--color-danger)'} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Quick Stats Row ── */}
        <div className="span-4 card p-6 animate-in flex flex-col justify-between">
          <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-5" style={{ fontFamily: 'var(--font-display)' }}>Key Indicators</h2>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <ProgressRing value={avgProductivity} color="var(--color-accent-400)" size={64} />
              <div>
                <div className="text-[14px] font-medium text-[var(--color-text-secondary)]">Org Productivity</div>
                <div className="text-[12px] text-[var(--color-text-tertiary)]">Target: 80%</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ProgressRing value={avgAttendance} color="var(--color-info)" size={64} />
              <div>
                <div className="text-[14px] font-medium text-[var(--color-text-secondary)]">Org Attendance</div>
                <div className="text-[12px] text-[var(--color-text-tertiary)]">Target: 90%</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ProgressRing value={Math.round((promotionReady.length / totalEmployees) * 100)} color="var(--color-positive)" size={64} />
              <div>
                <div className="text-[14px] font-medium text-[var(--color-text-secondary)]">Promotion Ready</div>
                <div className="text-[12px] text-[var(--color-text-tertiary)]">{promotionReady.length} employees</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Top Performers ── */}
        <div className="span-4 card p-6 animate-in">
          <div className="flex items-center gap-2 mb-5">
            <Award className="w-5 h-5 text-[var(--color-accent-400)]" />
            <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>Top Performers</h2>
          </div>
          <div className="space-y-3">
            {topPerformers.slice(0, 5).map((emp, i) => (
              <button key={emp.id} onClick={() => navigate(`/employees/${emp.id}`)} className="w-full flex items-center gap-4 p-2 rounded-xl hover:bg-white/[0.03] transition-colors text-left">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold" style={{
                  background: i === 0 ? 'linear-gradient(135deg, #f5c842, #e5a617)' : i === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)' : i === 2 ? 'linear-gradient(135deg, #cd7f32, #a0522d)' : 'var(--color-surface-600)',
                  color: i < 3 ? '#000' : 'var(--color-text-secondary)'
                }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-[var(--color-text-primary)] truncate">{emp.name}</div>
                  <div className="text-[12px] text-[var(--color-text-tertiary)]">{emp.role}</div>
                </div>
                <span className="text-[14px] font-bold text-[var(--color-positive)]">{emp.productivityScore}%</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── High Risk Employees ── */}
        <div className="span-4 card p-6 animate-in">
          <div className="flex items-center gap-2 mb-5">
            <ShieldAlert className="w-5 h-5 text-[var(--color-danger)]" />
            <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>High Risk</h2>
          </div>
          <div className="space-y-3">
            {highRisk.slice(0, 5).map((emp) => (
              <button key={emp.id} onClick={() => navigate(`/employees/${emp.id}`)} className="w-full flex items-center gap-4 p-2 rounded-xl hover:bg-white/[0.03] transition-colors text-left">
                <img src={emp.avatar} alt="" className="w-9 h-9 rounded-full bg-[var(--color-surface-600)]" />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-[var(--color-text-primary)] truncate">{emp.name}</div>
                  <div className="text-[12px] text-[var(--color-text-tertiary)]">{emp.role}</div>
                </div>
                <span className="pill pill-danger text-[12px] px-3 py-1">{emp.efficiencyRating}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Live Alerts Feed ── */}
        <div className="span-12 card p-6 animate-in">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>Recent Alerts</h2>
            <span className="pill pill-danger px-3 py-1 text-[12px]">{notifications.length} active</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {notifications.slice(0, 6).map(n => (
              <div key={n.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-[var(--color-border)] hover:bg-white/[0.04] transition-colors">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                  n.type === 'danger' ? 'bg-[var(--color-danger)]' :
                  n.type === 'warning' ? 'bg-[var(--color-warning)]' :
                  n.type === 'positive' ? 'bg-[var(--color-positive)]' : 'bg-[var(--color-info)]'
                }`} />
                <div className="min-w-0">
                  <div className="text-[14px] font-medium text-[var(--color-text-primary)] leading-snug">{n.title}</div>
                  <div className="text-[12px] text-[var(--color-text-tertiary)] mt-1">{n.subtitle} · {n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* Inline icon helper for the button */
function BarChart3Icon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>;
}
