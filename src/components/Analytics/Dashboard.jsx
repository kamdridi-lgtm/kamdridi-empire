'use client';
import { useEffect, useState } from 'react';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(()=>{ (async()=> {
    const r = await fetch('/.netlify/functions/analytics-dashboard');
    const j = await r.json();
    setStats(j);
  })(); }, []);

  if (!stats) return <div className="text-white/60">Loading analytics…</div>;

  const Card = ({ title, value, sub }) => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-white/50 text-sm">{title}</div>
      <div className="text-3xl font-black mt-2">{value}</div>
      {sub && <div className="text-xs text-white/50 mt-2">{sub}</div>}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card title="Active Members" value={stats.activeMembers} sub={`+${stats.memberGrowth}% this month`} />
      <Card title="Monthly Revenue" value={`€${stats.monthlyRevenue}`} sub={`+${stats.revenueGrowth}% vs last month`} />
      <Card title="Avg. Lifetime Value" value={`€${stats.avgLTV}`} />
      <Card title="Churn Rate" value={`${stats.churnRate}%`} sub={`${stats.churnTrend>0?'+':''}${stats.churnTrend}% vs last month`} />
    </div>
  );
}
