'use client';
import { useState } from 'react';
import { signInWithEmail } from '@/lib/supabase';

export default function MagicLinkAuth() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signInWithEmail(email);
    if (error) alert(error.message);
    else setSent(true);
    setLoading(false);
  };

  if (sent) return (
    <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6">
      <div className="font-bold text-green-200">Check your email</div>
      <div className="text-green-200/70 mt-1">Magic link sent to {email}</div>
    </div>
  );

  return (
    <form onSubmit={handle} className="space-y-4">
      <input
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none"
        placeholder="you@email.com"
        type="email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        required
      />
      <button disabled={loading} className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50">
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>
    </form>
  );
}
