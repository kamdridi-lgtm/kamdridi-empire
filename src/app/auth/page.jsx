"use client";
export const dynamic = "force-dynamic";
import React from 'react';

export default function KamdridiHome() {
  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER / LOGO */}
      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'center', borderBottom: '1px solid #333' }}>
        <h1 style={{ fontSize: '2rem', letterSpacing: '8px', fontWeight: 'bold' }}>KAMDRIDI EMPIRE</h1>
      </nav>

      {/* SECTION HERO (IMAGE DE LA FEMME) */}
      <div style={{ 
        height: '80vh', 
        backgroundImage: 'url("https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=2070&auto=format&fit=crop")', // On remplacera par ton fichier hero.png plus tard
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: '50px' }}>
          <h2 style={{ fontSize: '5rem', margin: 0, lineHeight: '1' }}>TOO FAST</h2>
          <h2 style={{ fontSize: '5rem', margin: 0 }}>TOO YOUNG</h2>
        </div>
      </div>

      {/* ZONE POUR TES 3000 PROCHAINS TRUCS (GRILLE) */}
      <div style={{ padding: '50px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={{ border: '1px solid #444', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Section 1 (Boutique)</div>
        <div style={{ border: '1px solid #444', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Section 2 (Médias)</div>
        <div style={{ border: '1px solid #444', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Section 3 (Events)</div>
      </div>

    </div>
  );
}
