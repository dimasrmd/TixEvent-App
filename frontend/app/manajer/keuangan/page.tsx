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
    const fetchLaporan = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/keuangan/laporan`);
        if (response.ok) {
          const data = await response.json();
          setTotalPemasukan(data.totalPemasukan || 0);
          setTotalRefund(data.totalRefund || 0);
        }
      } catch (err) {
        console.error("Gagal menarik laporan keuangan:", err);
      }
    };
    
    const fetchMutasiKas = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refund`);
        if (response.ok) {
          const data = await response.json();
          // Filter hanya yang approved
          const approvedRefunds = data.filter((r: any) => r.statusRefund === "APPROVED");
          
          const mutasiLogs: FinancialAuditLog[] = approvedRefunds.map((r: any) => ({
            idTransaksi: r.idRefund,
            item: `Refund Pembatalan Tiket (${r.transaksi?.idTransaksi || "N/A"})`,
            nominal: r.jumlahRefund,
            tipe: "OUTFLOW",
            keterangan: `Refund kepada: ${r.transaksi?.user?.nama || "Penonton"}`,
            waktu: "Disetujui Manajer"
          }));
          
          setAuditLogs(mutasiLogs);
        }
      } catch (err) {
        console.error("Gagal memuat riwayat mutasi kas", err);
      }
    };

    fetchLaporan();
    fetchMutasiKas();
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
