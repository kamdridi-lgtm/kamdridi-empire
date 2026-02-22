const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { supabaseAdmin } = require('./_supabaseAdmin');

function resp(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

function mapStripePriceToTier(priceId) {
  const tierMap = {
    [process.env.STRIPE_PRICE_INNER]: 'INNER',
    [process.env.STRIPE_PRICE_COLLECTOR]: 'COLLECTOR',
    [process.env.STRIPE_PRICE_VIP]: 'VIP'
  };
  return tierMap[priceId] || 'INNER';
}

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return resp(400, { error: 'Invalid signature' });
  }

  try {
    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await upsertSubscription(stripeEvent.data.object);
        break;
      case 'customer.subscription.deleted':
        await cancelSubscription(stripeEvent.data.object);
        break;
      case 'invoice.payment_failed':
        await markPastDue(stripeEvent.data.object);
        break;
      default:
        break;
    }
    return resp(200, { received: true, type: stripeEvent.type });
  } catch (e) {
    return resp(500, { error: 'Processing failed' });
  }
};

async function upsertSubscription(subscription) {
  const priceId = subscription.items?.data?.[0]?.price?.id;
  const tier = mapStripePriceToTier(priceId);
  const status = subscription.status === 'active' ? 'active' : subscription.status;

  const payload = {
    stripe_customer_id: subscription.customer,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    tier,
    status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  };

  await supabaseAdmin.from('members').upsert(payload, { onConflict: 'stripe_customer_id' });
}

async function cancelSubscription(subscription) {
  await supabaseAdmin.from('members')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', subscription.id);
}

async function markPastDue(invoice) {
  if (!invoice.subscription) return;
  await supabaseAdmin.from('members')
    .update({ status: 'past_due', updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', invoice.subscription);
}
