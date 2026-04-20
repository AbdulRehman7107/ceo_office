import { buildOrganization, HIERARCHY, DEPARTMENTS } from './factory';

/* Singleton: build once, reuse everywhere */
const { employees, projects } = buildOrganization();

/* Derived analytics */
const totalEmployees = employees.filter(e => e.level > 0).length; // exclude CEO
const activeProjects = projects.filter(p => p.status !== 'Completed');
const delayedProjects = projects.filter(p => p.status === 'Delayed' || p.status === 'Critical');
const avgProductivity = Math.round(employees.reduce((s, e) => s + e.productivityScore, 0) / employees.length);
const avgAttendance = Math.round(employees.reduce((s, e) => s + e.attendancePct, 0) / employees.length);
const incrementEligible = employees.filter(e => e.recommendedIncrementPct >= 8);
const incentiveEligible = employees.filter(e => e.incentiveEligible);
const promotionReady = employees.filter(e => e.promotionEligible);
const highRisk = employees.filter(e => e.efficiencyRating === 'F' || (e.efficiencyRating === 'C' && e.attendancePct < 75));
const topPerformers = employees.filter(e => e.efficiencyRating === 'A' && e.attendancePct >= 90).sort((a,b) => b.productivityScore - a.productivityScore);

/* Department analytics */
const departmentStats = DEPARTMENTS.map(dept => {
  const deptEmployees = employees.filter(e => e.department === dept);
  if (deptEmployees.length === 0) return null;
  return {
    name: dept,
    headcount: deptEmployees.length,
    avgProductivity: Math.round(deptEmployees.reduce((s,e) => s + e.productivityScore, 0) / deptEmployees.length),
    avgAttendance: Math.round(deptEmployees.reduce((s,e) => s + e.attendancePct, 0) / deptEmployees.length),
    totalOvertime: deptEmployees.reduce((s,e) => s + e.overtimeHours, 0),
  };
}).filter(Boolean);

/* Hierarchy breakdown for charts */
const hierarchyStats = HIERARCHY.filter(h => h.level > 0).map(tier => {
  const tierEmps = employees.filter(e => e.role === tier.role);
  return {
    role: tier.role,
    count: tierEmps.length,
    avgProductivity: tierEmps.length > 0 ? Math.round(tierEmps.reduce((s,e) => s + e.productivityScore, 0) / tierEmps.length) : 0,
    avgSalary: tierEmps.length > 0 ? Math.round(tierEmps.reduce((s,e) => s + e.currentSalary, 0) / tierEmps.length) : 0,
  };
});

/* Monthly company-wide trend (aggregate all employee monthly scores) */
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const monthlyTrend = months.map((m, i) => {
  const scores = employees.map(e => e.monthlyScores[i]);
  return {
    month: m,
    productivity: Math.round(scores.reduce((s,v) => s + v.productivity, 0) / scores.length),
    attendance: Math.round(scores.reduce((s,v) => s + v.attendance, 0) / scores.length),
  };
});

/* Alerts / Notifications */
const notifications = [
  ...delayedProjects.map(p => ({ id: `n-${p.id}`, type: 'danger', title: `${p.name} is ${p.status.toLowerCase()}`, subtitle: p.location, time: '2h ago' })),
  ...highRisk.slice(0, 5).map(e => ({ id: `n-${e.id}`, type: 'warning', title: `${e.name} — Low performance detected`, subtitle: `${e.role} · Productivity ${e.productivityScore}%`, time: '4h ago' })),
  ...projects.filter(p => p.materialDelay).map(p => ({ id: `n-mat-${p.id}`, type: 'warning', title: `Material delay at ${p.name}`, subtitle: `Delayed by ${p.materialDelay}`, time: '1d ago' })),
  { id: 'n-payroll', type: 'info', title: 'Quarterly payroll review due', subtitle: 'April 2026 cycle', time: '3d ago' },
  { id: 'n-promo', type: 'positive', title: `${promotionReady.length} employees eligible for promotion`, subtitle: 'Review recommended', time: '5d ago' },
];

export {
  employees, projects,
  totalEmployees, activeProjects, delayedProjects,
  avgProductivity, avgAttendance,
  incrementEligible, incentiveEligible, promotionReady,
  highRisk, topPerformers,
  departmentStats, hierarchyStats, monthlyTrend,
  notifications,
  HIERARCHY, DEPARTMENTS,
};
