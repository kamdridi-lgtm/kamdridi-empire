const { supabaseAdmin } = require('./_supabaseAdmin');

function resp(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': process.env.SITE_URL || '*',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return resp(200, {});
  if (event.httpMethod !== 'POST') return resp(405, { error: 'Method not allowed' });

  const authHeader = event.headers.authorization || event.headers.Authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  if (!token) return resp(401, { error: 'Missing token' });

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData?.user) return resp(401, { error: 'Invalid token' });

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch { return resp(400, { error: 'Invalid JSON' }); }

  const requiredTier = body.requiredTier || 'INNER';
  const contentId = body.contentId || null;

  const { data: member } = await supabaseAdmin.from('members').select('*').eq('user_id', userData.user.id).single();
  if (!member) return resp(200, { access: false, reason: 'no_membership' });

  const tier = member.tier || 'INNER';
  const status = member.status || 'expired';

  const now = new Date();
  const end = member.current_period_end ? new Date(member.current_period_end) : null;
  const trialEnd = member.trial_end_date ? new Date(member.trial_end_date) : null;

  const active =
    (status === 'active' && end && end > now) ||
    (status === 'trial' && trialEnd && trialEnd > now);

  if (!active) return resp(200, { access: false, reason: 'membership_expired' });

  const H = { INNER: 1, COLLECTOR: 2, VIP: 3 };
  const okTier = (H[tier] || 0) >= (H[requiredTier] || 1);
  if (!okTier) return resp(200, { access: false, reason: 'insufficient_tier', currentTier: tier, requiredTier });

  return resp(200, { access: true, memberTier: tier, memberStatus: status, content: { contentId, signedUrl: null } });
};
