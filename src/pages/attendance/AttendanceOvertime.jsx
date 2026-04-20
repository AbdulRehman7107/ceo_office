import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Calendar, TrendingUp, AlertTriangle, ChevronDown,
  ArrowUpDown, Timer, Coffee, Moon
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area, PieChart, Pie
} from 'recharts';
import { employees, DEPARTMENTS, HIERARCHY } from '../../data/seed';

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

export default function AttendanceOvertime() {
  const navigate = useNavigate();
  const [deptFilter, setDeptFilter] = useState('All');
  const [sortField, setSortField] = useState('attendancePct');
  const [sortDir, setSortDir] = useState('desc');

  const allEmps = employees.filter(e => e.level > 0);
  const filtered = useMemo(() => {
    let result = deptFilter === 'All' ? allEmps : allEmps.filter(e => e.department === deptFilter);
    result.sort((a, b) => sortDir === 'desc' ? b[sortField] - a[sortField] : a[sortField] - b[sortField]);
    return result;
  }, [deptFilter, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortField(field); setSortDir('desc'); }
  };

  /* Summary stats */
  const avgAtt = Math.round(allEmps.reduce((s, e) => s + e.attendancePct, 0) / allEmps.length);
  const avgOT = Math.round(allEmps.reduce((s, e) => s + e.overtimeHours, 0) / allEmps.length);
  const lowAttCount = allEmps.filter(e => e.attendancePct < 75).length;
  const highOTCount = allEmps.filter(e => e.overtimeHours > 30).length;

  /* Attendance distribution */
  const attBuckets = [
    { range: '95-100%', count: allEmps.filter(e => e.attendancePct >= 95).length, color: 'var(--color-positive)' },
    { range: '85-94%', count: allEmps.filter(e => e.attendancePct >= 85 && e.attendancePct < 95).length, color: 'var(--color-info)' },
    { range: '75-84%', count: allEmps.filter(e => e.attendancePct >= 75 && e.attendancePct < 85).length, color: 'var(--color-warning)' },
    { range: '<75%', count: allEmps.filter(e => e.attendancePct < 75).length, color: 'var(--color-danger)' },
  ];

  /* Overtime by department */
  const overtimeByDept = DEPARTMENTS.map(d => {
    const deptEmps = allEmps.filter(e => e.department === d);
    return {
      dept: d.split(' ')[0],
      avgOT: deptEmps.length > 0 ? Math.round(deptEmps.reduce((s, e) => s + e.overtimeHours, 0) / deptEmps.length) : 0,
      total: deptEmps.reduce((s, e) => s + e.overtimeHours, 0),
    };
  }).sort((a, b) => b.avgOT - a.avgOT);

  /* Monthly attendance trend (company-wide) */
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const attTrend = months.map((m, i) => ({
    month: m,
    attendance: Math.round(allEmps.reduce((s, e) => s + e.monthlyScores[i].attendance, 0) / allEmps.length),
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between animate-in">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Attendance & Overtime</h1>
          <p className="text-[13px] text-[var(--color-text-tertiary)] mt-0.5">Monitor punctuality, absenteeism, and overtime patterns</p>
        </div>
      </div>

      {/* ═══ KPI Cards ═══ */}
      <div className="grid grid-cols-4 gap-4 animate-in">
        {[
          { label: 'Avg Attendance', value: `${avgAtt}%`, icon: Calendar, color: avgAtt >= 85 ? 'var(--color-positive)' : 'var(--color-warning)', sub: 'Company-wide' },
          { label: 'Avg Overtime', value: `${avgOT}h/mo`, icon: Clock, color: 'var(--color-info)', sub: 'Per employee' },
          { label: 'Low Attendance', value: lowAttCount, icon: AlertTriangle, color: 'var(--color-danger)', sub: 'Below 75%' },
          { label: 'High Overtime', value: highOTCount, icon: Moon, color: 'var(--color-warning)', sub: 'Over 30h/mo' },
        ].map((kpi, i) => (
          <div key={i} className="card p-4 glow-ring flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${kpi.color} 12%, transparent)` }}>
              <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} strokeWidth={1.8} />
            </div>
            <div>
              <div className="text-[20px] font-bold text-[var(--color-text-primary)] leading-tight">{kpi.value}</div>
              <div className="text-[11px] text-[var(--color-text-tertiary)]">{kpi.label} · {kpi.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bento-grid">

        {/* ── Attendance Trend ── */}
        <div className="span-8 card p-5 animate-in">
          <h2 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Monthly Attendance Trend</h2>
          <p className="text-[11px] text-[var(--color-text-tertiary)] mb-3">Company-wide average over 12 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={attTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-info)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-info)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} />
              <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="attendance" name="Attendance" stroke="var(--color-info)" fill="url(#attGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Attendance Distribution ── */}
        <div className="span-4 card p-5 animate-in">
          <h2 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Attendance Distribution</h2>
          <p className="text-[11px] text-[var(--color-text-tertiary)] mb-4">Employee count by attendance bracket</p>
          <div className="space-y-3">
            {attBuckets.map(b => {
              const pct = Math.round((b.count / allEmps.length) * 100);
              return (
                <div key={b.range}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-medium" style={{ color: b.color }}>{b.range}</span>
                    <span className="text-[var(--color-text-tertiary)]">{b.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[var(--color-surface-500)] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: b.color, opacity: 0.7 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Overtime by Department ── */}
        <div className="span-12 card p-5 animate-in">
          <h2 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Overtime by Department</h2>
          <p className="text-[11px] text-[var(--color-text-tertiary)] mb-3">Average monthly overtime hours</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={overtimeByDept} margin={{ top: 5, right: 5, left: -15, bottom: 0 }} barSize={24}>
              <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} unit="h" />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="avgOT" name="Avg OT (hours)" radius={[6, 6, 0, 0]}>
                {overtimeByDept.map((d, i) => (
                  <Cell key={i} fill={d.avgOT > 25 ? 'var(--color-danger)' : d.avgOT > 15 ? 'var(--color-warning)' : 'var(--color-info)'} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Filter + Table ── */}
      <div className="flex items-center gap-3 animate-in">
        <div className="relative">
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-[var(--color-surface-700)] border border-[var(--color-border)] text-[12px] text-[var(--color-text-secondary)] outline-none cursor-pointer">
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-tertiary)] pointer-events-none" />
        </div>
        <span className="text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} employees</span>
      </div>

      <div className="card overflow-hidden animate-in">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role</th>
                <th>Department</th>
                <th className="cursor-pointer select-none" onClick={() => toggleSort('attendancePct')}>
                  <span className="inline-flex items-center gap-1">Attendance <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="cursor-pointer select-none" onClick={() => toggleSort('overtimeHours')}>
                  <span className="inline-flex items-center gap-1">Overtime <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th>Punctuality</th>
                <th>Workload</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => {
                const attColor = emp.attendancePct >= 90 ? 'var(--color-positive)' : emp.attendancePct >= 75 ? 'var(--color-warning)' : 'var(--color-danger)';
                const otColor = emp.overtimeHours > 30 ? 'var(--color-danger)' : emp.overtimeHours > 15 ? 'var(--color-warning)' : 'var(--color-positive)';
                return (
                  <tr key={emp.id} className="cursor-pointer" onClick={() => navigate(`/employees/${emp.id}`)}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={emp.avatar} alt="" className="w-7 h-7 rounded-full bg-[var(--color-surface-600)]" />
                        <div>
                          <div className="text-[12px] font-medium text-[var(--color-text-primary)]">{emp.name}</div>
                          <div className="text-[10px] text-[var(--color-text-tertiary)]">{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-[12px]">{emp.role}</td>
                    <td className="text-[12px] text-[var(--color-text-tertiary)]">{emp.department}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 rounded-full bg-[var(--color-surface-500)] overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${emp.attendancePct}%`, background: attColor }} />
                        </div>
                        <span className="text-[12px] font-semibold" style={{ color: attColor }}>{emp.attendancePct}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-[12px] font-semibold" style={{ color: otColor }}>{emp.overtimeHours}h</span>
                    </td>
                    <td>
                      <span className={`pill ${emp.attendancePct >= 90 ? 'pill-positive' : emp.attendancePct >= 75 ? 'pill-warning' : 'pill-danger'}`}>
                        {emp.attendancePct >= 90 ? 'Excellent' : emp.attendancePct >= 75 ? 'Average' : 'Poor'}
                      </span>
                    </td>
                    <td>
                      <span className={`pill ${emp.workloadStatus === 'Critical' ? 'pill-danger' : emp.workloadStatus === 'Heavy' ? 'pill-warning' : emp.workloadStatus === 'Light' ? 'pill-info' : 'pill-positive'}`}>
                        {emp.workloadStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
