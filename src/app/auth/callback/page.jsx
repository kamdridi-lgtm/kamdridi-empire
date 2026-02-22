'use client';
import { useEffect, useState } from 'react';

export default function CallbackPage() {
  const [msg, setMsg] = useState('Completing sign-in...');
  useEffect(() => {
    const t = setTimeout(() => {
      setMsg('Signed in. Redirecting...');
      window.location.href = '/membership';
    }, 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">{msg}</div>
    </main>
  );
}
