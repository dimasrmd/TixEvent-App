"use client";

import { useState, useEffect } from "react";
import { RefundClaim } from "../../../lib/types";

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
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 m-0 mb-1">Persetujuan Refund Tiket</h1>
        <p className="text-xs text-slate-500 m-0">Tinjau antrean pengajuan pembatalan tiket dari pengunjung dan lakukan persetujuan pengembalian dana</p>
      </div>

      {success && (
        <div className="mb-5 py-3 px-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold transition-all duration-300">
          ✅ {success}
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
