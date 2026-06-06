"use client";

import { useState, useEffect } from "react";
import { TenantPartner } from "../../../lib/types";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function TenantManagement() {
  const [tenants, setTenants] = useState<TenantPartner[]>([]);

  // Form states
  const [nomorBooth, setNomorBooth] = useState("");
  const [lokasiBooth, setLokasiBooth] = useState("");
  const [hargaSewa, setHargaSewa] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchTenants = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenant/booth-tersewa`);
      if (response.ok) {
        const data = await response.json();
        // data adalah array of BoothArea
        const mappedTenants = data.map((b: any) => ({
          idTenant: b.tenant?.idUser || "N/A",
          namaBrand: b.tenant?.namaUsaha || b.tenant?.nama || "Tanpa Nama",
          email: b.tenant?.email || "N/A",
          noHp: b.tenant?.noHp || "N/A",
          nomorBooth: b.nomorBooth,
          lokasiBooth: b.lokasiBooth,
          kategoriUsaha: b.tenant?.jenisProduk || "General",
          statusSewa: "TERVERIFIKASI"
        }));
        setTenants(mappedTenants);
      }
    } catch (err) {
      console.error("Gagal memuat daftar mitra tenant:", err);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleAddBooth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomorBooth || !lokasiBooth || !hargaSewa) {
      setError("Semua kolom isian wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenant/booth-baru`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomorBooth,
          lokasiBooth,
          hargaSewa: parseFloat(hargaSewa),
          statusBooth: false
        })
      });

      if (!response.ok) throw new Error("Gagal mendaftarkan booth baru");

      setSuccess(`Berhasil mendaftarkan Booth ${nomorBooth} di ${lokasiBooth}! Booth kini tersedia untuk disewa Mitra.`);
      setNomorBooth("");
      setLokasiBooth("");
      setHargaSewa("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Title Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 m-0 mb-1">Manajemen Booth & Mitra Tenant</h1>
        <p className="text-xs text-slate-500 m-0">Daftarkan lokasi booth baru dan tinjau tenant yang telah menyewa booth di area event</p>
      </div>

      {success && (
        <div className="mb-5 py-3 px-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold">
          ✅ {success}
        </div>
      )}

      {error && (
        <div className="mb-5 py-3 px-4 rounded-lg bg-red-50 border border-red-200 text-red-650 text-xs font-semibold">
          ❌ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start">
        {/* Left Form: Add New Booth */}
        <Card maxWidth="100%">
          <h2 className="text-sm font-bold text-slate-800 m-0 mb-4">Pendaftaran Booth Baru</h2>
          <form onSubmit={handleAddBooth} className="flex flex-col gap-3.5">
            <Input
              id="nomorBooth"
              type="text"
              label="Nomor Kode Booth"
              value={nomorBooth}
              onChange={(e) => setNomorBooth(e.target.value)}
              placeholder="misal: A01, VIP-02"
              required
            />

            <Input
              id="lokasiBooth"
              type="text"
              label="Lokasi Penempatan"
              value={lokasiBooth}
              onChange={(e) => setLokasiBooth(e.target.value)}
              placeholder="misal: Food Court Utara"
              required
            />

            <Input
              id="hargaSewa"
              type="number"
              label="Harga Sewa Booth (Rp)"
              value={hargaSewa}
              onChange={(e) => setHargaSewa(e.target.value)}
              placeholder="5000000"
              required
            />

            <Button type="submit" loading={loading} className="mt-2 shadow-indigo-100">
              ➕ Buka Booth untuk Disewa
            </Button>
          </form>
        </Card>

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
    </div>
  );
}
