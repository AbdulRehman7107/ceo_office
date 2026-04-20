import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, Calendar, IndianRupee, TrendingUp, Clock,
  Award, Target, Zap, ChevronRight, Briefcase
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { employees, projects } from '../../data/seed';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-[11px] shadow-xl shadow-black/30">
      <div className="font-semibold text-[var(--color-text-primary)] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[var(--color-text-secondary)]">{p.name}: {p.value}</span>
        </div>
      ))}
    </div>
  );
};

function ProgressRing({ value, size = 80, stroke = 6, color = 'var(--color-accent-400)' }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--color-surface-600)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        className="progress-ring-circle" />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        fill="var(--color-text-primary)" fontSize="18" fontWeight="800">{value}%</text>
    </svg>
  );
}

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const emp = employees.find(e => e.id === id);
  if (!emp) return <div className="p-10 text-center text-[var(--color-text-tertiary)]">Employee not found.</div>;

  const manager = employees.find(e => e.id === emp.reportingManagerId);
  const directReports = employees.filter(e => e.reportingManagerId === emp.id);
  const assignedProjects = projects.filter(p => emp.assignedProjectIds.includes(p.id));

  const salaryData = emp.salaryHistory.map(s => ({ year: String(s.year), salary: Math.round(s.amount / 1000) }));

  const effColor = emp.efficiencyRating === 'A' ? 'var(--color-positive)' : emp.efficiencyRating === 'B' ? 'var(--color-info)' : emp.efficiencyRating === 'C' ? 'var(--color-warning)' : 'var(--color-danger)';

  return (
    <div className="space-y-5">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[13px] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors animate-in">
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </button>

      {/* ═══ PROFILE HEADER — Split layout ═══ */}
      <div className="card overflow-hidden animate-in">
        <div className="relative h-28 bg-gradient-to-r from-[var(--color-surface-700)] via-[var(--color-surface-600)] to-[var(--color-surface-700)]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9zdmc+')] opacity-60" />
        </div>
        <div className="px-6 pb-5 -mt-10 flex items-end gap-5">
          <img src={emp.avatar} alt={emp.name} className="w-20 h-20 rounded-2xl border-4 border-[var(--color-card)] bg-[var(--color-surface-600)] shadow-lg" />
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-bold" style={{ fontFamily: 'var(--font-display)' }}>{emp.name}</h1>
              <span className="pill" style={{ background: `color-mix(in srgb, ${effColor} 15%, transparent)`, color: effColor }}>
                Grade {emp.efficiencyRating}
              </span>
              {emp.promotionEligible && <span className="pill pill-positive">Promotion Ready</span>}
              {emp.incentiveEligible && <span className="pill pill-warning">Incentive Eligible</span>}
            </div>
            <p className="text-[13px] text-[var(--color-text-secondary)] mt-0.5">{emp.role} · {emp.department}</p>
          </div>
          <div className="text-right pb-1">
            <div className="text-[11px] text-[var(--color-text-tertiary)]">Employee ID</div>
            <div className="text-[13px] font-semibold font-mono text-[var(--color-text-secondary)]">{emp.id}</div>
          </div>
        </div>
      </div>

      {/* ═══ BENTO METRICS ═══ */}
      <div className="bento-grid">

        {/* Quick Stats */}
        <div className="span-3 card p-5 flex flex-col items-center justify-center text-center animate-in">
          <ProgressRing value={emp.productivityScore} color={effColor} />
          <div className="text-[12px] font-medium text-[var(--color-text-secondary)] mt-3">Productivity Score</div>
        </div>

        <div className="span-3 card p-5 animate-in">
          <div className="space-y-4">
            {[
              { label: 'Attendance', value: `${emp.attendancePct}%`, icon: Calendar, color: 'var(--color-info)' },
              { label: 'Overtime', value: `${emp.overtimeHours}h/mo`, icon: Clock, color: 'var(--color-warning)' },
              { label: 'Pending Tasks', value: emp.pendingTasks, icon: Target, color: 'var(--color-danger)' },
              { label: 'Milestones Done', value: emp.completedMilestones, icon: Award, color: 'var(--color-positive)' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)` }}>
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <div className="flex-1 text-[11px] text-[var(--color-text-tertiary)]">{s.label}</div>
                <div className="text-[13px] font-semibold text-[var(--color-text-primary)]">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="span-6 card p-5 animate-in">
          <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Monthly Performance</h3>
          <p className="text-[11px] text-[var(--color-text-tertiary)] mb-3">Productivity trend over 12 months</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={emp.monthlyScores} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="empGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={effColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={effColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} />
              <YAxis domain={[30, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="productivity" name="Productivity" stroke={effColor} fill="url(#empGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Salary History */}
        <div className="span-5 card p-5 animate-in">
          <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Salary History</h3>
          <p className="text-[11px] text-[var(--color-text-tertiary)] mb-3">Annual compensation (₹K)</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={salaryData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }} barSize={28}>
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="salary" name="Salary (₹K)" radius={[6, 6, 0, 0]}>
                {salaryData.map((_, i) => <Cell key={i} fill={i === salaryData.length - 1 ? 'var(--color-accent-400)' : 'var(--color-surface-400)'} fillOpacity={i === salaryData.length - 1 ? 0.8 : 0.5} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Summary */}
        <div className="span-3 card p-5 animate-in">
          <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Financial</h3>
          <div className="space-y-4">
            <div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wide">Current Salary</div>
              <div className="text-[18px] font-bold text-[var(--color-text-primary)] mt-0.5">₹{(emp.currentSalary / 100000).toFixed(1)}L</div>
            </div>
            <div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wide">Last Increment</div>
              <div className="text-[13px] font-medium text-[var(--color-text-secondary)] mt-0.5">{emp.lastIncrementDate}</div>
            </div>
            <div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wide">Recommended</div>
              <div className="text-[16px] font-bold text-[var(--color-positive)] mt-0.5">+{emp.recommendedIncrementPct}%</div>
            </div>
          </div>
        </div>

        {/* Reporting Manager + Direct Reports */}
        <div className="span-4 card p-5 animate-in">
          <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Reporting Chain</h3>
          {manager && (
            <div className="mb-4">
              <div className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wide mb-2">Reports To</div>
              <button onClick={() => navigate(`/employees/${manager.id}`)} className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-[var(--color-border)] hover:bg-white/[0.05] transition-colors text-left">
                <img src={manager.avatar} alt="" className="w-8 h-8 rounded-full bg-[var(--color-surface-600)]" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-[var(--color-text-primary)] truncate">{manager.name}</div>
                  <div className="text-[10px] text-[var(--color-text-tertiary)]">{manager.role}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--color-text-tertiary)]" />
              </button>
            </div>
          )}
          {directReports.length > 0 && (
            <div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wide mb-2">Direct Reports ({directReports.length})</div>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                {directReports.map(r => (
                  <button key={r.id} onClick={() => navigate(`/employees/${r.id}`)} className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/[0.03] transition-colors text-left">
                    <img src={r.avatar} alt="" className="w-6 h-6 rounded-full bg-[var(--color-surface-600)]" />
                    <div className="text-[11px] text-[var(--color-text-secondary)] truncate flex-1">{r.name}</div>
                    <span className="text-[10px] text-[var(--color-text-tertiary)]">{r.productivityScore}%</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Assigned Projects */}
        <div className="span-8 card p-5 animate-in">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-[var(--color-accent-400)]" />
            <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>Assigned Projects</h3>
          </div>
          {assignedProjects.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {assignedProjects.map(p => (
                <div key={p.id} className="p-3 rounded-xl bg-white/[0.02] border border-[var(--color-border)]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[12px] font-medium text-[var(--color-text-primary)]">{p.name}</div>
                    <span className={`pill ${p.status === 'On Track' ? 'pill-positive' : p.status === 'Delayed' ? 'pill-warning' : p.status === 'Critical' ? 'pill-danger' : 'pill-info'} text-[9px]`}>{p.status}</span>
                  </div>
                  <div className="text-[10px] text-[var(--color-text-tertiary)] mb-2">{p.location}</div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--color-surface-500)] overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--color-accent-400)]" style={{ width: `${p.progressPct}%` }} />
                  </div>
                  <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">{p.milestonesCompleted}/{p.totalMilestones} milestones · {p.progressPct}%</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[12px] text-[var(--color-text-tertiary)] text-center py-6">No projects assigned at this level</div>
          )}
        </div>
      </div>
    </div>
  );
}
