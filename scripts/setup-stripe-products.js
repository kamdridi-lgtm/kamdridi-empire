const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function setupStripeProducts() {
  console.log('🚀 Setting up Stripe products for KamDridi...');

  const tiers = [
    { name: 'KamDridi INNER', tier: 'INNER', price: 999 },
    { name: 'KamDridi COLLECTOR', tier: 'COLLECTOR', price: 1999 },
    { name: 'KamDridi VIP', tier: 'VIP', price: 4999 },
  ];

  const out = {};
  for (const t of tiers) {
    const product = await stripe.products.create({
      name: t.name,
      description: `${t.tier} membership`,
      metadata: { tier: t.tier, type: 'subscription' },
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: t.price,
      currency: 'eur',
      recurring: { interval: 'month' },
      metadata: { tier: t.tier },
    });

    out[t.tier] = price.id;
    console.log(`✅ ${t.tier}: ${price.id}`);
  }

  console.log('\n🔥 Put these in .env.local + Netlify env:');
  console.log(`STRIPE_PRICE_INNER=${out.INNER}`);
  console.log(`STRIPE_PRICE_COLLECTOR=${out.COLLECTOR}`);
  console.log(`STRIPE_PRICE_VIP=${out.VIP}`);
}

if (require.main === module) setupStripeProducts().catch(e => { console.error(e); process.exit(1); });
