const { supabaseAdmin } = require('./_supabaseAdmin');

function resp(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': process.env.SITE_URL || '*' }, body: JSON.stringify(body) };
}

exports.handler = async (event) => {
  const authHeader = event.headers.authorization || event.headers.Authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  if (!token) return resp(200, { user: null, member: null });

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return resp(200, { user: null, member: null });

  const { data: member } = await supabaseAdmin.from('members').select('*').eq('user_id', data.user.id).single();
  return resp(200, { user: { id: data.user.id, email: data.user.email }, member: member || null });
};
