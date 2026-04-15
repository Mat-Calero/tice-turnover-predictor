// ─── Store Definitions ────────────────────────────────────────────────────────
export const STORES = [
  // South Florida
  { id: 'S01', name: 'Miami Gardens', city: 'Miami Gardens', state: 'FL', region: 'South Florida' },
  { id: 'S02', name: 'Hialeah',       city: 'Hialeah',       state: 'FL', region: 'South Florida' },
  { id: 'S03', name: 'Fort Lauderdale', city: 'Fort Lauderdale', state: 'FL', region: 'South Florida' },
  { id: 'S04', name: 'Pembroke Pines', city: 'Pembroke Pines', state: 'FL', region: 'South Florida' },
  { id: 'S05', name: 'West Palm Beach', city: 'West Palm Beach', state: 'FL', region: 'South Florida' },
  // Central & North Florida
  { id: 'S06', name: 'Orlando',        city: 'Orlando',       state: 'FL', region: 'Central & North Florida' },
  { id: 'S07', name: 'Kissimmee',      city: 'Kissimmee',     state: 'FL', region: 'Central & North Florida' },
  { id: 'S08', name: 'Tampa',          city: 'Tampa',         state: 'FL', region: 'Central & North Florida' },
  { id: 'S09', name: 'St. Petersburg', city: 'St. Petersburg', state: 'FL', region: 'Central & North Florida' },
  { id: 'S10', name: 'Jacksonville',   city: 'Jacksonville',  state: 'FL', region: 'Central & North Florida' },
  { id: 'S11', name: 'Tallahassee',    city: 'Tallahassee',   state: 'FL', region: 'Central & North Florida' },
  // Georgia
  { id: 'S12', name: 'Atlanta Decatur',      city: 'Atlanta (Decatur)',      state: 'GA', region: 'Georgia' },
  { id: 'S13', name: 'Atlanta College Park', city: 'Atlanta (College Park)', state: 'GA', region: 'Georgia' },
  { id: 'S14', name: 'Savannah',       city: 'Savannah',      state: 'GA', region: 'Georgia' },
  { id: 'S15', name: 'Macon',          city: 'Macon',         state: 'GA', region: 'Georgia' },
  // Alabama
  { id: 'S16', name: 'Birmingham',     city: 'Birmingham',    state: 'AL', region: 'Alabama' },
  { id: 'S17', name: 'Montgomery',     city: 'Montgomery',    state: 'AL', region: 'Alabama' },
  { id: 'S18', name: 'Mobile',         city: 'Mobile',        state: 'AL', region: 'Alabama' },
  // South Carolina
  { id: 'S19', name: 'Charleston',     city: 'Charleston',    state: 'SC', region: 'South Carolina' },
  { id: 'S20', name: 'Columbia',       city: 'Columbia',      state: 'SC', region: 'South Carolina' },
  // North Carolina
  { id: 'S21', name: 'Charlotte',      city: 'Charlotte',     state: 'NC', region: 'North Carolina' },
  { id: 'S22', name: 'Raleigh',        city: 'Raleigh',       state: 'NC', region: 'North Carolina' },
];

export const REGIONS = ['All Regions', 'South Florida', 'Central & North Florida', 'Georgia', 'Alabama', 'South Carolina', 'North Carolina'];

// ─── Flight Risk Algorithm ─────────────────────────────────────────────────────
export const RISK_FORMULA = [
  { factor: 'Days employed < 90 (new hire)',    weight: 25, description: 'New hires quit most often in QSR' },
  { factor: 'Missed shifts > 2 in 30 days',     weight: 20, description: 'Disengagement signal' },
  { factor: 'Hours cut >20% vs. average',       weight: 15, description: 'Schedule reduction = reduced income & commitment' },
  { factor: 'Schedule consistency score < 4',   weight: 15, description: 'Erratic scheduling drives turnover' },
  { factor: 'No raise in 12+ months',           weight: 10, description: 'Pay stagnation' },
  { factor: 'Manager rating < 3',               weight: 10, description: 'Poor manager relationship' },
  { factor: 'Late arrivals > 3 in 30 days',     weight: 10, description: 'Declining engagement' },
  { factor: 'Overtime > 15 hrs in 4 weeks',     weight:  5, description: 'Burnout risk' },
];

function calcScore(emp) {
  let score = 0;
  const factors = [];

  if (emp.daysEmployed < 90) {
    score += 25;
    factors.push(`Under 90 days employed (${emp.daysEmployed} days) — highest-risk tenure window`);
  }
  if (emp.missedShifts > 2) {
    score += 20;
    factors.push(`Missed ${emp.missedShifts} shift${emp.missedShifts > 1 ? 's' : ''} in the last 30 days`);
  }
  // Hours cut >20% — we compare hoursPerWeek to a "baseline" embedded in the record
  if (emp.baselineHours && emp.hoursPerWeek < emp.baselineHours * 0.8) {
    score += 15;
    const cut = Math.round(((emp.baselineHours - emp.hoursPerWeek) / emp.baselineHours) * 100);
    factors.push(`Hours cut ${cut}% — from ${emp.baselineHours} to ${emp.hoursPerWeek} hrs/week`);
  }
  if (emp.scheduleConsistency < 4) {
    score += 15;
    factors.push(`Schedule consistency score ${emp.scheduleConsistency}/10 — highly erratic scheduling`);
  }
  const monthsSinceRaise = emp.lastRaiseDate
    ? Math.floor((new Date('2026-04-15') - new Date(emp.lastRaiseDate)) / (1000 * 60 * 60 * 24 * 30))
    : 999;
  if (monthsSinceRaise >= 12) {
    score += 10;
    factors.push(monthsSinceRaise >= 999
      ? 'Never received a raise — pay has not been reviewed'
      : `No raise in ${monthsSinceRaise} months (since ${emp.lastRaiseDate})`);
  }
  if (emp.managerRating < 3) {
    score += 10;
    factors.push(`Manager rating ${emp.managerRating}/5 at last review — poor relationship signal`);
  }
  if (emp.lateArrivals > 3) {
    score += 10;
    factors.push(`${emp.lateArrivals} late arrivals in the last 30 days — declining engagement`);
  }
  if (emp.overtimeHours > 15) {
    score += 5;
    factors.push(`${emp.overtimeHours} overtime hours over 4 weeks — burnout risk`);
  }

  return { score: Math.min(score, 100), factors };
}

function riskLevel(score) {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'High';
  if (score >= 25) return 'Moderate';
  return 'Low';
}

function retentionAction(emp) {
  const actions = [];
  if (emp.daysEmployed < 90 && emp.missedShifts > 1) {
    actions.push('Schedule check-in with manager within 48 hours. Review onboarding completion status. Assign a peer mentor.');
  } else if (emp.daysEmployed < 90) {
    actions.push('Conduct onboarding check-in. Confirm schedule is meeting employee expectations. Assign a peer buddy.');
  }
  if (emp.baselineHours && emp.hoursPerWeek < emp.baselineHours * 0.8) {
    actions.push(`Restore hours to previous average (${emp.baselineHours} hrs/wk) immediately. Discuss schedule preferences directly with employee.`);
  }
  const monthsSinceRaise = emp.lastRaiseDate
    ? Math.floor((new Date('2026-04-15') - new Date(emp.lastRaiseDate)) / (1000 * 60 * 60 * 24 * 30))
    : 999;
  if (monthsSinceRaise >= 12) {
    const tenure = Math.floor(emp.daysEmployed / 30);
    const marketLow = emp.role === 'General Manager' ? 18 : emp.role === 'Assistant Manager' ? 14 : emp.role === 'Shift Lead' ? 12 : 10;
    const marketHigh = marketLow + 3;
    actions.push(`Review for pay increase. Current rate: $${emp.payRate}/hr. Tenure: ${tenure} months. Market rate for ${emp.role}: $${marketLow}–$${marketHigh}/hr.`);
  }
  if (emp.managerRating < 3) {
    actions.push('Evaluate manager-employee relationship. Consider transfer to a different shift or location if conflict is identified.');
  }
  if (emp.overtimeHours > 15) {
    actions.push('Reduce overtime and redistribute hours across team. Check for burnout signs. Offer flexible scheduling options.');
  }
  if (emp.missedShifts > 2 && emp.daysEmployed >= 90) {
    actions.push(`Conduct attendance conversation. ${emp.missedShifts} missed shifts may signal personal issues or disengagement — approach with empathy.`);
  }
  if (emp.scheduleConsistency < 4 && !actions.some(a => a.includes('schedule'))) {
    actions.push('Stabilize schedule by assigning consistent shift blocks. Erratic schedules are a leading driver of QSR turnover.');
  }
  if (actions.length === 0) {
    actions.push('Conduct a stay interview to surface any unreported concerns before disengagement deepens.');
  }
  return actions;
}

// ─── Seeded pseudo-random helpers ─────────────────────────────────────────────
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
function range(min, max, rnd) { return Math.floor(rnd() * (max - min + 1)) + min; }

const FIRST_NAMES = [
  'James','Maria','Kevin','Destiny','Luis','Tamika','Jordan','Ashley','Marcus','Kayla',
  'DeShawn','Brittany','Carlos','Monique','Tyler','Jasmine','Anthony','Latoya','Chris','Nicole',
  'Roberto','Shaniqua','Derek','Tiffany','Brandon','Aaliyah','Darius','Crystal','Xavier','Ebony',
  'Isaiah','Vanessa','Andre','Stephanie','Malik','Diana','Trevor','Keisha','Shane','Alicia',
  'Jerome','Courtney','Terrence','Amber','Rashad','Whitney','Corey','Latasha','Raymond','Brianna',
  'Eduardo','Yolanda','Phillip','Tanisha','Gerald','Veronica','Maurice','Nadia','Wallace','Priya',
];
const LAST_NAMES = [
  'Johnson','Martinez','Williams','Thompson','Garcia','Davis','Brown','Wilson','Jones','Taylor',
  'Anderson','Thomas','Jackson','White','Harris','Martin','Thompson','Moore','Allen','Walker',
  'Young','Hall','Robinson','Lewis','King','Wright','Scott','Green','Adams','Baker',
  'Carter','Mitchel','Perez','Rivera','Torres','Ramirez','Flores','Rodriguez','Gonzalez','Lopez',
  'Hernandez','Sanchez','Morales','Reyes','Diaz','Cruz','Ramos','Nguyen','Pham','Tran',
];
const ROLES = ['Crew Member','Crew Member','Crew Member','Crew Member','Shift Lead','Shift Lead','Assistant Manager','General Manager'];

function payRateForRole(role, rnd) {
  switch (role) {
    case 'General Manager': return +(14 + rnd() * 6).toFixed(2);
    case 'Assistant Manager': return +(12 + rnd() * 4).toFixed(2);
    case 'Shift Lead': return +(11 + rnd() * 3).toFixed(2);
    default: return +(9.5 + rnd() * 2.5).toFixed(2);
  }
}

// ─── Generate All Employees ────────────────────────────────────────────────────
let globalId = 1;

function generateStoreEmployees(store, seed) {
  const rnd = seededRand(seed);
  const count = range(8, 15, rnd);
  const employees = [];

  for (let i = 0; i < count; i++) {
    const role = pick(ROLES, rnd);
    const name = `${pick(FIRST_NAMES, rnd)} ${pick(LAST_NAMES, rnd)}`;

    // Determine tenure — bias toward new hires being more common
    const newHireBias = rnd() < 0.28; // 28% chance of being a new hire (<90 days)
    const daysEmployed = newHireBias
      ? range(7, 89, rnd)
      : range(90, 1200, rnd);

    const hireDate = new Date('2026-04-15');
    hireDate.setDate(hireDate.getDate() - daysEmployed);
    const hireDateStr = hireDate.toISOString().split('T')[0];

    const baselineHours = role === 'General Manager' ? 45 : role === 'Assistant Manager' ? 40 : range(28, 40, rnd);
    const hoursPerWeek = rnd() < 0.2
      ? Math.max(15, Math.floor(baselineHours * (0.6 + rnd() * 0.18))) // hours cut
      : range(Math.floor(baselineHours * 0.9), baselineHours, rnd);

    const scheduleConsistency = range(1, 10, rnd);
    const missedShifts = rnd() < 0.25 ? range(1, 7, rnd) : range(0, 2, rnd);
    const lateArrivals = rnd() < 0.2 ? range(2, 8, rnd) : range(0, 3, rnd);
    const overtimeHours = range(0, 25, rnd);
    const managerRating = +(1 + rnd() * 4).toFixed(1);
    const payRate = payRateForRole(role, rnd);

    // Last raise — null for <6mo employees, or date within last 24 months
    let lastRaiseDate = null;
    if (daysEmployed > 180) {
      const noRaiseBias = rnd() < 0.3;
      if (!noRaiseBias) {
        const daysAgo = range(30, Math.min(daysEmployed - 30, 730));
        const raiseDate = new Date('2026-04-15');
        raiseDate.setDate(raiseDate.getDate() - daysAgo);
        lastRaiseDate = raiseDate.toISOString().split('T')[0];
      }
    }

    const empData = {
      id: `E${String(globalId++).padStart(4, '0')}`,
      name,
      storeId: store.id,
      storeName: store.name,
      storeCity: store.city,
      storeState: store.state,
      region: store.region,
      role,
      hireDate: hireDateStr,
      daysEmployed,
      hoursPerWeek,
      baselineHours,
      scheduleConsistency,
      missedShifts,
      lateArrivals,
      overtimeHours,
      lastRaiseDate,
      payRate,
      managerRating,
    };

    const { score, factors } = calcScore(empData);
    empData.flightRiskScore = score;
    empData.flightRiskLevel = riskLevel(score);
    empData.riskFactors = factors;
    empData.retentionActions = retentionAction(empData);

    employees.push(empData);
  }

  return employees;
}

// Build the full dataset
const ALL_EMPLOYEES = STORES.flatMap((store, idx) =>
  generateStoreEmployees(store, 42 + idx * 137)
);

// ─── Exports ──────────────────────────────────────────────────────────────────
export default ALL_EMPLOYEES;

export const REPLACEMENT_COST = 3500;

export function getRiskColor(level) {
  switch (level) {
    case 'Critical': return { bg: 'bg-red-900/40',    text: 'text-red-400',    border: 'border-red-700',    dot: 'bg-red-500' };
    case 'High':     return { bg: 'bg-orange-900/40', text: 'text-orange-400', border: 'border-orange-700', dot: 'bg-orange-500' };
    case 'Moderate': return { bg: 'bg-yellow-900/40', text: 'text-yellow-400', border: 'border-yellow-700', dot: 'bg-yellow-500' };
    default:         return { bg: 'bg-green-900/40',  text: 'text-green-400',  border: 'border-green-700',  dot: 'bg-green-500' };
  }
}

export function getScoreBarColor(score) {
  if (score >= 75) return 'bg-red-500';
  if (score >= 50) return 'bg-orange-500';
  if (score >= 25) return 'bg-yellow-500';
  return 'bg-green-500';
}
