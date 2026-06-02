"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminPortalLogin() {
  const [role, setRole] = useState("manajer"); // default to manajer
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !role) {
      setError("Semua kolom isian wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Simulate instant client-side frontend admin portal authentication
    setTimeout(() => {
      const roleNameFormatted = role.charAt(0).toUpperCase() + role.slice(1);
      setSuccess(`Login Staf (${roleNameFormatted}) Sukses (Frontend Simulation)!`);
      
      // Save data for client-side use
      localStorage.setItem("role", role);
      localStorage.setItem("idUser", "STF-MOCK-ID");
      localStorage.setItem("nama", `Lutfi ${roleNameFormatted}`);
      
      // Save to cookies for middleware route guard checks
      document.cookie = `role=${role}; path=/; max-age=86400`;
      document.cookie = `idUser=STF-MOCK-ID; path=/; max-age=86400`;
      document.cookie = `nama=Lutfi ${roleNameFormatted}; path=/; max-age=86400`;

      setTimeout(() => {
        if (role === "manajer") {
          window.location.href = "/manajer/rundown";
        } else if (role === "panitia") {
          window.location.href = "/panitia/check-in";
        } else {
          window.location.href = "/crew/absensi";
        }
      }, 1000);
    }, 500);
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
        boxSizing: "border-box",
        backgroundColor: "#ffffff"
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Link href="/" style={{
            fontSize: "24px",
            fontWeight: "800",
            letterSpacing: "-0.05em",
            color: "#18181b",
            textDecoration: "none"
          }}>
            TIXEVENT <span style={{ color: "#71717a", fontSize: "18px" }}>PORTAL</span>
          </Link>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#18181b", margin: "16px 0 4px 0" }}>Login Staf Internal</h2>
          <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>Halaman masuk khusus untuk Manajer, Panitia, dan Kru Lapangan (Simulasi Frontend)</p>
        </div>

        {error && (
          <div style={{
            marginBottom: "16px",
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            fontSize: "12px",
            fontWeight: "600"
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            marginBottom: "16px",
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#059669",
            fontSize: "12px",
            fontWeight: "600"
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a" }} htmlFor="role">
              Pilih Hak Akses / Jabatan
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "#fafafa",
                border: "1px solid #e4e4e7",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "14px",
                color: "#18181b",
                outline: "none",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              <option value="manajer">Manajer (Super Admin)</option>
              <option value="panitia">Panitia (Gate keeper)</option>
              <option value="kru">Kru Lapangan (Staff)</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a" }} htmlFor="email">
              Email Staf
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staf@email.com"
              style={{
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "#fafafa",
                border: "1px solid #e4e4e7",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "14px",
                color: "#18181b",
                outline: "none"
              }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a" }} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "#fafafa",
                border: "1px solid #e4e4e7",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "14px",
                color: "#18181b",
                outline: "none"
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "#27272a",
              color: "#ffffff",
              border: "none",
              fontWeight: "600",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              marginTop: "8px",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Memproses..." : "Masuk ke Sistem"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <Link href="/" style={{ color: "#71717a", fontWeight: "600", textDecoration: "none", fontSize: "12px" }}>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
