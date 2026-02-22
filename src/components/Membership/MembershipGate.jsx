'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function MembershipGate({ children, requiredTier='INNER', contentId=null }) {
  const { user, accessToken } = useAuth();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(()=> {
    let ignore = false;
    async function run() {
      if (!user || !accessToken) { setAllowed(false); setChecking(false); return; }
      setChecking(true);
      const res = await fetch('/.netlify/functions/member-gate', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ requiredTier, contentId })
      });
      const json = await res.json().catch(()=>({}));
      if (!ignore) { setAllowed(!!json.access); setChecking(false); }
    }
    run();
    return ()=>{ ignore = true; };
  }, [user?.id, accessToken, requiredTier, contentId]);

  if (checking) return (
    <div className="flex items-center justify-center p-8">
      <motion.div animate={{rotate:360}} transition={{duration:1, repeat:Infinity, ease:'linear'}}
        className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!allowed) return (
    <div className="rounded-2xl p-8 border border-white/10 bg-gradient-to-r from-purple-600 to-pink-600 text-center">
      <Lock className="mx-auto mb-4" />
      <h3 className="text-2xl font-black mb-2">Members Only</h3>
      <p className="text-white/80">Upgrade to access this content.</p>
      <a href="/membership" className="inline-block mt-6 bg-white text-black font-semibold px-6 py-3 rounded-full">Upgrade</a>
    </div>
  );

  return <>{children}</>;
}
