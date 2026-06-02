"use client";

import { useState } from "react";
import Link from "next/link";

export default function VisitorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan Password wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Simulate instant client-side frontend authentication
    setTimeout(() => {
      setSuccess("Login Pengunjung Sukses (Frontend Simulation)!");
      
      // Save data for client-side use
      localStorage.setItem("role", "pengunjung");
      localStorage.setItem("idUser", "USR-MOCK-VISITOR");
      localStorage.setItem("nama", email.split("@")[0].toUpperCase());
      
      // Save to cookies for middleware route guard checks
      document.cookie = "role=pengunjung; path=/; max-age=86400";
      document.cookie = "idUser=USR-MOCK-VISITOR; path=/; max-age=86400";
      document.cookie = `nama=${email.split("@")[0].toUpperCase()}; path=/; max-age=86400`;

      setTimeout(() => {
        window.location.href = "/pengunjung/tiket";
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
            color: "#4f46e5",
            textDecoration: "none"
          }}>
            TIXEVENT
          </Link>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#18181b", margin: "16px 0 4px 0" }}>Login Pengunjung</h2>
          <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>Masukkan akun pengunjung untuk memesan tiket (Simulasi Frontend)</p>
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
            <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a" }} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
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
              backgroundColor: "#4f46e5",
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
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>
            Belum punya akun?{" "}
            <Link href="/register" style={{ color: "#4f46e5", fontWeight: "600", textDecoration: "none" }}>
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
