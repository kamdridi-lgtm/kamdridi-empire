'use client';
import { useState } from 'react';
import { startCheckout } from '@/lib/stripe';
import { useAuth } from '@/hooks/useAuth';

const PLANS = [
  { tier: 'INNER', env: 'STRIPE_PRICE_INNER', display: '9.99€/mo', desc: 'Exclusive content + early drops' },
  { tier: 'COLLECTOR', env: 'STRIPE_PRICE_COLLECTOR', display: '19.99€/mo', desc: 'More access + merch priority' },
  { tier: 'VIP', env: 'STRIPE_PRICE_VIP', display: '49.99€/mo', desc: 'Ultimate access + limited editions' },
];

export default function MembershipPlans() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(null);

  const subscribe = async (tier) => {
    if (!user) { window.location.href = '/auth'; return; }
    const p = PLANS.find(x=>x.tier===tier);
    const priceId = process.env[p.env];
    if (!priceId) { alert(`Missing env ${p.env}. Run stripe:setup then set it.`); return; }
    setLoading(tier);
    try {
      const { url } = await startCheckout({ priceId, userId: user.id, type: 'subscription' });
      window.location.href = url;
    } catch (e) {
      alert(String(e?.message || e));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {PLANS.map((p)=>(
        <div key={p.tier} className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-white/60 text-sm">{p.tier}</div>
          <div className="text-3xl font-black mt-2">{p.display}</div>
          <div className="text-white/70 mt-2">{p.desc}</div>
          <button
            className="mt-6 w-full rounded-xl py-3 bg-white text-black font-semibold hover:bg-white/90 disabled:opacity-60"
            onClick={()=>subscribe(p.tier)}
            disabled={loading===p.tier}
          >
            {loading===p.tier ? 'Redirecting…' : 'Subscribe'}
          </button>
          <div className="mt-3 text-xs text-white/40">Env: {p.env}</div>
        </div>
      ))}
    </div>
  );
}
