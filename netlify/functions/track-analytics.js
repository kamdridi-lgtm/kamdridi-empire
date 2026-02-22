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

  const { eventType, contentId = null, eventData = {} } = body;
  if (!eventType) return resp(400, { error: 'Missing eventType' });

  await supabaseAdmin.from('user_analytics').insert({
    user_id: userData.user.id,
    event_type: eventType,
    content_id: contentId,
    event_data: eventData,
    created_at: new Date().toISOString(),
  });

  return resp(200, { ok: true });
};
