"use client";

import { useState, useEffect } from "react";

interface AuditLog {
  idTransaksi: string;
  item: string;
  nominal: number;
  tipe: "INFLOW" | "OUTFLOW";
  keterangan: string;
  waktu: string;
}

export default function FinancialManagement() {
  const [totalPemasukan, setTotalPemasukan] = useState(245500000); // 245.5M gross ticket & booth inflow
  const [totalRefund, setTotalRefund] = useState(1200000); // 1.2M approved default
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    // 1. Fetch dynamic approved refund total from localStorage
    const savedRefundTotal = localStorage.getItem("tixevent_refund_total");
    if (savedRefundTotal) {
      setTotalRefund(parseFloat(savedRefundTotal));
    }

    // 2. Initialize or fetch audit logs
    const defaultLogs: AuditLog[] = [
      { idTransaksi: "TX-TIX-9081", item: "Pembelian Tiket VIP (2x)", nominal: 2400000, tipe: "INFLOW", keterangan: "Metode QRIS Bank Mandiri", waktu: "Baru saja" },
      { idTransaksi: "TX-BTH-5021", item: "Sewa Lokasi Booth A01", nominal: 5000000, tipe: "INFLOW", keterangan: "Transfer Bank BCA - Gourmet Seafood", waktu: "10 menit yang lalu" },
      { idTransaksi: "RFD-MOCK-303", item: "Refund Pembatalan Tiket VIP", nominal: 1200000, tipe: "OUTFLOW", keterangan: "Transfer Balik - Rian Hidayat", waktu: "1 jam yang lalu" },
      { idTransaksi: "TX-TIX-9080", item: "Pembelian Tiket Festival (4x)", nominal: 1800000, tipe: "INFLOW", keterangan: "E-Wallet GoPay", waktu: "2 jam yang lalu" },
      { idTransaksi: "TX-BTH-5022", item: "Sewa Lokasi Booth B03", nominal: 7500000, tipe: "INFLOW", keterangan: "Transfer Bank Mandiri - Rhythm Merch", waktu: "5 jam yang lalu" }
    ];

    // If there is any newly approved refund, let's append it to logs!
    const savedRefunds = localStorage.getItem("tixevent_refunds");
    let currentLogs = [...defaultLogs];
    if (savedRefunds) {
      const parsedRefunds = JSON.parse(savedRefunds);
      const approvedClaims = parsedRefunds.filter((r: any) => r.statusRefund === "APPROVED" && r.idRefund !== "RFD-MOCK-303");
      approvedClaims.forEach((claim: any) => {
        // Avoid duplicates
        if (!currentLogs.some((l) => l.idTransaksi === claim.idRefund)) {
          currentLogs.unshift({
            idTransaksi: claim.idRefund,
            item: `Refund Pembatalan Tiket (${claim.idTransaksi})`,
            nominal: claim.jumlahRefund,
            tipe: "OUTFLOW",
            keterangan: `Persetujuan Manajer - ${claim.namaPengunjung}`,
            waktu: "Baru saja disetujui"
          });
        }
      });
    }

    setAuditLogs(currentLogs);
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const labaBersih = totalPemasukan - totalRefund;

  return (
    <div>
      {/* Title Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>Laporan Arus Kas Keuangan</h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Pantau total pemasukan tiket, pengeluaran refund dana penonton, dan laba bersih operasional acara</p>
      </div>

      {/* Financial Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "20px",
        marginBottom: "32px"
      }}>
        {/* Card 1: Pemasukan Kotor */}
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>TOTAL PEMASUKAN KOTOR</span>
          <span style={{ fontSize: "24px", fontWeight: "900", color: "#059669" }}>{formatCurrency(totalPemasukan)}</span>
          <div style={{ fontSize: "11px", color: "#64748b" }}>
            💵 Pemasukan kotor dari penjualan tiket & booth sewa
          </div>
        </div>

        {/* Card 2: Pengeluaran Refund */}
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>TOTAL DANA DI-REFUND</span>
          <span style={{ fontSize: "24px", fontWeight: "900", color: "#dc2626" }}>{formatCurrency(totalRefund)}</span>
          <div style={{ fontSize: "11px", color: "#64748b" }}>
            💸 Pengeluaran pengembalian dana tiket disetujui
          </div>
        </div>

        {/* Card 3: Laba Bersih */}
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid #4f46e5",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          backgroundImage: "linear-gradient(135deg, #ffffff 60%, #f5f3ff 100%)"
        }}>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#4f46e5", textTransform: "uppercase", letterSpacing: "0.05em" }}>TOTAL LABA BERSIH ACARA</span>
          <span style={{ fontSize: "24px", fontWeight: "950", color: "#4f46e5" }}>{formatCurrency(labaBersih)}</span>
          <div style={{ fontSize: "11px", color: "#475569", fontWeight: "600" }}>
            👑 Laba bersih setelah dikurangi seluruh pengajuan refund
          </div>
        </div>
      </div>

      {/* Transaction Logs Container */}
      <div style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
      }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>Jurnal Mutasi Kas Terkini</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700" }}>ID MUTASI</th>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700" }}>DESKRIPSI TRANSAKSI</th>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700" }}>SUMBER DANA / KETERANGAN</th>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700" }}>NILAI NOMINAL</th>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700" }}>TANGGAL / WAKTU</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, idx) => (
                <tr key={log.idTransaksi + idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "16px 10px", fontWeight: "700", color: "#64748b" }}>{log.idTransaksi}</td>
                  <td style={{ padding: "16px 10px" }}>
                    <div style={{ fontWeight: "700", color: "#0f172a" }}>{log.item}</div>
                  </td>
                  <td style={{ padding: "16px 10px", color: "#475569" }}>{log.keterangan}</td>
                  <td style={{ padding: "16px 10px", fontWeight: "800", color: log.tipe === "INFLOW" ? "#059669" : "#dc2626" }}>
                    {log.tipe === "INFLOW" ? "+" : "-"} {formatCurrency(log.nominal)}
                  </td>
                  <td style={{ padding: "16px 10px", color: "#64748b" }}>{log.waktu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
