const { supabaseAdmin } = require('./_supabaseAdmin');

exports.handler = async () => {
  const { data: members } = await supabaseAdmin.from('members').select('status,tier,total_spent').limit(5000);

  const active = (members || []).filter(m => m.status === 'active').length;
  const revenue = (members || []).reduce((acc, m) => acc + (m.total_spent || 0), 0);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      activeMembers: active,
      memberGrowth: 0,
      monthlyRevenue: Math.round(revenue / 100),
      revenueGrowth: 0,
      avgLTV: members?.length ? Math.round((revenue / members.length) / 100) : 0,
      churnRate: 0,
      churnTrend: 0
    })
  };
};
