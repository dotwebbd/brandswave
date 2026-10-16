"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ background: "#0A1424", color: "#EEF3F1", fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 32, marginBottom: 12 }}>BrandsWave is having trouble</h1>
          <p style={{ opacity: 0.7, marginBottom: 24 }}>Please reload the page.</p>
          <button onClick={reset} style={{ background: "#86D9C6", color: "#0A1424", border: 0, borderRadius: 999, padding: "12px 24px", fontWeight: 600, cursor: "pointer" }}>
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
