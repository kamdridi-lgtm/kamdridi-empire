const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { supabaseAdmin } = require('./_supabaseAdmin');

function resp(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': process.env.SITE_URL || '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return resp(200, {});
  if (event.httpMethod !== 'POST') return resp(405, { error: 'Method not allowed' });

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch { return resp(400, { error: 'Invalid JSON' }); }

  const { priceId, userId, type='subscription' } = body;
  if (!priceId || !userId) return resp(400, { error: 'priceId and userId required' });

  const { data: existing } = await supabaseAdmin.from('members').select('stripe_customer_id').eq('user_id', userId).single();
  let customerId = existing?.stripe_customer_id;

  if (!customerId) {
    const { data: profile } = await supabaseAdmin.from('profiles').select('email').eq('id', userId).single();
    const customer = await stripe.customers.create({ email: profile?.email, metadata: { user_id: userId, source: 'kamdridi' } });
    customerId = customer.id;
    await supabaseAdmin.from('members').upsert({ user_id: userId, stripe_customer_id: customerId }, { onConflict: 'user_id' });
  }

  const sessionConfig = {
    customer: customerId,
    success_url: `${process.env.SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.SITE_URL}/cancel`,
    metadata: { user_id: userId, type },
    allow_promotion_codes: true,
  };

  const session = (type === 'subscription')
    ? await stripe.checkout.sessions.create({
        ...sessionConfig,
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        subscription_data: { metadata: { user_id: userId } },
      })
    : await stripe.checkout.sessions.create({
        ...sessionConfig,
        mode: 'payment',
        line_items: [{ price: priceId, quantity: 1 }],
      });

  return resp(200, { sessionId: session.id, url: session.url });
};
