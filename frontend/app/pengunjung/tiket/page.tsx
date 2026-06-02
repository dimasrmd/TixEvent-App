"use client";

import { useState } from "react";
import Link from "next/link";

export default function BuyTicket() {
  const [kategori, setKategori] = useState("VIP");
  const [jumlah, setJumlah] = useState(1);
  const [ticketCode, setTicketCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBuy = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Generate a random ticket code
      const generatedCode = "TIX-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      setTicketCode(generatedCode);
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
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#18181b", margin: "0 0 4px 0" }}>Beli Tiket Event</h2>
          <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>Silakan pilih kategori dan jumlah tiket yang ingin Anda pesan</p>
        </div>

        {ticketCode && (
          <div style={{
            marginBottom: "20px",
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#ecfdf5",
            border: "1px solid #a7f3d0",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "12px", color: "#065f46", margin: "0 0 6px 0", fontWeight: "700" }}>TRANSAKSI BERHASIL!</p>
            <p style={{ fontSize: "11px", color: "#047857", margin: "0 0 12px 0" }}>Simpan kode tiket berikut untuk validasi gate masuk / refund:</p>
            <div style={{
              fontSize: "24px",
              fontWeight: "800",
              letterSpacing: "0.1em",
              color: "#065f46",
              backgroundColor: "#ffffff",
              padding: "10px",
              borderRadius: "8px",
              border: "2px dashed #a7f3d0"
            }}>
              {ticketCode}
            </div>
          </div>
        )}

        <form onSubmit={handleBuy} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a" }}>
              Pilih Kategori Tiket
            </label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
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
                cursor: "pointer"
              }}
            >
              <option value="FESTIVAL">FESTIVAL - Rp 450.000</option>
              <option value="VIP">VIP BACKSTAGE - Rp 1.200.000</option>
              <option value="VVIP">VVIP LOUNGE - Rp 2.500.000</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a" }} htmlFor="jumlah">
              Jumlah Tiket
            </label>
            <input
              id="jumlah"
              type="number"
              min="1"
              max="5"
              value={jumlah}
              onChange={(e) => setJumlah(parseInt(e.target.value) || 1)}
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
            {loading ? "Memproses Pemesanan..." : "Pesan Tiket"}
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
