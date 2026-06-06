"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCookie, deleteCookie } from "../../../lib/cookieUtils";
import { ShiftLog } from "../../../lib/types";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

export default function CrewAttendance() {
  const [crewName, setCrewName] = useState("Kru Lapangan");
  const [crewId, setCrewId] = useState("STF-MOCK-ID");
  const [myShifts, setMyShifts] = useState<ShiftLog[]>([]);
  const [success, setSuccess] = useState("");
  const [loadingShiftId, setLoadingShiftId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Read logged-in crew profile name and ID
    const name = getCookie("nama") || localStorage.getItem("nama") || "Kru Lapangan";
    const id = getCookie("idUser") || localStorage.getItem("idUser") || "STF-MOCK-001";
    setCrewName(name);
    setCrewId(id);

    // 2. Fetch shifts list from localStorage (which contains shifts scheduled by the Manager)
    const savedShifts = localStorage.getItem("tixevent_shifts");
    if (savedShifts) {
      const parsedShifts = JSON.parse(savedShifts);
      
      // Filter shifts belonging to this specific crew member
      // If we logged in as a mock user (e.g. "Lutfi Hakim" or "Andi Saputra"), match against crew ID
      // If none matches (like a newly created user), we fall back or show shifts associated with their id
      const filtered = parsedShifts.filter((s: ShiftLog) => {
        // Match either by ID (e.g. STF-MOCK-001) or by name
        return s.idCrew === id || s.crewName.toLowerCase() === name.toLowerCase();
      });

      setMyShifts(filtered);
    } else {
      // Default mock shift fallback if manager hasn't scheduled anything yet
      const fallbackShifts: ShiftLog[] = [
        {
          idShift: "SHF-MOCK-101",
          idCrew: id,
          crewName: name,
          tanggal: new Date().toISOString().split("T")[0],
          jamMulai: "08:00",
          jamSelesai: "16:00",
          posTugas: "Gate A Utama (Pintu Barat)",
          statusHadir: "PENDING"
        }
      ];
      setMyShifts(fallbackShifts);
      // Save shifts back so it is stored
      localStorage.setItem("tixevent_shifts", JSON.stringify(fallbackShifts));
    }
  }, [crewName, crewId]);

  const handleClockIn = (idShift: string) => {
    setLoadingShiftId(idShift);
    setSuccess("");

    // Simulate backend PUT to /api/kru/presensi
    setTimeout(() => {
      // 1. Read all shifts from localStorage
      const savedShifts = localStorage.getItem("tixevent_shifts");
      if (savedShifts) {
        const parsedShifts = JSON.parse(savedShifts);
        
        // 2. Mark target shift as HADIR
        const updatedGlobalShifts = parsedShifts.map((s: ShiftLog) => {
          if (s.idShift === idShift) {
            return {
              ...s,
              statusHadir: "HADIR"
            };
          }
          return s;
        });

        // 3. Save back to localStorage
        localStorage.setItem("tixevent_shifts", JSON.stringify(updatedGlobalShifts));

        // 4. Update local state
        setMyShifts(myShifts.map(s => s.idShift === idShift ? { ...s, statusHadir: "HADIR" } : s));
      }

      setSuccess("Presensi berhasil dicatat! Selamat bertugas di gerbang event.");
      setLoadingShiftId(null);

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    }, 600);
  };

  const handleLogout = () => {
    deleteCookie("role");
    deleteCookie("idUser");
    deleteCookie("nama");
    localStorage.clear();
    window.location.href = "/portal-admin";
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans box-border">
      {/* Top Header Bar */}
      <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 sticky top-0 z-5">
        <div className="text-sm font-black tracking-tight text-indigo-600">
          TIXEVENT <span className="text-xs text-zinc-400 font-bold ml-1">KRU LAPANGAN</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-zinc-650">
          <span>👤 {crewName} ({crewId})</span>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-650 font-bold bg-transparent border-none cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-[550px] mx-auto w-full box-border">
        <Card maxWidth="100%">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-zinc-850 m-0 mb-1">Presensi Kehadiran Kru</h2>
            <p className="text-xs text-zinc-500 m-0">Tinjau jadwal tugas harian Anda dan catat kehadiran Anda sebelum memulai shift</p>
          </div>

          {success && (
            <div className="mb-5 py-3 px-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold text-center">
              ✅ {success}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider m-0 mb-1">Daftar Jadwal Shift Anda</h3>
            
            {myShifts.length > 0 ? (
              myShifts.map((shift) => (
                <div
                  key={shift.idShift}
                  className="p-4 border border-zinc-200 rounded-xl bg-zinc-50/50 flex flex-col gap-3 box-border"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold py-0.5 px-2 bg-zinc-150 text-zinc-700 rounded">
                        ID: {shift.idShift}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 mt-2 mb-1">
                        📍 {shift.posTugas}
                      </h4>
                      <p className="text-xs text-slate-650 m-0">📅 Tanggal: {shift.tanggal}</p>
                      <p className="text-xs text-slate-800 font-semibold mt-1">⏰ Jam Kerja: {shift.jamMulai} - {shift.jamSelesai}</p>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                      shift.statusHadir === "HADIR"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-250"
                        : "bg-amber-50 text-amber-600 border-amber-250"
                    }`}>
                      {shift.statusHadir}
                    </span>
                  </div>

                  {shift.statusHadir !== "HADIR" ? (
                    <Button
                      variant="primary"
                      onClick={() => handleClockIn(shift.idShift)}
                      loading={loadingShiftId === shift.idShift}
                      fullWidth
                    >
                      🕒 Catat Kehadiran (Clock In)
                    </Button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-emerald-100/50 text-emerald-700 border border-emerald-200 font-bold py-2.5 rounded-lg text-sm cursor-not-allowed text-center"
                    >
                      ✓ Sudah Hadir
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                <p className="text-xs text-zinc-400 m-0">Tidak ada jadwal shift terdaftar untuk akun Anda hari ini.</p>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-zinc-500 font-semibold no-underline hover:underline text-xs">
              Kembali ke Beranda
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
