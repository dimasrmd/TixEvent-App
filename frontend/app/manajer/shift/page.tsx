"use client";

import { useState, useEffect } from "react";
import { CrewMember, ShiftLog } from "../../../lib/types";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

export default function ShiftScheduling() {
  const [crews, setCrews] = useState<CrewMember[]>([]);
  const [shifts, setShifts] = useState<ShiftLog[]>([]);

  // Form states
  const [idCrew, setIdCrew] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jamMulai, setJamMulai] = useState("08:00");
  const [jamSelesai, setJamSelesai] = useState("16:00");
  const [posTugas, setPosTugas] = useState("");

  // Edit states
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchCrews = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kru/crews`);
      if (response.ok) {
        const data = await response.json();
        // API Kru Crews sudah terjamin hanya mengembalikan kru, tidak perlu difilter string "KRU"
        setCrews(data);
        if (data.length > 0) setIdCrew(data[0].idUser || data[0].id);
      }
    } catch (err) {
      console.error("Gagal memuat kru aktif:", err);
    }
  };

  const fetchShifts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kru/shifts`);
      if (response.ok) {
        const data = await response.json();
        // Pemetaan dari entity backend ke UI
        const mappedShifts = data.map((s: any) => ({
          idShift: s.idShift || s.id,
          idCrew: s.kru?.idUser || s.kru?.id || "N/A",
          crewName: s.kru?.nama || "Unknown Crew",
          tanggal: s.tanggal,
          jamMulai: s.jamMulai,
          jamSelesai: s.jamSelesai,
          posTugas: s.posTugas,
          statusHadir: s.statusHadir || "PENDING"
        }));
        setShifts(mappedShifts);
      }
    } catch (err) {
      console.error("Gagal memuat jadwal shift:", err);
    }
  };

  useEffect(() => {
    fetchCrews();
    fetchShifts();
  }, []);

  const handleSaveShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idCrew || !tanggal || !jamMulai || !jamSelesai || !posTugas) {
      setError("Semua kolom isian wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const selectedCrewObj = crews.find((c: any) => (c.idUser || c.id) === idCrew);
      const crewName = selectedCrewObj ? selectedCrewObj.nama : "Kru Lapangan";

      // Sesuaikan object yang dikirim dengan requirement entity CrewShift
      const payload = {
        kru: { idUser: idCrew },
        tanggal,
        jamMulai,
        jamSelesai,
        posTugas
      };

      if (editingShiftId) {
        // Edit Shift via PUT
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kru/shifts/${editingShiftId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Gagal mengupdate jadwal shift");
        
        setSuccess("Jadwal shift berhasil dirombak / diperbarui!");
        setEditingShiftId(null);
      } else {
        // Add Shift via POST
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kru/shifts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Gagal mendaftarkan jadwal shift baru");
        
        setSuccess(`Jadwal shift baru berhasil ditambahkan untuk ${crewName}!`);
      }

      // Refresh tabel shift dari database
      fetchShifts();

      // Reset form fields
      setTanggal("");
      setPosTugas("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadEdit = (shift: ShiftLog) => {
    setEditingShiftId(shift.idShift);
    setIdCrew(shift.idCrew);
    setTanggal(shift.tanggal);
    setJamMulai(shift.jamMulai);
    setJamSelesai(shift.jamSelesai);
    setPosTugas(shift.posTugas);
  };

  const handleCancelEdit = () => {
    setEditingShiftId(null);
    setTanggal("");
    setPosTugas("");
  };

  return (
    <div>
      {/* Title Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 m-0 mb-1">Penjadwalan Shift Kerja Kru</h1>
        <p className="text-xs text-slate-500 m-0">Atur tanggal, slot waktu, dan pos tugas pelayanan gate konser bagi kru lapangan aktif</p>
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
        {/* Left Form: Add/Edit Shift */}
        <Card maxWidth="100%">
          <h2 className="text-sm font-bold text-slate-800 m-0 mb-4">
            {editingShiftId ? "🛠️ Rombak Shift Kerja" : "📅 Jadwalkan Shift Kru"}
          </h2>
          <form onSubmit={handleSaveShift} className="flex flex-col gap-3.5">
            <Select
              id="idCrew"
              label="Pilih Kru Lapangan"
              value={idCrew}
              onChange={(e) => setIdCrew(e.target.value)}
              disabled={!!editingShiftId}
              className={editingShiftId ? "bg-zinc-150 cursor-not-allowed" : ""}
            >
              {crews.length > 0 ? (
                crews.map((c) => (
                  <option key={c.idUser} value={c.idUser}>
                    {c.nama} ({c.idUser})
                  </option>
                ))
              ) : (
                <option value="">Belum ada Akun Staf Kru</option>
              )}
            </Select>

            <Input
              id="tanggal"
              type="date"
              label="Tanggal Penugasan"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                id="jamMulai"
                type="time"
                label="Jam Mulai"
                value={jamMulai}
                onChange={(e) => setJamMulai(e.target.value)}
                required
              />
              <Input
                id="jamSelesai"
                type="time"
                label="Jam Selesai"
                value={jamSelesai}
                onChange={(e) => setJamSelesai(e.target.value)}
                required
              />
            </div>

            <Input
              id="posTugas"
              type="text"
              label="Pos Penugasan / Gerbang Area"
              value={posTugas}
              onChange={(e) => setPosTugas(e.target.value)}
              placeholder="misal: Gate Utama Barat, Food Court, Barikade VIP"
              required
            />

            <div className="flex gap-2.5 mt-2">
              {editingShiftId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-300 font-bold py-2.5 rounded-lg cursor-pointer text-sm"
                >
                  Batal
                </button>
              )}
              <Button
                type="submit"
                disabled={crews.length === 0}
                variant={editingShiftId ? "dark" : "primary"}
                className="flex-[2] shadow-indigo-50"
              >
                {loading ? "Menyimpan..." : editingShiftId ? "💾 Simpan Perubahan" : "➕ Jadwalkan Shift"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Right Table: Active Shift Log */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm box-border">
          <h2 className="text-sm font-bold text-slate-800 m-0 mb-4">Jadwal Shift Kru Saat Ini</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b-2 border-zinc-100">
                  <th className="py-2.5 px-2 text-zinc-400 font-bold">KRU</th>
                  <th className="py-2.5 px-2 text-zinc-400 font-bold">TANGGAL</th>
                  <th className="py-2.5 px-2 text-zinc-400 font-bold">JAM KERJA</th>
                  <th className="py-2.5 px-2 text-zinc-400 font-bold">POS PENUGASAN</th>
                  <th className="py-2.5 px-2 text-zinc-400 font-bold">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift) => (
                  <tr key={shift.idShift} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                    <td className="py-3 px-2">
                      <div className="fontWeight-bold font-bold text-slate-800">{shift.crewName}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">ID: {shift.idCrew}</div>
                    </td>
                    <td className="py-3 px-2 font-semibold text-slate-650">{shift.tanggal}</td>
                    <td className="py-3 px-2 font-semibold text-slate-800">
                      ⏰ {shift.jamMulai} - {shift.jamSelesai}
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-[10px] font-bold py-1 px-2.5 rounded bg-zinc-100 text-zinc-700">
                        📍 {shift.posTugas}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleLoadEdit(shift)}
                        className="text-[11px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 py-1.5 px-2.5 rounded-lg hover:bg-indigo-100/50 transition-colors cursor-pointer"
                      >
                        ✏️ Rombak
                      </button>
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
