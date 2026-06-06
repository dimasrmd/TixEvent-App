"use client";

import { useState, useEffect } from "react";
import { TenantPartner } from "../../../lib/types";

export default function TenantManagement() {
  const [tenants, setTenants] = useState<TenantPartner[]>([]);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenant`);
        if (response.ok) {
          const data = await response.json();
          // Pemetaan data disesuaikan dengan format entity TenantBackend
          const mappedTenants = data.map((t: any) => ({
            idTenant: t.idUser,
            namaBrand: t.namaUsaha || t.nama,
            email: t.email,
            noHp: t.noHp,
            nomorBooth: t.nomorBooth || "Belum ada",
            lokasiBooth: t.lokasiBooth || "Belum ada",
            kategoriUsaha: t.kategoriUsaha || "General",
            statusSewa: t.statusSewa || "TERVERIFIKASI"
          }));
          setTenants(mappedTenants);
        }
      } catch (err) {
        console.error("Gagal memuat daftar mitra tenant:", err);
      }
    };
    
    fetchTenants();
  }, []);

  return (
    <div>
      {/* Title Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 m-0 mb-1">Daftar Mitra Tenant & Stan</h1>
        <p className="text-xs text-slate-500 m-0">Tinjau seluruh data tenant komersial yang telah menyewa lokasi booth stan dan terverifikasi di area event</p>
      </div>

      {/* Tenant Table Container */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm box-border">
        <h2 className="text-sm font-bold text-slate-800 m-0 mb-4">Rekap Penyewaan Mitra</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b-2 border-zinc-100">
                <th className="py-3 px-2.5 text-zinc-400 font-bold">ID MITRA</th>
                <th className="py-3 px-2.5 text-zinc-400 font-bold">NAMA BRAND / USAHA</th>
                <th className="py-3 px-2.5 text-zinc-400 font-bold">KATEGORI</th>
                <th className="py-3 px-2.5 text-zinc-400 font-bold">BOOTH TERSEWA</th>
                <th className="py-3 px-2.5 text-zinc-400 font-bold">KONTAK MITRA</th>
                <th className="py-3 px-2.5 text-zinc-400 font-bold">STATUS SEWA</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((partner) => (
                <tr key={partner.idTenant} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <td className="py-4 px-2.5 font-bold text-zinc-400">{partner.idTenant}</td>
                  <td className="py-4 px-2.5">
                    <div className="font-bold text-slate-800">{partner.namaBrand}</div>
                  </td>
                  <td className="py-4 px-2.5">
                    <span className="text-[10px] font-semibold py-1 px-2.5 rounded bg-zinc-100 text-zinc-700">
                      {partner.kategoriUsaha}
                    </span>
                  </td>
                  <td className="py-4 px-2.5">
                    <div className="font-bold text-emerald-600">⛺ Booth {partner.nomorBooth}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">📍 {partner.lokasiBooth}</div>
                  </td>
                  <td className="py-4 px-2.5">
                    <div className="text-slate-800 font-medium">{partner.email}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">📱 {partner.noHp}</div>
                  </td>
                  <td className="py-4 px-2.5">
                    <span className="text-[9px] font-bold py-1 px-2 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                      ✓ {partner.statusSewa}
                    </span>
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
