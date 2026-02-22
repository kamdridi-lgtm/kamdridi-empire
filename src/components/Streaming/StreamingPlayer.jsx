'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function StreamingPlayer({ track }) {
  const { accessToken } = useAuth();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const ensureUrl = async () => {
    if (track.audio_file_url) return track.audio_file_url;
    const res = await fetch('/.netlify/functions/member-gate', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ requiredTier: track.tier_required, contentId: track.id })
    });
    const json = await res.json().catch(()=>({}));
    return json?.content?.signedUrl || '';
  };

  const toggle = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    if (!audioRef.current.src) {
      const url = await ensureUrl();
      if (!url) { alert('No audio url yet. Put audio_file_url or implement signed URLs.'); return; }
      audioRef.current.src = url;
    }
    await audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-black via-gray-900 to-purple-900 overflow-hidden shadow-2xl">
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xl font-black">{track.title}</div>
            <div className="text-white/60">{track.description}</div>
          </div>
          <motion.button whileTap={{scale:0.95}} onClick={toggle}
            className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center">
            {isPlaying ? <Pause /> : <Play />}
          </motion.button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Volume2 className="text-white/60" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e)=> {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (audioRef.current) audioRef.current.volume = v;
            }}
            className="w-full"
          />
        </div>

        <audio ref={audioRef} preload="metadata" />
        <div className="mt-4 text-xs text-white/50">
          Tip: set streaming_content.audio_file_url OR implement Supabase Storage signed URL in member-gate.
        </div>
      </div>
    </div>
  );
}
