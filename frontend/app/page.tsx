"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [nama, setNama] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    // Simple helper to read Cookies
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    // Read profile from Cookie or LocalStorage
    const currentRole = getCookie("role") || localStorage.getItem("role");
    const currentNama = getCookie("nama") || localStorage.getItem("nama");

    if (currentRole) setRole(currentRole.toLowerCase());
    if (currentNama) setNama(currentNama);
  }, []);

  const handleLogout = () => {
    // Clear cookies
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "idUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "nama=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    // Clear localStorage
    localStorage.clear();

    // Reload page
    window.location.reload();
  };

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
        maxWidth: "450px",
        padding: "32px",
        border: "1px solid #e4e4e7",
        borderRadius: "16px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        textAlign: "center",
        boxSizing: "border-box",
        backgroundColor: "#ffffff"
      }}>
        <h1 style={{
          fontSize: "28px",
          fontWeight: "800",
          letterSpacing: "-0.05em",
          color: "#4f46e5",
          margin: "0 0 8px 0"
        }}>TIXEVENT</h1>
        <p style={{
          fontSize: "14px",
          color: "#71717a",
          margin: "0 0 16px 0",
          lineHeight: "1.5"
        }}>Precision & High-Performance Event Management Platform</p>

        {/* Dynamic Welcome Header if logged in */}
        {mounted && role && (
          <div style={{
            marginBottom: "24px",
            padding: "16px",
            borderRadius: "10px",
            backgroundColor: "#f4f4f5",
            border: "1px solid #e4e4e7"
          }}>
            <p style={{ fontSize: "13px", margin: "0 0 4px 0", color: "#18181b" }}>
              Halo, <strong>{nama}</strong>!
            </p>
            <p style={{ fontSize: "11px", margin: "0 0 12px 0", textTransform: "uppercase", fontWeight: "700", color: "#6366f1" }}>
              Masuk sebagai: {role}
            </p>

            {/* Quick Access Dashboard Buttons for Staff roles */}
            {role === "manajer" && (
              <Link href="/manajer/rundown" style={{ textDecoration: "none", display: "block", marginBottom: "12px" }}>
                <button style={{
                  width: "100%",
                  backgroundColor: "#6366f1",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "700",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}>
                  💼 Buka Panel Kontrol Manajer
                </button>
              </Link>
            )}
            {role === "panitia" && (
              <Link href="/panitia/check-in" style={{ textDecoration: "none", display: "block", marginBottom: "12px" }}>
                <button style={{
                  width: "100%",
                  backgroundColor: "#6366f1",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "700",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}>
                  🎟️ Buka Check-In Tiket
                </button>
              </Link>
            )}
            {(role === "kru" || role === "crew") && (
              <Link href="/crew/absensi" style={{ textDecoration: "none", display: "block", marginBottom: "12px" }}>
                <button style={{
                  width: "100%",
                  backgroundColor: "#6366f1",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "700",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}>
                  🕒 Buka Absensi Kru Lapangan
                </button>
              </Link>
            )}

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#fecaca",
                color: "#b91c1c",
                border: "none",
                fontSize: "10px",
                fontWeight: "700",
                padding: "6px 10px",
                borderRadius: "4px",
                cursor: "pointer",
                width: "100%"
              }}
            >
              LOGOUT (KELUAR)
            </button>
          </div>
        )}

        {/* Gerbang 1: Area Publik / Pengunjung */}
        <div style={{
          marginBottom: "20px",
          padding: "16px",
          border: "1px solid #f4f4f5",
          borderRadius: "12px",
          backgroundColor: "#fafafa"
        }}>
          <h2 style={{
            fontSize: "12px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#52525b",
            margin: "0 0 12px 0"
          }}>Portal Pengunjung</h2>

          {mounted && role === "pengunjung" ? (
            // Logged in as visitor: show features!
            <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
              <Link href="/pengunjung/tiket" style={{ textDecoration: "none" }}>
                <button style={{
                  width: "100%",
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "600",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px"
                }}>
                  🎟️ Beli Tiket Konser
                </button>
              </Link>
              <Link href="/pengunjung/refund" style={{ textDecoration: "none" }}>
                <button style={{
                  width: "100%",
                  border: "1px solid #4f46e5",
                  color: "#4f46e5",
                  backgroundColor: "transparent",
                  fontWeight: "600",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px"
                }}>
                  💸 Ajukan Refund Tiket
                </button>
              </Link>
            </div>
          ) : (
            // Not logged in or another role: show login
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Link href="/login" style={{ flex: 1, textDecoration: "none" }}>
                <button style={{
                  width: "100%",
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "600",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px"
                }}>
                  Masuk (Login)
                </button>
              </Link>
              <Link href="/register" style={{ flex: 1, textDecoration: "none" }}>
                <button style={{
                  width: "100%",
                  border: "1px solid #4f46e5",
                  color: "#4f46e5",
                  backgroundColor: "transparent",
                  fontWeight: "600",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px"
                }}>
                  Daftar Akun
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Gerbang 2: Area Mitra (Tenant) */}
        <div style={{
          marginBottom: "20px",
          padding: "16px",
          border: "1px solid #f4f4f5",
          borderRadius: "12px",
          backgroundColor: "#fafafa"
        }}>
          <h2 style={{
            fontSize: "12px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#52525b",
            margin: "0 0 12px 0"
          }}>Portal Mitra (Tenant)</h2>

          {mounted && role === "tenant" ? (
            // Logged in as tenant: show booth selection!
            <Link href="/tenant/booth" style={{ textDecoration: "none" }}>
              <button style={{
                width: "100%",
                backgroundColor: "#059669",
                color: "#ffffff",
                border: "none",
                fontWeight: "600",
                padding: "10px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px"
              }}>
                🎪 Pilih & Sewa Booth Stan
              </button>
            </Link>
          ) : (
            // Show tenant login
            <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
              <Link href="/mitra/login" style={{ textDecoration: "none" }}>
                <button style={{
                  width: "100%",
                  backgroundColor: "#059669",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "600",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px"
                }}>
                  Masuk Kamar Tenant
                </button>
              </Link>
              {!role && (
                <Link href="/gabung-mitra" style={{ textDecoration: "none", fontSize: "11px", color: "#059669", fontWeight: "700", marginTop: "4px", display: "inline-block" }}>
                  Berminat Sewa Stan? Registrasi Calon Mitra
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Gerbang 4: Jadwal Umum (Tanpa Login) */}
        <div style={{
          padding: "16px",
          border: "1px solid #f4f4f5",
          borderRadius: "12px",
          backgroundColor: "#fafafa"
        }}>
          <h2 style={{
            fontSize: "12px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#52525b",
            margin: "0 0 12px 0"
          }}>Informasi Umum</h2>
          <Link href="/jadwal" style={{ textDecoration: "none" }}>
            <button style={{
              width: "100%",
              backgroundColor: "#d97706",
              color: "#ffffff",
              border: "none",
              fontWeight: "600",
              padding: "10px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px"
            }}>
              📅 Lihat Rundown & Lineup Artis
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
