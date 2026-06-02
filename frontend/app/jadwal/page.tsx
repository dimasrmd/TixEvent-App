"use client";

import Link from "next/link";

interface ScheduleItem {
  id: string;
  artist: string;
  panggung: string;
  waktu: string;
  keterangan: string;
}

export default function ScheduleLineup() {
  // Mock lineup data matching EventSchedule structure in backend
  const schedules: ScheduleItem[] = [
    {
      id: "SCH-001",
      artist: "Hologram DJ Pulse",
      panggung: "Neon Main Stage",
      waktu: "19:00 - 20:30 WIB",
      keterangan: "Electronic Pulse Live Opening Set"
    },
    {
      id: "SCH-002",
      artist: "Vaporwave Symphony",
      panggung: "Cyber Dome Stage",
      waktu: "21:00 - 22:30 WIB",
      keterangan: "Retro Synth & Immersive Soundscapes"
    },
    {
      id: "SCH-003",
      artist: "Acid Bass Collective",
      panggung: "Synth Cave Stage",
      waktu: "23:00 - 00:30 WIB",
      keterangan: "Deep Bass & Immersive Light Displays"
    },
    {
      id: "SCH-004",
      artist: "Neon Rhythm Orchestra",
      panggung: "Neon Main Stage",
      waktu: "01:00 - 03:00 WIB",
      keterangan: "Spectacular Laser Finale Closing Set"
    }
  ];

  return (
    <main style={{
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      color: "#09090b",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "sans-serif",
      boxSizing: "border-box"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "500px",
        padding: "32px",
        border: "1px solid #e4e4e7",
        borderRadius: "16px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        boxSizing: "border-box",
        backgroundColor: "#ffffff"
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#18181b", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>Jadwal Acara & Lineup</h2>
          <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>Daftar penampil resmi dan rundown jam tampil di panggung</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
          {schedules.map((item) => (
            <div key={item.id} style={{
              padding: "16px",
              border: "1px solid #e4e4e7",
              borderRadius: "12px",
              backgroundColor: "#fafafa"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#18181b", margin: 0 }}>{item.artist}</h3>
                <span style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  backgroundColor: "#e0e7ff",
                  color: "#4338ca",
                  padding: "4px 8px",
                  borderRadius: "6px"
                }}>
                  {item.id}
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#4f46e5", fontWeight: "600", margin: "0 0 4px 0" }}>
                📍 {item.panggung}
              </p>
              <p style={{ fontSize: "12px", color: "#059669", fontWeight: "700", margin: "0 0 6px 0" }}>
                🕒 {item.waktu}
              </p>
              <p style={{ fontSize: "12px", color: "#71717a", margin: 0, fontStyle: "italic" }}>
                {item.keterangan}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/" style={{ color: "#71717a", fontWeight: "600", textDecoration: "none", fontSize: "12px" }}>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
