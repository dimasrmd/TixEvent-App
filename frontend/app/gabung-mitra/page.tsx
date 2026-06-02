"use client";

import { useState } from "react";
import Link from "next/link";

export default function PartnerRegister() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !email || !noHp || !password) {
      setError("Semua kolom isian wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Simulate instant client-side tenant registration
    setTimeout(() => {
      setSuccess("Pendaftaran Mitra Berhasil! Mengalihkan ke Halaman Login Tenant...");
      setNama("");
      setEmail("");
      setNoHp("");
      setPassword("");
      
      setTimeout(() => {
        window.location.href = "/mitra/login";
      }, 1500);
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
            color: "#059669",
            textDecoration: "none"
          }}>
            TIXEVENT MITRA
          </Link>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#18181b", margin: "16px 0 4px 0" }}>Registrasi Mitra (Tenant)</h2>
          <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>Daftarkan akun penyewa booth stan di TixEvent (Simulasi Frontend)</p>
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
            fontWeight: "600",
            lineHeight: "1.4"
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a" }} htmlFor="nama">
              Nama Lengkap Mitra
            </label>
            <input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama pemilik usaha"
              style={{
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "#fafafa",
                border: "1px solid #e4e4e7",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "13px",
                color: "#18181b",
                outline: "none"
              }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a" }} htmlFor="email">
              Email Usaha
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mitra@email.com"
              style={{
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "#fafafa",
                border: "1px solid #e4e4e7",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "13px",
                color: "#18181b",
                outline: "none"
              }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a" }} htmlFor="noHp">
              Nomor Telepon (No. HP)
            </label>
            <input
              id="noHp"
              type="tel"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              placeholder="08123456789"
              style={{
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "#fafafa",
                border: "1px solid #e4e4e7",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "13px",
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
                padding: "8px 12px",
                fontSize: "13px",
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
              backgroundColor: "#059669",
              color: "#ffffff",
              border: "none",
              fontWeight: "600",
              padding: "11px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              marginTop: "8px",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Memproses..." : "Gabung Mitra"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>
            Sudah punya akun?{" "}
            <Link href="/mitra/login" style={{ color: "#059669", fontWeight: "600", textDecoration: "none" }}>
              Masuk Disini
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
