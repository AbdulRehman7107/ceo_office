import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, TrendingUp, Award, ChevronDown, ArrowUpDown, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { employees, incrementEligible, incentiveEligible, promotionReady, DEPARTMENTS } from '../../data/seed';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-[11px] shadow-xl shadow-black/30">
      <div className="font-semibold text-[var(--color-text-primary)] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="text-[var(--color-text-secondary)]">{p.name}: {p.value}%</div>
      ))}
    </div>
  );
};

export default function SalaryAnalysis() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('increment');
  const [deptFilter, setDeptFilter] = useState('All');

  const source = tab === 'increment' ? incrementEligible : tab === 'incentive' ? incentiveEligible : promotionReady;
  const filtered = deptFilter === 'All' ? source : source.filter(e => e.department === deptFilter);

  const deptIncrementData = useMemo(() => {
    return DEPARTMENTS.map(d => {
      const deptEmps = employees.filter(e => e.department === d && e.level > 0);
      if (!deptEmps.length) return null;
      return {
        dept: d.split(' ')[0],
        avgIncrement: +(deptEmps.reduce((s, e) => s + e.recommendedIncrementPct, 0) / deptEmps.length).toFixed(1),
      };
    }).filter(Boolean);
  }, []);

  const tabs = [
    { key: 'increment', label: 'Increment Eligible', count: incrementEligible.length, color: 'var(--color-positive)' },
    { key: 'incentive', label: 'Incentive Eligible', count: incentiveEligible.length, color: 'var(--color-accent-400)' },
    { key: 'promotion', label: 'Promotion Ready', count: promotionReady.length, color: 'var(--color-info)' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between animate-in">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Salary & Incentive Analysis</h1>
          <p className="text-[13px] text-[var(--color-text-tertiary)] mt-0.5">Evaluate compensation decisions across the organization</p>
        </div>
        <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-[var(--color-border)] text-[12px] text-[var(--color-text-secondary)] hover:bg-white/[0.06] transition-colors">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 animate-in">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`card p-5 text-left transition-all glow-ring ${tab === t.key ? 'border-white/10 bg-[var(--color-card-hover)]' : ''}`}>
            <div className="text-[32px] font-bold" style={{ fontFamily: 'var(--font-display)', color: t.color }}>{t.count}</div>
            <div className="text-[12px] font-medium text-[var(--color-text-secondary)] mt-1">{t.label}</div>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="card p-5 animate-in">
        <h2 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Avg. Recommended Increment by Department</h2>
        <p className="text-[11px] text-[var(--color-text-tertiary)] mb-3">Based on performance evaluation</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={deptIncrementData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }} barSize={22}>
            <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} />
            <YAxis unit="%" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="avgIncrement" name="Avg Increment" radius={[6, 6, 0, 0]}>
              {deptIncrementData.map((d, i) => (
                <Cell key={i} fill={d.avgIncrement >= 8 ? 'var(--color-positive)' : d.avgIncrement >= 5 ? 'var(--color-accent-400)' : 'var(--color-surface-400)'} fillOpacity={0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filter */}
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

      {/* Table */}
      <div className="card overflow-hidden animate-in">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role</th>
                <th>Current Salary</th>
                <th>Last Increment</th>
                <th>Recommended %</th>
                <th>New Salary</th>
                <th>Productivity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.sort((a, b) => b.recommendedIncrementPct - a.recommendedIncrementPct).map(emp => {
                const newSalary = Math.round(emp.currentSalary * (1 + emp.recommendedIncrementPct / 100));
                return (
                  <tr key={emp.id} className="cursor-pointer" onClick={() => navigate(`/employees/${emp.id}`)}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={emp.avatar} alt="" className="w-7 h-7 rounded-full bg-[var(--color-surface-600)]" />
                        <div>
                          <div className="text-[12px] font-medium text-[var(--color-text-primary)]">{emp.name}</div>
                          <div className="text-[10px] text-[var(--color-text-tertiary)]">{emp.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-[12px]">{emp.role}</td>
                    <td className="text-[12px] font-mono">₹{(emp.currentSalary / 100000).toFixed(1)}L</td>
                    <td className="text-[12px]">{emp.lastIncrementDate}</td>
                    <td className="text-[14px] font-bold text-[var(--color-positive)]">+{emp.recommendedIncrementPct}%</td>
                    <td className="text-[12px] font-mono font-semibold text-[var(--color-accent-400)]">₹{(newSalary / 100000).toFixed(1)}L</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 rounded-full bg-[var(--color-surface-500)] overflow-hidden">
                          <div className="h-full rounded-full" style={{
                            width: `${emp.productivityScore}%`,
                            background: emp.productivityScore >= 80 ? 'var(--color-positive)' : 'var(--color-warning)'
                          }} />
                        </div>
                        <span className="text-[11px]">{emp.productivityScore}%</span>
                      </div>
                    </td>
                    <td>
                      {emp.incentiveEligible && <span className="pill pill-warning text-[9px] mr-1">Incentive</span>}
                      {emp.promotionEligible && <span className="pill pill-positive text-[9px]">Promo</span>}
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
