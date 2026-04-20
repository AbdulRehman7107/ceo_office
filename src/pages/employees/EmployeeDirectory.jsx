import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronDown, ArrowUpDown, Zap, Users as UsersIcon } from 'lucide-react';
import { employees, HIERARCHY, DEPARTMENTS } from '../../data/seed';

export default function EmployeeDirectory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [sortField, setSortField] = useState('productivityScore');
  const [sortDir, setSortDir] = useState('desc');

  const allRoles = HIERARCHY.filter(h => h.level > 0).map(h => h.role);

  const filtered = useMemo(() => {
    let result = employees.filter(e => e.level > 0); // exclude CEO
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e => e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.role.toLowerCase().includes(q));
    }
    if (roleFilter !== 'All') result = result.filter(e => e.role === roleFilter);
    if (deptFilter !== 'All') result = result.filter(e => e.department === deptFilter);
    result.sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    });
    return result;
  }, [search, roleFilter, deptFilter, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const effColor = (r) => r === 'A' ? 'pill-positive' : r === 'B' ? 'pill-info' : r === 'C' ? 'pill-warning' : 'pill-danger';
  const workloadColor = (w) => w === 'Critical' ? 'pill-danger' : w === 'Heavy' ? 'pill-warning' : w === 'Light' ? 'pill-info' : 'pill-positive';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between animate-in">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Workforce Directory</h1>
          <p className="text-[13px] text-[var(--color-text-tertiary)] mt-0.5">{filtered.length} employees matching filters</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card px-4 py-3 flex flex-wrap items-center gap-3 animate-in">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            placeholder="Search name, role, or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--color-surface-700)] border border-[var(--color-border)] text-[13px] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-400)]/30 transition-colors placeholder:text-[var(--color-text-tertiary)]"
          />
        </div>

        {/* Role Filter */}
        <div className="relative">
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-[var(--color-surface-700)] border border-[var(--color-border)] text-[12px] text-[var(--color-text-secondary)] outline-none cursor-pointer">
            <option value="All">All Roles</option>
            {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-tertiary)] pointer-events-none" />
        </div>

        {/* Dept Filter */}
        <div className="relative">
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-[var(--color-surface-700)] border border-[var(--color-border)] text-[12px] text-[var(--color-text-secondary)] outline-none cursor-pointer">
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-tertiary)] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden animate-in">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role & Dept</th>
                <th className="cursor-pointer select-none" onClick={() => toggleSort('productivityScore')}>
                  <span className="inline-flex items-center gap-1">Productivity <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="cursor-pointer select-none" onClick={() => toggleSort('attendancePct')}>
                  <span className="inline-flex items-center gap-1">Attendance <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th>Efficiency</th>
                <th>Workload</th>
                <th className="cursor-pointer select-none" onClick={() => toggleSort('overtimeHours')}>
                  <span className="inline-flex items-center gap-1">Overtime <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th>Increment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} className="cursor-pointer" onClick={() => navigate(`/employees/${emp.id}`)}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full bg-[var(--color-surface-600)] shrink-0" />
                      <div>
                        <div className="text-[13px] font-medium text-[var(--color-text-primary)]">{emp.name}</div>
                        <div className="text-[10px] text-[var(--color-text-tertiary)]">{emp.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-[12px] font-medium text-[var(--color-text-primary)]">{emp.role}</div>
                    <div className="text-[10px] text-[var(--color-text-tertiary)]">{emp.department}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-[var(--color-surface-500)] overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${emp.productivityScore}%`,
                          background: emp.productivityScore >= 80 ? 'var(--color-positive)' : emp.productivityScore >= 60 ? 'var(--color-warning)' : 'var(--color-danger)'
                        }} />
                      </div>
                      <span className="text-[12px] font-semibold">{emp.productivityScore}%</span>
                    </div>
                  </td>
                  <td className="text-[12px] font-medium">{emp.attendancePct}%</td>
                  <td><span className={`pill ${effColor(emp.efficiencyRating)}`}>{emp.efficiencyRating}</span></td>
                  <td><span className={`pill ${workloadColor(emp.workloadStatus)}`}>{emp.workloadStatus}</span></td>
                  <td className="text-[12px]">{emp.overtimeHours}h</td>
                  <td>
                    <span className={`text-[12px] font-semibold ${emp.recommendedIncrementPct >= 8 ? 'text-[var(--color-positive)]' : 'text-[var(--color-text-secondary)]'}`}>
                      +{emp.recommendedIncrementPct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
