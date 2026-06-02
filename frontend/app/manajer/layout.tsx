"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [nama, setNama] = useState("MANAJER");
  const pathname = usePathname();

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

    // Retrieve role and name
    const currentRole = getCookie("role") || localStorage.getItem("role");
    const currentNama = getCookie("nama") || localStorage.getItem("nama");

    if (currentRole?.toLowerCase() === "manajer") {
      setAuthorized(true);
      if (currentNama) setNama(currentNama);
    } else {
      // Redirect unauthorized roles back to portal admin
      setTimeout(() => {
        window.location.href = "/portal-admin";
      }, 1000);
    }
  }, []);

  const handleLogout = () => {
    // Clear cookies
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "idUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "nama=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    
    // Clear localStorage
    localStorage.clear();
    
    // Redirect to home
    window.location.href = "/";
  };

  if (!mounted) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif"
      }}>
        <p style={{ color: "#71717a", fontSize: "14px" }}>Memuat modul...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        padding: "24px",
        textAlign: "center"
      }}>
        <div style={{
          fontSize: "48px",
          marginBottom: "16px"
        }}>🔒</div>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#ef4444", margin: "0 0 8px 0" }}>Akses Terbatas</h2>
        <p style={{ fontSize: "13px", color: "#71717a", margin: "0 0 16px 0", maxWidth: "360px" }}>
          Halaman ini khusus untuk peran <strong>Manajer</strong>. Anda tidak memiliki otoritas atau sesi Anda telah kedaluwarsa.
        </p>
        <p style={{ fontSize: "11px", color: "#a1a1aa" }}>Mengalihkan ke gerbang portal masuk...</p>
      </div>
    );
  }

  // Define sidebar menu options
  const menuItems = [
    { name: "💼 Laporan Keuangan", path: "/manajer/keuangan" },
    { name: "👥 Manajemen Staf", path: "/manajer/staf" },
    { name: "🕒 Penjadwalan Shift", path: "/manajer/shift" },
    { name: "💸 Persetujuan Refund", path: "/manajer/refund" },
    { name: "🎪 Tenant & Booth", path: "/manajer/tenant" },
    { name: "📅 Rundown & Artis", path: "/manajer/rundown" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      display: "flex",
      fontFamily: "var(--font-outfit), sans-serif",
      color: "#0f172a"
    }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: "260px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 10,
        padding: "24px 16px"
      }}>
        {/* Brand Header */}
        <div style={{ marginBottom: "32px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <Link href="/" style={{
            fontSize: "20px",
            fontWeight: "900",
            letterSpacing: "-0.05em",
            color: "#4f46e5",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            TIXEVENT <span style={{ fontSize: "11px", backgroundColor: "#e0e7ff", color: "#4f46e5", padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>SUPER</span>
          </Link>
          <span style={{ fontSize: "11px", color: "#64748b" }}>Dashboard Manajer</span>
        </div>

        {/* Sidebar Profile Container */}
        <div style={{
          marginBottom: "24px",
          padding: "12px",
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0"
        }}>
          <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 2px 0", textTransform: "uppercase", fontWeight: "700" }}>LOGGED IN AS</p>
          <p style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a", margin: "0 0 2px 0" }}>{nama}</p>
          <span style={{ fontSize: "10px", color: "#6366f1", fontWeight: "700" }}>👑 SUPER ADMIN</span>
        </div>

        {/* Menu Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: isActive ? "700" : "500",
                  color: isActive ? "#4f46e5" : "#475569",
                  backgroundColor: isActive ? "#eeebff" : "transparent",
                  borderLeft: isActive ? "3px solid #4f46e5" : "3px solid transparent",
                  transition: "all 0.2s"
                }}>
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              color: "#475569",
              backgroundColor: "#f1f5f9",
              textAlign: "center"
            }}>
              🏠 Halaman Utama (Beranda)
            </div>
          </Link>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "700",
              color: "#ef4444",
              backgroundColor: "#fef2f2",
              border: "1px solid #fee2e2",
              cursor: "pointer",
              textAlign: "center"
            }}
          >
            ❌ Log Out (Keluar)
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{
        marginLeft: "260px",
        flex: 1,
        minWidth: 0,
        boxSizing: "border-box"
      }}>
        {/* Top Header Bar */}
        <header style={{
          height: "64px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          position: "sticky",
          top: 0,
          zIndex: 5
        }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>
            Status Server: <span style={{ color: "#22c55e", fontWeight: "700" }}>● MOCK FRONTEND ONLINE</span>
          </div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            TixEvent Enterprise Edition v2.0
          </div>
        </header>

        {/* Dynamic Inner Viewport */}
        <div style={{
          padding: "32px",
          boxSizing: "border-box"
        }}>
          {children}
        </div>
      </main>
    </div>
  );
}
