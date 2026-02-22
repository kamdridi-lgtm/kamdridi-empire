'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import StreamingPlayer from './StreamingPlayer';
import MembershipGate from '@/components/Membership/MembershipGate';

export default function StreamingHub() {
  const [tracks, setTracks] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(()=>{ load(); }, []);

  const load = async () => {
    const { data } = await supabase
      .from('streaming_content')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(25);
    setTracks(data || []);
    setSelected((data && data[0]) || null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="font-bold mb-3">Tracks</div>
        <div className="space-y-2 max-h-[520px] overflow-auto pr-2">
          {tracks.map((t)=>(
            <button
              key={t.id}
              onClick={()=>setSelected(t)}
              className={`w-full text-left rounded-xl p-3 border transition ${
                selected?.id===t.id ? 'border-purple-500/60 bg-purple-500/10' : 'border-white/10 hover:bg-white/5'
              }`}
            >
              <div className="font-semibold">{t.title}</div>
              <div className="text-xs text-white/50">{t.tier_required} • {t.is_hidden ? 'hidden' : 'public'}</div>
            </button>
          ))}
          {!tracks.length && <div className="text-white/60 text-sm">No tracks yet. Insert rows into streaming_content.</div>}
        </div>
      </div>

      <div className="md:col-span-2">
        {selected ? (
          <MembershipGate requiredTier={selected.tier_required} contentId={selected.id}>
            <StreamingPlayer track={selected} />
          </MembershipGate>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">Select a track</div>
        )}
      </div>
    </div>
  );
}
