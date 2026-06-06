"use client";

import { useState, useEffect } from "react";
import { StaffMember } from "../../../lib/types";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

export default function StaffManagement() {
  const [role, setRole] = useState<"KRU" | "PANITIA">("KRU");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [noHp, setNoHp] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Load and store staff list
  const [staffList, setStaffList] = useState<StaffMember[]>([]);

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kru/crews`);
      if (response.ok) {
        const data = await response.json();
        // Pastikan format respons dari Backend sesuai dengan interface StaffMember
        setStaffList(data);
      }
    } catch (err) {
      console.error("Gagal mengambil daftar staf:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !email || !password || !noHp) {
      setError("Semua kolom isian wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Role dipilih di UI (KRU atau PANITIA) 
      const endpointRole = role.toLowerCase();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/${endpointRole}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, password, noHp }),
      });

      const data = await response.json();

      if (!response.ok || data.status === "Failed") {
        throw new Error(data.message || "Gagal mendaftarkan staf baru.");
      }

      setSuccess(`Berhasil mendaftarkan Staf baru: ${nama} (${role})!`);
      setNama("");
      setEmail("");
      setPassword("");
      setNoHp("");
      
      // Refresh tabel otomatis setelah registrasi berhasil
      fetchStaff();
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
        <h1 className="text-2xl font-black text-slate-800 m-0 mb-1">Manajemen Staf Internal</h1>
        <p className="text-xs text-slate-500 m-0">Daftarkan akun staf baru (Kru Lapangan / Panitia Gate) dan tinjau daftar kru aktif</p>
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

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr] gap-6 items-start">
        {/* Left Form: Add New Staff */}
        <Card maxWidth="100%">
          <h2 className="text-sm font-bold text-slate-800 m-0 mb-4">Tambah Staf Baru</h2>
          <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
            <Select
              id="role"
              label="Pilih Peran Staf"
              value={role}
              onChange={(e) => setRole(e.target.value as "KRU" | "PANITIA")}
            >
              <option value="KRU">Kru Lapangan (Staff Absensi)</option>
              <option value="PANITIA">Panitia (Gate Keeper Check-In)</option>
            </Select>

            <Input
              id="nama"
              type="text"
              label="Nama Lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />

            <Input
              id="email"
              type="email"
              label="Email Kerja"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staf@tixevent.com"
              required
            />

            <Input
              id="password"
              type="password"
              label="Kata Sandi (Password)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Input
              id="noHp"
              type="tel"
              label="Nomor Telepon (HP)"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              placeholder="0812XXXXXXXX"
              required
            />

            <Button type="submit" loading={loading} className="mt-1 shadow-indigo-100">
              ➕ Daftarkan Akun Staf
            </Button>
          </form>
        </Card>

        {/* Right Table: Active Staff list */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm box-border">
          <h2 className="text-sm font-bold text-slate-800 m-0 mb-4">Daftar Staf Aktif</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b-2 border-zinc-100">
                  <th className="py-2.5 px-2 text-zinc-400 font-bold">ID STAF</th>
                  <th className="py-2.5 px-2 text-zinc-400 font-bold">NAMA</th>
                  <th className="py-2.5 px-2 text-zinc-400 font-bold">PERAN</th>
                  <th className="py-2.5 px-2 text-zinc-400 font-bold">KONTAK</th>
                  <th className="py-2.5 px-2 text-zinc-400 font-bold">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staf) => (
                  <tr key={staf.idUser} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                    <td className="py-3 px-2 font-bold text-zinc-400">{staf.idUser}</td>
                    <td className="py-3 px-2 font-semibold text-slate-800">{staf.nama}</td>
                    <td className="py-3 px-2">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                        staf.role === "PANITIA"
                          ? "bg-indigo-50 text-indigo-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}>
                        {staf.role}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-slate-800 font-medium">{staf.email}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">📱 {staf.noHp}</div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50/50 text-emerald-600 border border-emerald-100">
                        {staf.status}
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
