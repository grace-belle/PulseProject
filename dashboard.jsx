import { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ALL_MONTHS = [
  { month: "Sep '24", revenue: 41200, signups: 312, churn: 28, nps: 42, free: 198, pro: 89, enterprise: 25 },
  { month: "Oct '24", revenue: 47800, signups: 389, churn: 31, nps: 45, free: 241, pro: 112, enterprise: 36 },
  { month: "Nov '24", revenue: 52300, signups: 421, churn: 24, nps: 51, free: 278, pro: 104, enterprise: 39 },
  { month: "Dec '24", revenue: 49100, signups: 294, churn: 38, nps: 47, free: 193, pro: 71, enterprise: 30 },
  { month: "Jan '25", revenue: 58900, signups: 503, churn: 29, nps: 55, free: 312, pro: 148, enterprise: 43 },
  { month: "Feb '25", revenue: 63400, signups: 478, churn: 22, nps: 58, free: 298, pro: 141, enterprise: 39 },
  { month: "Mar '25", revenue: 71800, signups: 612, churn: 19, nps: 62, free: 381, pro: 189, enterprise: 42 },
  { month: "Apr '25", revenue: 79200, signups: 584, churn: 21, nps: 64, free: 351, pro: 198, enterprise: 35 },
  { month: "May '25", revenue: 84600, signups: 641, churn: 18, nps: 67, free: 392, pro: 209, enterprise: 40 },
  { month: "Jun '25", revenue: 91300, signups: 708, churn: 16, nps: 71, free: 437, pro: 228, enterprise: 43 },
];

const TIER_COLORS = { free: "#84cc16", pro: "#38bdf8", enterprise: "#eab308" };
const CHART_COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#ec4899"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
const pct = (a, b) => b === 0 ? "0%" : `${((a - b) / b * 100).toFixed(1)}%`;

function StatCard({ label, value, sub, color, loading }) {
  return (
    <div className="stat-card" style={{ "--accent": color }}>
      {loading ? (
        <div className="skeleton-block" />
      ) : (
        <>
          <span className="stat-label">{label}</span>
          <span className="stat-value">{value}</span>
          {sub && <span className="stat-sub">{sub}</span>}
        </>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="tt-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{typeof p.value === "number" && p.name.toLowerCase().includes("revenue") ? fmt(p.value) : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startIdx, setStartIdx] = useState(4); // Jan '25
  const [endIdx, setEndIdx] = useState(9);     // Jun '25
  const [activeTiers, setActiveTiers] = useState({ free: true, pro: true, enterprise: true });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const t = setTimeout(() => {
      if (Math.random() < 0.03) { setError("Failed to fetch metrics. Please retry."); }
      setLoading(false);
    }, 1400);
    return () => clearTimeout(t);
  }, []);

  const data = useMemo(() => ALL_MONTHS.slice(startIdx, endIdx + 1), [startIdx, endIdx]);

  const totals = useMemo(() => {
    const rev = data.reduce((s, d) => s + d.revenue, 0);
    const sig = data.reduce((s, d) => s + d.signups, 0);
    const chu = data.reduce((s, d) => s + d.churn, 0);
    const nps = Math.round(data.reduce((s, d) => s + d.nps, 0) / data.length);
    const len = endIdx - startIdx + 1;
    const prev = ALL_MONTHS.slice(Math.max(0, startIdx - len), startIdx);
    const prevRev = prev.length ? prev.reduce((s, d) => s + d.revenue, 0) : rev;
    return { rev, sig, chu, nps, revChange: pct(rev, prevRev) };
  }, [data, startIdx, endIdx]);

  const tierPie = useMemo(() => {
    const last = data[data.length - 1];
    return Object.entries({ free: last.free, pro: last.pro, enterprise: last.enterprise })
      .filter(([k]) => activeTiers[k])
      .map(([name, value]) => ({ name, value }));
  }, [data, activeTiers]);

  const toggleTier = (t) => setActiveTiers(p => ({ ...p, [t]: !p[t] }));

  if (error) return (
    <div className="error-state">
      <div className="error-icon">⚠</div>
      <p>{error}</p>
      <button onClick={() => { setError(null); setLoading(true); setTimeout(() => setLoading(false), 1200); }}>
        Retry
      </button>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="brand">
            <span className="brand-icon">◈</span>
            <span className="brand-name">Pulse</span>
          </div>
          <nav className="nav">
            {["overview", "revenue", "users", "retention"].map(tab => (
              <button
                key={tab}
                className={`nav-item ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                <span className="nav-icon">{
                  { overview: "⬡", revenue: "◎", users: "◉", retention: "◈" }[tab]
                }</span>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="user-chip">
              <span className="avatar">GR</span>
              <div>
                <p className="user-name">Grace</p>
                <p className="user-role">Admin</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          {/* Header */}
          <header className="topbar">
            <div>
              <h1 className="page-title">Analytics Dashboard</h1>
              <p className="page-sub">SaaS metrics · {data[0]?.month} – {data[data.length - 1]?.month}</p>
            </div>
            <div className="topbar-controls">
              {/* Date range */}
              <div className="filter-group">
                <select
                  className="month-select"
                  value={startIdx}
                  onChange={e => { const v = Number(e.target.value); setStartIdx(v); if (v > endIdx) setEndIdx(v); }}
                >
                  {ALL_MONTHS.map((m, i) => (
                    <option key={i} value={i}>{m.month}</option>
                  ))}
                </select>
                <span className="range-sep">→</span>
                <select
                  className="month-select"
                  value={endIdx}
                  onChange={e => { const v = Number(e.target.value); setEndIdx(v); if (v < startIdx) setStartIdx(v); }}
                >
                  {ALL_MONTHS.map((m, i) => (
                    <option key={i} value={i}>{m.month}</option>
                  ))}
                </select>
              </div>
              {/* Tier toggles */}
              <div className="filter-group">
                {Object.keys(activeTiers).map(t => (
                  <button
                    key={t}
                    className={`tier-btn ${activeTiers[t] ? "active" : ""}`}
                    style={{ "--tc": TIER_COLORS[t] }}
                    onClick={() => toggleTier(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <div className="content">
            {/* Stat Cards */}
            <div className="stat-grid">
              <StatCard label="Total Revenue" value={loading ? "" : fmt(totals.rev)} sub={loading ? "" : `${totals.revChange} vs prev period`} color="#6366f1" loading={loading} />
              <StatCard label="New Signups" value={loading ? "" : totals.sig.toLocaleString()} sub={loading ? "" : `${data.length}-month total`} color="#06b6d4" loading={loading} />
              <StatCard label="Churned Users" value={loading ? "" : totals.chu} sub={loading ? "" : "avg " + (totals.chu / data.length).toFixed(1) + "/mo"} color="#f59e0b" loading={loading} />
              <StatCard label="Avg NPS" value={loading ? "" : totals.nps} sub={loading ? "" : totals.nps >= 60 ? "Excellent ↑" : "Good"} color="#ec4899" loading={loading} />
            </div>

            {/* Charts grid */}
            {loading ? (
              <div className="charts-loading">
                <div className="skeleton-chart" />
                <div className="skeleton-chart" />
                <div className="skeleton-chart short" />
                <div className="skeleton-chart short" />
              </div>
            ) : (
              <div className="charts-grid">
                {/* Revenue Trend */}
                <div className="chart-card wide">
                  <div className="chart-header">
                    <h2>Revenue Trend</h2>
                    <span className="badge green">MRR</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r: 3, fill: "#6366f1" }} activeDot={{ r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* User Signups */}
                <div className="chart-card wide">
                  <div className="chart-header">
                    <h2>User Signups</h2>
                    <span className="badge blue">Monthly</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="signups" name="Signups" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Subscription Breakdown */}
                <div className="chart-card">
                  <div className="chart-header">
                    <h2>Tier Distribution</h2>
                    <span className="badge amber">Latest Month</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={tierPie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" nameKey="name">
                        {tierPie.map((entry) => (
                          <Cell key={entry.name} fill={TIER_COLORS[entry.name]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v, n) => [v, n.charAt(0).toUpperCase() + n.slice(1)]} />
                      <Legend formatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)} iconType="circle" iconSize={8} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Churn + NPS */}
                <div className="chart-card">
                  <div className="chart-header">
                    <h2>Churn vs NPS</h2>
                    <span className="badge pink">Health</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="l" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="r" orientation="right" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" iconSize={8} />
                      <Line yAxisId="l" type="monotone" dataKey="churn" name="Churn" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                      <Line yAxisId="r" type="monotone" dataKey="nps" name="NPS" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Tier stacked bar */}
                <div className="chart-card wide">
                  <div className="chart-header">
                    <h2>Signups by Tier</h2>
                    <span className="badge green">Stacked</span>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" iconSize={8} />
                      {activeTiers.free && <Bar dataKey="free" name="Free" stackId="a" fill={TIER_COLORS.free} />}
                      {activeTiers.pro && <Bar dataKey="pro" name="Pro" stackId="a" fill={TIER_COLORS.pro} />}
                      {activeTiers.enterprise && <Bar dataKey="enterprise" name="Enterprise" stackId="a" fill={TIER_COLORS.enterprise} radius={[4, 4, 0, 0]} />}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080c14;
    --surface: #0f1623;
    --surface2: #161e2e;
    --border: rgba(255,255,255,0.07);
    --text: #e2e8f0;
    --muted: #64748b;
    --accent: #6366f1;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-display); }

  .app {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
  }

  /* ── Sidebar ── */
  .sidebar {
    width: 200px;
    min-height: 100vh;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 24px 0;
    flex-shrink: 0;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 20px 28px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 20px;
  }
  .brand-icon { font-size: 22px; color: #6366f1; }
  .brand-name { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }

  .nav { display: flex; flex-direction: column; gap: 4px; padding: 0 10px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--muted);
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.3px;
    cursor: pointer;
    text-transform: capitalize;
    transition: all 0.15s;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(99,102,241,0.15); color: #a5b4fc; }
  .nav-icon { font-size: 14px; }

  .sidebar-bottom { margin-top: auto; padding: 20px; border-top: 1px solid var(--border); }
  .user-chip { display: flex; align-items: center; gap: 10px; }
  .avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700;
  }
  .user-name { font-size: 13px; font-weight: 600; }
  .user-role { font-size: 11px; color: var(--muted); }

  /* ── Main ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .topbar {
    padding: 24px 28px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    background: var(--surface);
  }
  .page-title { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
  .page-sub { font-size: 12px; color: var(--muted); margin-top: 2px; font-family: var(--font-mono); }

  .topbar-controls { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .filter-group { display: flex; gap: 4px; }

  .filter-btn {
    padding: 6px 14px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .filter-btn:hover { border-color: #6366f1; color: #a5b4fc; }
  .filter-btn.active { background: rgba(99,102,241,0.2); border-color: #6366f1; color: #a5b4fc; }

  .month-select {
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 12px;
    cursor: pointer;
    outline: none;
    transition: border-color 0.15s;
  }
  .month-select:hover, .month-select:focus { border-color: #6366f1; }
  .range-sep { color: var(--muted); font-size: 13px; padding: 0 2px; align-self: center; }

  .tier-btn {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 11px;
    cursor: pointer;
    text-transform: capitalize;
    transition: all 0.15s;
    position: relative;
  }
  .tier-btn::before {
    content: '';
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--tc);
    margin-right: 6px;
    opacity: 0.4;
  }
  .tier-btn.active { border-color: var(--tc); color: var(--text); }
  .tier-btn.active::before { opacity: 1; }

  /* ── Content ── */
  .content { padding: 24px 28px; overflow-y: auto; flex: 1; }

  /* ── Stat Cards ── */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent);
  }
  .stat-card:hover { border-color: rgba(255,255,255,0.15); }
  .stat-label { display: block; font-size: 11px; color: var(--muted); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
  .stat-value { display: block; font-size: 28px; font-weight: 800; letter-spacing: -1px; margin-bottom: 4px; }
  .stat-sub { font-size: 11px; color: var(--muted); font-family: var(--font-mono); }

  /* ── Charts ── */
  .charts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .chart-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    transition: border-color 0.2s;
  }
  .chart-card:hover { border-color: rgba(255,255,255,0.12); }
  .chart-card.wide { grid-column: span 2; }

  .chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .chart-header h2 { font-size: 14px; font-weight: 700; letter-spacing: -0.2px; }

  .badge {
    font-size: 10px; font-family: var(--font-mono);
    padding: 3px 8px; border-radius: 20px; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.6px;
  }
  .badge.green { background: rgba(16,185,129,0.15); color: #6ee7b7; }
  .badge.blue { background: rgba(6,182,212,0.15); color: #67e8f9; }
  .badge.amber { background: rgba(245,158,11,0.15); color: #fcd34d; }
  .badge.pink { background: rgba(236,72,153,0.15); color: #f9a8d4; }

  /* ── Tooltip ── */
  .custom-tooltip {
    background: #1e293b;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 10px 14px;
    font-family: var(--font-mono);
    font-size: 12px;
  }
  .tt-label { color: var(--muted); margin-bottom: 6px; font-size: 11px; }

  /* ── Skeletons ── */
  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .skeleton-block, .skeleton-chart {
    background: linear-gradient(90deg, var(--surface2) 25%, #1e293b 50%, var(--surface2) 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 8px;
  }
  .skeleton-block { height: 60px; width: 100%; border-radius: 12px; min-height: 100px; }
  .charts-loading { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .skeleton-chart { height: 280px; }
  .skeleton-chart.short { height: 200px; }
  .stat-grid .stat-card { min-height: 110px; }

  /* ── Error ── */
  .error-state {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px;
    font-family: var(--font-display);
  }
  .error-icon { font-size: 40px; }
  .error-state p { color: var(--muted); font-size: 14px; }
  .error-state button {
    padding: 10px 24px;
    background: rgba(99,102,241,0.2);
    border: 1px solid #6366f1;
    border-radius: 8px;
    color: #a5b4fc;
    font-family: var(--font-display);
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;
  }

  /* ── Responsive ── */
  @media (max-width: 1100px) {
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
    .charts-grid { grid-template-columns: 1fr; }
    .chart-card.wide { grid-column: span 1; }
  }
  @media (max-width: 700px) {
    .sidebar { display: none; }
    .topbar { padding: 16px; }
    .content { padding: 16px; }
    .stat-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
    .page-title { font-size: 18px; }
  }
  @media (max-width: 450px) {
    .stat-grid { grid-template-columns: 1fr; }
  }
`;