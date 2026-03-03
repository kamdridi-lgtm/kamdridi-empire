"use client";

export const dynamic = "force-dynamic";

import React from 'react';

export default function AuthPage() {
  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw',
      margin: 0,
      padding: 0,
      backgroundImage: 'url("https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=2070&auto=format&fit=crop")', 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      {/* Ton Logo Kamdridi */}
      <div style={{ position: 'absolute', top: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', letterSpacing: '5px', margin: 0 }}>KAMDRIDI</h1>
        <p style={{ margin: 0, opacity: 0.8 }}>EMPIRE</p>
      </div>

      {/* Ton texte principal */}
      <div style={{ textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: '40px', borderRadius: '10px' }}>
        <h2 style={{ fontSize: '4rem', margin: '0 0 10px 0' }}>TOO FAST</h2>
        <h2 style={{ fontSize: '4rem', margin: '0 0 20px 0' }}>TOO YOUNG</h2>
        <button style={{ 
          backgroundColor: '#ff4d4d', 
          color: 'white', 
          border: 'none', 
          padding: '15px 30px', 
          fontSize: '1.2rem', 
          fontWeight: 'bold',
          cursor: 'pointer',
          borderRadius: '5px'
        }}>
          UNLOCK ACCESS
        </button>
      </div>
    </div>
  );
}
