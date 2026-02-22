export const dynamic = "force-dynamic";
'use client';

import StreamingHub from '@/components/Streaming/StreamingHub';

export default function Page() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-black mb-6">Streaming</h2>
      <StreamingHub />
    </main>
  );
}
