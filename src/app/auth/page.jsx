"use client"

import React from "react"

export default function KamdridiHome() {
  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "sans-serif"
      }}
    >
      {/* HEADER */}
      <nav
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          borderBottom: "1px solid #333"
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            letterSpacing: "8px",
            fontWeight: "bold"
          }}
        >
          KAMDRIDI EMPIRE
        </h1>
      </nav>

      {/* HERO SECTION */}
      <div
        style={{
          height: "80vh",
          backgroundImage:
            'url("https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            textAlign: "center",
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "50px"
          }}
        >
          <h2 style={{ fontSize: "3rem", marginBottom: "20px" }}>
            RAW POWER
          </h2>
          <p style={{ fontSize: "1.2rem" }}>
            The Empire Begins.
          </p>
        </div>
      </div>
    </div>
  )
}
