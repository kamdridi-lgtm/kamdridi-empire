'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="px-6 py-12 max-w-6xl mx-auto">
      <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="text-4xl md:text-6xl font-black">
        KAMDRIDI <span className="gradient-text">EMPIRE</span>
      </motion.h1>
      <p className="mt-4 text-white/70 text-lg">
        Membership • Premium Streaming • Analytics • NASA Diagnostics
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition" href="/auth">Auth</Link>
        <Link className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition" href="/membership">Membership</Link>
        <Link className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition" href="/streaming">Streaming</Link>
        <Link className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition" href="/analytics">Analytics</Link>
      </div>

      <div className="mt-10 text-sm text-white/60 space-x-4">
        <a className="underline" href="/.netlify/functions/health" target="_blank">health</a>
        <a className="underline" href="/.netlify/functions/status" target="_blank">status</a>
      </div>
    </main>
  );
}
