import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, TrendingUp, TrendingDown, Users, Award, ShieldAlert, Download,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, ScatterChart, Scatter, ZAxis
} from 'recharts';
import {
  employees, departmentStats, hierarchyStats, monthlyTrend,
  topPerformers, highRisk, totalEmployees, avgProductivity, avgAttendance,
  promotionReady, incrementEligible
} from '../../data/seed';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-[11px] shadow-xl shadow-black/30">
      <div className="font-semibold text-[var(--color-text-primary)] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-[var(--color-text-secondary)]">{p.name}: {p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Reports() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('quarterly');

  /* Efficiency distribution for histogram */
  const effDist = [
    { grade: 'A', count: employees.filter(e => e.efficiencyRating === 'A').length, color: 'var(--color-positive)' },
    { grade: 'B', count: employees.filter(e => e.efficiencyRating === 'B').length, color: 'var(--color-info)' },
    { grade: 'C', count: employees.filter(e => e.efficiencyRating === 'C').length, color: 'var(--color-warning)' },
    { grade: 'F', count: employees.filter(e => e.efficiencyRating === 'F').length, color: 'var(--color-danger)' },
  ];

  /* Scatter: productivity vs attendance */
  const scatterData = employees.filter(e => e.level > 0).map(e => ({
    name: e.name,
    productivity: e.productivityScore,
    attendance: e.attendancePct,
    salary: e.currentSalary / 100000,
    efficiency: e.efficiencyRating,
  }));

  /* Workload distribution */
  const workloadDist = ['Balanced', 'Heavy', 'Light', 'Critical'].map(w => ({
    status: w,
    count: employees.filter(e => e.workloadStatus === w).length,
  }));

  /* Overtime by hierarchy */
  const overtimeByRole = hierarchyStats.map(h => {
    const roleEmps = employees.filter(e => e.role === h.role);
    return {
      role: h.role.split(' ').slice(0, 2).join(' '),
      avgOvertime: roleEmps.length > 0 ? Math.round(roleEmps.reduce((s, e) => s + e.overtimeHours, 0) / roleEmps.length) : 0,
    };
  });

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between animate-in">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Reports & Analytics</h1>
          <p className="text-[13px] text-[var(--color-text-tertiary)] mt-0.5">Deep organizational intelligence & decision support</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-[var(--color-border)]">
            {['monthly', 'quarterly', 'annual'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase transition-colors ${period === p ? 'bg-white/[0.07] text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)] hover:bg-white/[0.03]'}`}>
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)] hover:bg-white/[0.06] transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* ═══ Summary KPIs ═══ */}
      <div className="grid grid-cols-5 gap-3 animate-in">
        {[
          { label: 'Headcount', value: totalEmployees, sub: '12 designations', icon: Users, color: 'var(--color-info)' },
          { label: 'Avg Productivity', value: `${avgProductivity}%`, sub: 'Target: 80%', icon: TrendingUp, color: avgProductivity >= 80 ? 'var(--color-positive)' : 'var(--color-warning)' },
          { label: 'Avg Attendance', value: `${avgAttendance}%`, sub: 'Target: 90%', icon: BarChart3, color: avgAttendance >= 90 ? 'var(--color-positive)' : 'var(--color-warning)' },
          { label: 'High Risk', value: highRisk.length, sub: 'Needs attention', icon: ShieldAlert, color: 'var(--color-danger)' },
          { label: 'Top Performers', value: topPerformers.length, sub: 'Grade A · 90%+ att.', icon: Award, color: 'var(--color-positive)' },
        ].map((kpi, i) => (
          <div key={i} className="card p-4 animate-in">
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
            </div>
            <div className="text-[20px] font-bold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>{kpi.value}</div>
            <div className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">{kpi.label}</div>
            <div className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5 opacity-60">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="bento-grid">

        {/* ── Efficiency Grade Distribution ── */}
        <div className="span-4 card p-5 animate-in">
          <h2 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Efficiency Distribution</h2>
          <p className="text-[11px] text-[var(--color-text-tertiary)] mb-4">Employee count by performance grade</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={effDist} margin={{ top: 5, right: 5, left: -15, bottom: 0 }} barSize={36}>
              <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--color-text-secondary)', fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" name="Employees" radius={[8, 8, 0, 0]}>
                {effDist.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.7} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Workload Distribution ── */}
        <div className="span-4 card p-5 animate-in">
          <h2 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Workload Distribution</h2>
          <p className="text-[11px] text-[var(--color-text-tertiary)] mb-4">How work is spread across the workforce</p>
          <div className="space-y-3 mt-2">
            {workloadDist.map(w => {
              const pct = Math.round((w.count / totalEmployees) * 100);
              const color = w.status === 'Critical' ? 'var(--color-danger)' : w.status === 'Heavy' ? 'var(--color-warning)' : w.status === 'Light' ? 'var(--color-info)' : 'var(--color-positive)';
              return (
                <div key={w.status}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[var(--color-text-secondary)] font-medium">{w.status}</span>
                    <span className="text-[var(--color-text-tertiary)]">{w.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--color-surface-500)] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color, opacity: 0.7 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Overtime by Hierarchy ── */}
        <div className="span-4 card p-5 animate-in">
          <h2 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Overtime by Role</h2>
          <p className="text-[11px] text-[var(--color-text-tertiary)] mb-3">Average monthly hours per designation</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={overtimeByRole} layout="vertical" margin={{ top: 5, right: 15, left: 5, bottom: 0 }} barSize={12}>
              <YAxis type="category" dataKey="role" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} width={75} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="avgOvertime" name="Avg Overtime (h)" radius={[0, 6, 6, 0]}>
                {overtimeByRole.map((d, i) => (
                  <Cell key={i} fill={d.avgOvertime > 25 ? 'var(--color-danger)' : d.avgOvertime > 15 ? 'var(--color-warning)' : 'var(--color-info)'} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Department Rankings ── */}
        <div className="span-6 card p-5 animate-in">
          <h2 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Department Rankings</h2>
          <p className="text-[11px] text-[var(--color-text-tertiary)] mb-3">Ranked by composite performance score</p>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Department</th>
                  <th>Headcount</th>
                  <th>Productivity</th>
                  <th>Attendance</th>
                  <th>Total OT</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.sort((a, b) => b.avgProductivity - a.avgProductivity).map((dept, i) => (
                  <tr key={dept.name}>
                    <td>
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${
                        i === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black' :
                        i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                        i === 2 ? 'bg-gradient-to-br from-amber-700 to-amber-900 text-white' :
                        'bg-[var(--color-surface-600)] text-[var(--color-text-tertiary)]'
                      }`}>{i + 1}</span>
                    </td>
                    <td className="text-[12px] font-medium text-[var(--color-text-primary)]">{dept.name}</td>
                    <td className="text-[12px]">{dept.headcount}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 rounded-full bg-[var(--color-surface-500)] overflow-hidden">
                          <div className="h-full rounded-full" style={{
                            width: `${dept.avgProductivity}%`,
                            background: dept.avgProductivity >= 75 ? 'var(--color-positive)' : dept.avgProductivity >= 60 ? 'var(--color-warning)' : 'var(--color-danger)'
                          }} />
                        </div>
                        <span className="text-[11px] font-semibold">{dept.avgProductivity}%</span>
                      </div>
                    </td>
                    <td className="text-[12px]">{dept.avgAttendance}%</td>
                    <td className="text-[12px]">{dept.totalOvertime}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Employee Ranking — Top 10 ── */}
        <div className="span-6 card p-5 animate-in">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[14px] font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>Employee Power Ranking</h2>
              <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">Top 10 by composite score</p>
            </div>
          </div>
          <div className="space-y-2">
            {topPerformers.slice(0, 10).map((emp, i) => (
              <button key={emp.id} onClick={() => navigate(`/employees/${emp.id}`)}
                className="w-full flex items-center gap-3 py-2 px-2.5 rounded-xl hover:bg-white/[0.03] transition-colors text-left">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  i === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black' :
                  i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                  i === 2 ? 'bg-gradient-to-br from-amber-700 to-amber-900 text-white' :
                  'bg-[var(--color-surface-600)] text-[var(--color-text-tertiary)]'
                }`}>{i + 1}</span>
                <img src={emp.avatar} alt="" className="w-7 h-7 rounded-full bg-[var(--color-surface-600)]" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-[var(--color-text-primary)] truncate">{emp.name}</div>
                  <div className="text-[10px] text-[var(--color-text-tertiary)]">{emp.role} · {emp.department}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[13px] font-bold text-[var(--color-positive)]">{emp.productivityScore}%</div>
                  <div className="text-[10px] text-[var(--color-text-tertiary)]">Att: {emp.attendancePct}%</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Performance Heatmap (monthly by department) ── */}
        <div className="span-12 card p-5 animate-in">
          <h2 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Performance Heatmap</h2>
          <p className="text-[11px] text-[var(--color-text-tertiary)] mb-4">Department productivity across months (hover to inspect)</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] pr-4 pb-2 w-40">Department</th>
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
                    <th key={m} className="text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] pb-2 px-1">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {departmentStats.map(dept => {
                  const deptEmps = employees.filter(e => e.department === dept.name);
                  return (
                    <tr key={dept.name}>
                      <td className="text-[11px] font-medium text-[var(--color-text-secondary)] pr-4 py-1">{dept.name}</td>
                      {Array.from({ length: 12 }, (_, mi) => {
                        const avgProd = Math.round(deptEmps.reduce((s, e) => s + e.monthlyScores[mi].productivity, 0) / deptEmps.length);
                        const opacity = Math.max(0.12, (avgProd - 40) / 60);
                        const color = avgProd >= 80 ? `rgba(52,211,153,${opacity})` : avgProd >= 65 ? `rgba(251,191,36,${opacity})` : `rgba(248,113,113,${opacity})`;
                        return (
                          <td key={mi} className="px-1 py-1">
                            <div
                              className="w-full h-7 rounded flex items-center justify-center text-[9px] font-semibold cursor-default transition-transform hover:scale-110"
                              style={{ background: color, color: avgProd >= 80 ? 'var(--color-positive)' : avgProd >= 65 ? 'var(--color-warning)' : 'var(--color-danger)' }}
                              title={`${dept.name} - ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][mi]}: ${avgProd}%`}
                            >
                              {avgProd}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
