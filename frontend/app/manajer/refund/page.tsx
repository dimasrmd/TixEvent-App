"use client";

import { useState, useEffect } from "react";

interface RefundClaim {
  idRefund: string;
  idTransaksi: string;
  alasan: string;
  jumlahRefund: number;
  statusRefund: "PENDING" | "APPROVED" | "REJECTED";
  namaPengunjung: string;
  tanggalAjuan: string;
}

export default function RefundApproval() {
  const [refunds, setRefunds] = useState<RefundClaim[]>([]);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tixevent_refunds");
    if (saved) {
      setRefunds(JSON.parse(saved));
    } else {
      const defaultClaims: RefundClaim[] = [
        {
          idRefund: "RFD-MOCK-301",
          idTransaksi: "TIX-VIP99A",
          alasan: "Jadwal kerja bentrok tiba-tiba di hari konser",
          jumlahRefund: 1200000,
          statusRefund: "PENDING",
          namaPengunjung: "Budi Santoso",
          tanggalAjuan: "2026-06-01"
        },
        {
          idRefund: "RFD-MOCK-302",
          idTransaksi: "TIX-FEST88",
          alasan: "Sakit demam berdarah dan harus dirawat",
          jumlahRefund: 450000,
          statusRefund: "PENDING",
          namaPengunjung: "Dewi Lestari",
          tanggalAjuan: "2026-06-01"
        },
        {
          idRefund: "RFD-MOCK-303",
          idTransaksi: "TIX-VIP12B",
          alasan: "Salah membeli kategori tiket (ingin pindah ke Festival)",
          jumlahRefund: 1200000,
          statusRefund: "APPROVED",
          namaPengunjung: "Rian Hidayat",
          tanggalAjuan: "2026-05-30"
        }
      ];
      setRefunds(defaultClaims);
      localStorage.setItem("tixevent_refunds", JSON.stringify(defaultClaims));
      
      // Calculate and store initial approved refunds total
      const initialApprovedTotal = defaultClaims
        .filter((r) => r.statusRefund === "APPROVED")
        .reduce((sum, r) => sum + r.jumlahRefund, 0);
      localStorage.setItem("tixevent_refund_total", initialApprovedTotal.toString());
    }
  }, []);

  const handleProcessRefund = (idRefund: string, statusBaru: "APPROVED" | "REJECTED") => {
    const updated = refunds.map((r) => {
      if (r.idRefund === idRefund) {
        return {
          ...r,
          statusRefund: statusBaru
        };
      }
      return r;
    });

    setRefunds(updated);
    localStorage.setItem("tixevent_refunds", JSON.stringify(updated));

    // Calculate new total approved refunds and save for Keuangan page
    const totalApproved = updated
      .filter((r) => r.statusRefund === "APPROVED")
      .reduce((sum, r) => sum + r.jumlahRefund, 0);
    localStorage.setItem("tixevent_refund_total", totalApproved.toString());

    const targetRefund = refunds.find((r) => r.idRefund === idRefund);
    const actionWord = statusBaru === "APPROVED" ? "disetujui" : "ditolak";
    setSuccess(`Pengajuan refund ${targetRefund?.idRefund} (${targetRefund?.namaPengunjung}) berhasil ${actionWord}!`);

    // Clear alert after 3 seconds
    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div>
      {/* Title Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>Persetujuan Refund Tiket</h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Tinjau antrean pengajuan pembatalan tiket dari pengunjung dan lakukan persetujuan pengembalian dana</p>
      </div>

      {success && (
        <div style={{
          marginBottom: "20px",
          padding: "12px 16px",
          borderRadius: "8px",
          backgroundColor: "#ecfdf5",
          border: "1px solid #a7f3d0",
          color: "#059669",
          fontSize: "13px",
          fontWeight: "600",
          transition: "all 0.3s ease"
        }}>
          ✅ {success}
        </div>
      )}

      {/* Refund Queue Table Container */}
      <div style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
      }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>Antrean Pengajuan Refund</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700" }}>ID REFUND</th>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700" }}>PENGUNJUNG</th>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700" }}>ALASAN REFUND</th>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700" }}>NILAI TIKET</th>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700" }}>STATUS</th>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700", textAlign: "center" }}>TINDAKAN</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((claim) => (
                <tr key={claim.idRefund} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "16px 10px" }}>
                    <div style={{ fontWeight: "700", color: "#0f172a" }}>{claim.idRefund}</div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>Tiket: {claim.idTransaksi}</div>
                  </td>
                  <td style={{ padding: "16px 10px" }}>
                    <div style={{ fontWeight: "600", color: "#0f172a" }}>{claim.namaPengunjung}</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>📅 {claim.tanggalAjuan}</div>
                  </td>
                  <td style={{ padding: "16px 10px", color: "#475569", maxWidth: "250px", lineHeight: "1.4" }}>
                    {claim.alasan}
                  </td>
                  <td style={{ padding: "16px 10px", fontWeight: "800", color: "#ef4444" }}>
                    {formatCurrency(claim.jumlahRefund)}
                  </td>
                  <td style={{ padding: "16px 10px" }}>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: "800",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      backgroundColor:
                        claim.statusRefund === "APPROVED"
                          ? "#ecfdf5"
                          : claim.statusRefund === "REJECTED"
                          ? "#fef2f2"
                          : "#fffbeb",
                      color:
                        claim.statusRefund === "APPROVED"
                          ? "#059669"
                          : claim.statusRefund === "REJECTED"
                          ? "#dc2626"
                          : "#d97706",
                      border:
                        claim.statusRefund === "APPROVED"
                          ? "1px solid #a7f3d0"
                          : claim.statusRefund === "REJECTED"
                          ? "1px solid #fecaca"
                          : "1px solid #fde68a"
                    }}>
                      {claim.statusRefund}
                    </span>
                  </td>
                  <td style={{ padding: "16px 10px", textAlign: "center" }}>
                    {claim.statusRefund === "PENDING" ? (
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <button
                          onClick={() => handleProcessRefund(claim.idRefund, "APPROVED")}
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "#ffffff",
                            backgroundColor: "#16a34a",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            boxShadow: "0 1px 2px 0 rgba(22, 163, 74, 0.2)"
                          }}
                        >
                          ✓ Setujui
                        </button>
                        <button
                          onClick={() => handleProcessRefund(claim.idRefund, "REJECTED")}
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "#ffffff",
                            backgroundColor: "#ef4444",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            boxShadow: "0 1px 2px 0 rgba(239, 68, 68, 0.2)"
                          }}
                        >
                          ✕ Tolak
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: "11px", color: "#94a3b8", fontStyle: "italic" }}>
                        Sudah Diproses
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
