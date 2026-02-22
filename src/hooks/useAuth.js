'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const H = { INNER: 1, COLLECTOR: 2, VIP: 3 };

export function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function init() {
      const { data } = await supabase.auth.getSession();
      if (ignore) return;
      setSession(data?.session || null);
      setUser(data?.session?.user || null);
      setLoading(false);
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user || null);
    });

    return () => {
      ignore = true;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const accessToken = session?.access_token || null;

  const hasAccess = (requiredTier = 'INNER') => {
    const mt = member?.tier || 'INNER';
    return (H[mt] || 0) >= (H[requiredTier] || 1);
  };

  const refreshMember = async () => {
    if (!user) { setMember(null); return; }
    try {
      const res = await fetch('/.netlify/functions/me', {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
      const json = await res.json();
      setMember(json.member || null);
    } catch {
      setMember(null);
    }
  };

  useEffect(() => { refreshMember(); }, [user?.id]);

  return { user, session, accessToken, member, loading, hasAccess, refreshMember };
}
