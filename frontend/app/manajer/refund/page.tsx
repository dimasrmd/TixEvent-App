"use client";

import { useState, useEffect } from "react";
import { RefundClaim } from "../../../lib/types";

export default function RefundApproval() {
  const [refunds, setRefunds] = useState<RefundClaim[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchRefunds = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refund`);
      if (response.ok) {
        const data = await response.json();
        const mappedRefunds = data.map((r: any) => ({
          idRefund: r.idRefund,
          idTransaksi: r.transaksi?.idTransaksi || "N/A",
          namaPengunjung: r.transaksi?.user?.nama || "Tanpa Nama",
          jumlahRefund: r.jumlahRefund,
          alasan: r.alasan,
          statusRefund: r.statusRefund || "PENDING"
        }));
        setRefunds(mappedRefunds);
      }
    } catch (err) {
      console.error("Gagal memuat antrean refund:", err);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleProcessRefund = async (idRefund: string, statusBaru: "APPROVED" | "REJECTED") => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refund/proses/${idRefund}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusRefund: statusBaru })
      });

      if (!response.ok) {
        throw new Error("Gagal memproses pengajuan refund dari server.");
      }

      // Backend membalikkan String text biasa, bukan JSON (berdasarkan RefundRestController)
      const actionWord = statusBaru === "APPROVED" ? "disetujui" : "ditolak";
      setSuccess(`Pengajuan refund ${idRefund} berhasil ${actionWord}!`);
      
      // Refresh tabel otomatis
      fetchRefunds();

      // Clear alert after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    }
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
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 m-0 mb-1">Persetujuan Refund Tiket</h1>
        <p className="text-xs text-slate-500 m-0">Tinjau antrean pengajuan pembatalan tiket dari pengunjung dan lakukan persetujuan pengembalian dana</p>
      </div>

      {success && (
        <div className="mb-5 py-3 px-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold transition-all duration-300">
          ✅ {success}
        </div>
      )}

      {error && (
        <div className="mb-5 py-3 px-4 rounded-lg bg-red-50 border border-red-200 text-red-650 text-xs font-semibold">
          ❌ {error}
        </div>
      )}

      {/* Refund Queue Table Container */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm box-border">
        <h2 className="text-sm font-bold text-slate-800 m-0 mb-4">Antrean Pengajuan Refund</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b-2 border-zinc-100">
                <th className="py-3 px-2.5 text-zinc-400 font-bold">ID REFUND</th>
                <th className="py-3 px-2.5 text-zinc-400 font-bold">PENGUNJUNG</th>
                <th className="py-3 px-2.5 text-zinc-400 font-bold">ALASAN REFUND</th>
                <th className="py-3 px-2.5 text-zinc-400 font-bold">NILAI TIKET</th>
                <th className="py-3 px-2.5 text-zinc-400 font-bold">STATUS</th>
                <th className="py-3 px-2.5 text-zinc-400 font-bold text-center">TINDAKAN</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((claim) => (
                <tr key={claim.idRefund} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <td className="py-4 px-2.5">
                    <div className="font-bold text-slate-800">{claim.idRefund}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Tiket: {claim.idTransaksi}</div>
                  </td>
                  <td className="py-4 px-2.5">
                    <div className="font-semibold text-slate-800">{claim.namaPengunjung}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">📅 {claim.tanggalAjuan}</div>
                  </td>
                  <td className="py-4 px-2.5 text-zinc-600 max-w-[250px] leading-relaxed">
                    {claim.alasan}
                  </td>
                  <td className="py-4 px-2.5 font-bold text-red-500">
                    {formatCurrency(claim.jumlahRefund)}
                  </td>
                  <td className="py-4 px-2.5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                      claim.statusRefund === "APPROVED"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : claim.statusRefund === "REJECTED"
                        ? "bg-red-50 text-red-500 border-red-200"
                        : "bg-amber-50 text-amber-600 border-amber-200"
                    }`}>
                      {claim.statusRefund}
                    </span>
                  </td>
                  <td className="py-4 px-2.5 text-center">
                    {claim.statusRefund === "PENDING" ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleProcessRefund(claim.idRefund, "APPROVED")}
                          className="text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 border-none py-1.5 px-3 rounded-lg shadow-sm cursor-pointer"
                        >
                          ✓ Setujui
                        </button>
                        <button
                          onClick={() => handleProcessRefund(claim.idRefund, "REJECTED")}
                          className="text-[11px] font-bold text-white bg-red-500 hover:bg-red-650 border-none py-1.5 px-3 rounded-lg shadow-sm cursor-pointer"
                        >
                          ✕ Tolak
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-400 italic">
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
