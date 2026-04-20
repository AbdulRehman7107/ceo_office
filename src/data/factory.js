import { faker } from '@faker-js/faker';

/* ═══════════════════════════════════════════════════
   DATA FACTORY — Generates realistic corporate hierarchy
   12-tier Dynamix Group construction company
   ═══════════════════════════════════════════════════ */

const HIERARCHY = [
  { level: 0, role: 'CEO', count: 1, salaryRange: [4500000, 6000000] },
  { level: 1, role: 'Managing Director', count: 2, salaryRange: [3000000, 4200000] },
  { level: 2, role: 'Director', count: 4, salaryRange: [2200000, 3200000] },
  { level: 3, role: 'Vice President', count: 5, salaryRange: [1800000, 2600000] },
  { level: 4, role: 'Assistant Vice President', count: 6, salaryRange: [1400000, 2000000] },
  { level: 5, role: 'Project Head', count: 8, salaryRange: [1100000, 1600000] },
  { level: 6, role: 'Project Manager', count: 12, salaryRange: [900000, 1300000] },
  { level: 7, role: 'Assistant Project Manager', count: 14, salaryRange: [700000, 1000000] },
  { level: 8, role: 'Senior Engineer', count: 22, salaryRange: [550000, 850000] },
  { level: 9, role: 'Junior Engineer', count: 30, salaryRange: [350000, 550000] },
  { level: 10, role: 'Senior Site Supervisor', count: 18, salaryRange: [400000, 650000] },
  { level: 11, role: 'Site Supervisor', count: 25, salaryRange: [280000, 450000] },
];

const DEPARTMENTS = [
  'Structural Engineering', 'MEP Services', 'Architecture & Design',
  'Project Controls', 'Quality Assurance', 'Safety & Compliance',
  'Procurement', 'Finance & Admin', 'HR & Operations'
];

const PROJECT_NAMES = [
  'Dynamix Towers Phase II', 'Marina Heights Complex', 'Greenfield Tech Park',
  'Skyline Residences', 'Metro Junction Hub', 'Harbour View Commercial',
  'Pinnacle Corporate Tower', 'Riverside Apartments', 'Heritage Renovation',
  'Eastway Bridge Expansion', 'Central Mall Extension', 'Sunset Villas'
];

const LOCATIONS = [
  'Mumbai - Bandra', 'Mumbai - Worli', 'Pune - Hinjewadi', 'Thane - Ghodbunder',
  'Navi Mumbai - Kharghar', 'Mumbai - Andheri', 'Pune - Kharadi', 'Mumbai - Powai',
  'Panvel - New City', 'Mumbai - Lower Parel', 'Pune - Wakad', 'Thane - Majiwada'
];

faker.seed(42); // Deterministic for consistency

function generateSalaryHistory(current) {
  const history = [];
  let sal = current;
  for (let i = 0; i < 4; i++) {
    const year = 2026 - i;
    history.push({ year, amount: Math.round(sal) });
    sal = sal / (1 + faker.number.float({ min: 0.04, max: 0.12 }));
  }
  return history.reverse();
}

function generateMonthlyScores() {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months.map(m => ({
    month: m,
    productivity: faker.number.int({ min: 45, max: 98 }),
    attendance: faker.number.int({ min: 70, max: 100 }),
  }));
}

export function buildOrganization() {
  const employees = [];
  let idCounter = 1;

  // Build hierarchy top-down
  const levelBuckets = {};

  HIERARCHY.forEach(tier => {
    levelBuckets[tier.level] = [];
    for (let i = 0; i < tier.count; i++) {
      const salary = faker.number.int({ min: tier.salaryRange[0], max: tier.salaryRange[1] });
      const productivity = faker.number.int({ min: tier.level <= 3 ? 65 : 40, max: 98 });
      const attendance = faker.number.int({ min: tier.level <= 3 ? 80 : 60, max: 100 });
      const overtime = tier.level >= 6 ? faker.number.int({ min: 0, max: 45 }) : faker.number.int({ min: 0, max: 15 });
      const efficiency = productivity >= 85 ? 'A' : productivity >= 70 ? 'B' : productivity >= 55 ? 'C' : 'F';
      const incrementPct = productivity >= 80 ? faker.number.float({ min: 8, max: 18, fractionDigits: 1 }) :
                           productivity >= 60 ? faker.number.float({ min: 3, max: 8, fractionDigits: 1 }) :
                           faker.number.float({ min: 0, max: 3, fractionDigits: 1 });

      // Determine reporting manager
      let reportingManagerId = null;
      if (tier.level > 0 && levelBuckets[tier.level - 1]?.length > 0) {
        const possibleManagers = levelBuckets[tier.level - 1];
        reportingManagerId = possibleManagers[i % possibleManagers.length].id;
      }

      const emp = {
        id: `EMP-${String(idCounter).padStart(4, '0')}`,
        name: faker.person.fullName(),
        avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${faker.string.alphanumeric(6)}`,
        role: tier.role,
        level: tier.level,
        department: DEPARTMENTS[faker.number.int({ min: 0, max: DEPARTMENTS.length - 1 })],
        reportingManagerId,
        assignedProjectIds: [],
        attendancePct: attendance,
        overtimeHours: overtime,
        productivityScore: productivity,
        efficiencyRating: efficiency,
        currentSalary: salary,
        lastIncrementDate: faker.date.between({ from: '2024-01-01', to: '2025-12-31' }).toISOString().split('T')[0],
        recommendedIncrementPct: incrementPct,
        incentiveEligible: productivity >= 75 && attendance >= 85,
        promotionEligible: productivity >= 85 && attendance >= 90 && overtime < 30,
        pendingTasks: faker.number.int({ min: 0, max: tier.level >= 6 ? 12 : 5 }),
        completedMilestones: faker.number.int({ min: 5, max: 40 }),
        delayedMilestones: faker.number.int({ min: 0, max: tier.level >= 5 ? 6 : 2 }),
        workloadStatus: faker.helpers.arrayElement(['Balanced', 'Heavy', 'Light', 'Critical']),
        salaryHistory: generateSalaryHistory(salary),
        monthlyScores: generateMonthlyScores(),
        joinDate: faker.date.between({ from: '2018-01-01', to: '2025-06-01' }).toISOString().split('T')[0],
      };

      employees.push(emp);
      levelBuckets[tier.level].push(emp);
      idCounter++;
    }
  });

  // Assign projects to employees level >= 5
  const projects = buildProjects();
  employees.forEach(emp => {
    if (emp.level >= 5) {
      const count = faker.number.int({ min: 1, max: 3 });
      const assigned = faker.helpers.arrayElements(projects, count);
      emp.assignedProjectIds = assigned.map(p => p.id);
    }
  });

  return { employees, projects };
}

function buildProjects() {
  return PROJECT_NAMES.map((name, i) => {
    const total = faker.number.int({ min: 8, max: 20 });
    const completed = faker.number.int({ min: 1, max: total });
    const status = completed === total ? 'Completed' : 
                   faker.helpers.arrayElement(['On Track', 'On Track', 'Delayed', 'Critical']);
    const budget = faker.number.int({ min: 15, max: 180 });
    const spent = Math.round(budget * faker.number.float({ min: 0.3, max: status === 'Completed' ? 1.05 : 0.85 }));

    return {
      id: `PRJ-${String(i + 1).padStart(3, '0')}`,
      name,
      location: LOCATIONS[i],
      status,
      budget: budget,
      spent: spent,
      milestonesCompleted: completed,
      totalMilestones: total,
      progressPct: Math.round((completed / total) * 100),
      startDate: faker.date.between({ from: '2023-06-01', to: '2025-01-01' }).toISOString().split('T')[0],
      expectedEnd: faker.date.between({ from: '2026-03-01', to: '2028-12-31' }).toISOString().split('T')[0],
      laborProductivity: faker.number.int({ min: 50, max: 96 }),
      materialDelay: faker.helpers.arrayElement([null, null, null, '3 days', '1 week', '2 weeks']),
      safetyIncidents: faker.number.int({ min: 0, max: 4 }),
    };
  });
}

export { HIERARCHY, DEPARTMENTS };
