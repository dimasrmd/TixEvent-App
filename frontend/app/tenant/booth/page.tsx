"use client";

import { useState } from "react";
import Link from "next/link";

interface BoothSpot {
  idBooth: string;
  nomorBooth: string;
  lokasiBooth: string;
  hargaSewa: string;
  keterangan: string;
}

export default function TenantBoothSelection() {
  const [selectedBoothId, setSelectedBoothId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Mock list of empty booths matching BoothArea fields
  const [booths, setBooths] = useState<BoothSpot[]>([
    {
      idBooth: "BTH-A01",
      nomorBooth: "A01",
      lokasiBooth: "Food Court Utara",
      hargaSewa: "Rp 5.000.000",
      keterangan: "Dekat pintu masuk utama konser (Aliran Listrik 900W)"
    },
    {
      idBooth: "BTH-A02",
      nomorBooth: "A02",
      lokasiBooth: "Food Court Selatan",
      hargaSewa: "Rp 4.500.000",
      keterangan: "Sisi teduh sebelah Cyber Stage (Aliran Listrik 900W)"
    },
    {
      idBooth: "BTH-B03",
      nomorBooth: "B03",
      lokasiBooth: "Merchandise Alley",
      hargaSewa: "Rp 7.500.000",
      keterangan: "Tepat di sebelah antrean tiket VIP (Aliran Listrik 1300W)"
    }
  ]);

  const handleRent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoothId) {
      setError("Silakan pilih salah satu nomor booth!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    setTimeout(() => {
      const chosenBooth = booths.find((b) => b.idBooth === selectedBoothId);
      setSuccess(`Berhasil menyewa Booth ${chosenBooth?.nomorBooth} (${chosenBooth?.lokasiBooth})! Tim Keuangan Mitra akan segera memverifikasi.`);
      
      // Remove rented booth from available list
      setBooths(booths.filter((b) => b.idBooth !== selectedBoothId));
      setSelectedBoothId("");
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
        maxWidth: "500px",
        padding: "32px",
        border: "1px solid #e4e4e7",
        borderRadius: "16px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        boxSizing: "border-box",
        backgroundColor: "#ffffff"
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#18181b", margin: "0 0 4px 0" }}>Pilih & Sewa Booth Stan</h2>
          <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>Gunakan antarmuka di bawah ini untuk memilih lokasi booth stan Anda yang kosong</p>
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

        {booths.length > 0 ? (
          <form onSubmit={handleRent} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {booths.map((spot) => (
                <label key={spot.idBooth} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "16px",
                  border: selectedBoothId === spot.idBooth ? "2px solid #059669" : "1px solid #e4e4e7",
                  borderRadius: "12px",
                  backgroundColor: selectedBoothId === spot.idBooth ? "#ecfdf5" : "#fafafa",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}>
                  <input
                    type="radio"
                    name="boothSelection"
                    value={spot.idBooth}
                    checked={selectedBoothId === spot.idBooth}
                    onChange={(e) => setSelectedBoothId(e.target.value)}
                    style={{ marginTop: "3px", accentColor: "#059669" }}
                  />
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", width: "100%", minWidth: "220px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "700", color: "#18181b" }}>Booth {spot.nomorBooth}</span>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: "#059669" }}>{spot.hargaSewa}</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#71717a", margin: "4px 0" }}>📍 {spot.lokasiBooth}</p>
                    <p style={{ fontSize: "11px", color: "#a1a1aa", margin: 0, fontStyle: "italic" }}>{spot.keterangan}</p>
                  </div>
                </label>
              ))}
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
                padding: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                marginTop: "8px",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Memproses Sewa..." : "Sewa Booth Terpilih"}
            </button>
          </form>
        ) : (
          <div style={{
            padding: "24px",
            textAlign: "center",
            border: "1px solid #e4e4e7",
            borderRadius: "12px",
            backgroundColor: "#fafafa"
          }}>
            <p style={{ fontSize: "14px", color: "#71717a", margin: 0 }}>Semua booth area telah disewa oleh Mitra lainnya.</p>
          </div>
        )}

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <Link href="/" style={{ color: "#71717a", fontWeight: "600", textDecoration: "none", fontSize: "12px" }}>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
