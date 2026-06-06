"use client";

import { useState, useEffect } from "react";

interface FinancialAuditLog {
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
  const [auditLogs, setAuditLogs] = useState<FinancialAuditLog[]>([]);

  useEffect(() => {
    // 1. Fetch dynamic approved refund total from localStorage
    const savedRefundTotal = localStorage.getItem("tixevent_refund_total");
    if (savedRefundTotal) {
      setTotalRefund(parseFloat(savedRefundTotal));
    }

    // 2. Initialize or fetch audit logs
    const defaultLogs: FinancialAuditLog[] = [
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
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 m-0 mb-1">Laporan Arus Kas Keuangan</h1>
        <p className="text-xs text-slate-500 m-0">Pantau total pemasukan tiket, pengeluaran refund dana penonton, dan laba bersih operasional acara</p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Card 1: Pemasukan Kotor */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col gap-2 box-border">
          <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">TOTAL PEMASUKAN KOTOR</span>
          <span className="text-2xl font-black text-emerald-600">{formatCurrency(totalPemasukan)}</span>
          <div className="text-[11px] text-zinc-400">
            💵 Pemasukan kotor dari penjualan tiket & booth sewa
          </div>
        </div>

        {/* Card 2: Pengeluaran Refund */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col gap-2 box-border">
          <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">TOTAL DANA DI-REFUND</span>
          <span className="text-2xl font-black text-red-500">{formatCurrency(totalRefund)}</span>
          <div className="text-[11px] text-zinc-400">
            💸 Pengeluaran pengembalian dana tiket disetujui
          </div>
        </div>

        {/* Card 3: Laba Bersih */}
        <div className="bg-white border border-indigo-500 rounded-2xl p-6 shadow-md flex flex-col gap-2 box-border bg-gradient-to-br from-white via-white to-indigo-50/30">
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">TOTAL LABA BERSIH ACARA</span>
          <span className="text-2xl font-black text-indigo-600">{formatCurrency(labaBersih)}</span>
          <div className="text-[11px] text-slate-600 font-semibold">
            👑 Laba bersih setelah dikurangi seluruh pengajuan refund
          </div>
        </div>
      </div>

      {/* Transaction Logs Container */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm box-border">
        <h2 className="text-sm font-bold text-slate-800 m-0 mb-4">Jurnal Mutasi Kas Terkini</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b-2 border-zinc-100">
                <th className="py-3 px-2.5 text-zinc-400 font-bold">ID MUTASI</th>
                <th className="py-3 px-2.5 text-zinc-400 font-bold">DESKRIPSI TRANSAKSI</th>
                <th className="py-3 px-2.5 text-zinc-400 font-bold">SUMBER DANA / KETERANGAN</th>
                <th className="py-3 px-2.5 text-zinc-400 font-bold">NILAI NOMINAL</th>
                <th className="py-3 px-2.5 text-zinc-400 font-bold">TANGGAL / WAKTU</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, idx) => (
                <tr key={log.idTransaksi + idx} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <td className="py-4 px-2.5 font-bold text-zinc-400">{log.idTransaksi}</td>
                  <td className="py-4 px-2.5 font-bold text-slate-800">
                    {log.item}
                  </td>
                  <td className="py-4 px-2.5 text-zinc-650 font-medium">{log.keterangan}</td>
                  <td className={`py-4 px-2.5 font-bold ${log.tipe === "INFLOW" ? "text-emerald-600" : "text-red-500"}`}>
                    {log.tipe === "INFLOW" ? "+" : "-"} {formatCurrency(log.nominal)}
                  </td>
                  <td className="py-4 px-2.5 text-zinc-400">{log.waktu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
