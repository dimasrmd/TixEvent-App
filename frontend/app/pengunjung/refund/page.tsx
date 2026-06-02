"use client";

import { useState } from "react";
import Link from "next/link";

export default function VisitorRefund() {
  const [ticketCode, setTicketCode] = useState("");
  const [alasan, setAlasan] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketCode || !alasan) {
      setError("Kolom Kode Tiket dan Alasan wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    setTimeout(() => {
      setSuccess("Pengajuan refund berhasil dikirimkan! Manajer akan meninjau pengajuan Anda segera.");
      setTicketCode("");
      setAlasan("");
      setLoading(false);
    }, 600);
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
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#18181b", margin: "0 0 4px 0" }}>Pengajuan Refund Tiket</h2>
          <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>Masukkan kode tiket Anda beserta alasan pembatalan event</p>
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

        <form onSubmit={handleRefund} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a" }} htmlFor="ticketCode">
              Kode Tiket / ID Transaksi
            </label>
            <input
              id="ticketCode"
              type="text"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              placeholder="TIX-XXXXXX"
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
            <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a" }} htmlFor="alasan">
              Alasan Pengajuan Refund
            </label>
            <textarea
              id="alasan"
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Sebutkan alasan mengapa Anda mengajukan pembatalan tiket..."
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
                minHeight: "100px",
                resize: "vertical",
                fontFamily: "sans-serif"
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "#ef4444",
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
            {loading ? "Mengirimkan Pengajuan..." : "Ajukan Refund"}
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
