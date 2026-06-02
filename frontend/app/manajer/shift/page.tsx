"use client";

import { useState, useEffect } from "react";

interface CrewMember {
  idUser: string;
  nama: string;
  role: string;
}

interface ShiftLog {
  idShift: string;
  idCrew: string;
  crewName: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  posTugas: string;
  statusHadir: "PENDING" | "HADIR" | "ABSEN";
}

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

  useEffect(() => {
    // 1. Fetch active crews from staff list in LocalStorage
    const savedStaf = localStorage.getItem("tixevent_staf");
    if (savedStaf) {
      const parsed = JSON.parse(savedStaf);
      const filteredCrews = parsed.filter((s: any) => s.role === "KRU");
      setCrews(filteredCrews);
      if (filteredCrews.length > 0) setIdCrew(filteredCrews[0].idUser);
    } else {
      const defaultCrews = [
        { idUser: "STF-MOCK-001", nama: "Lutfi Hakim", role: "KRU" },
        { idUser: "STF-MOCK-003", nama: "Andi Saputra", role: "KRU" }
      ];
      setCrews(defaultCrews);
      if (defaultCrews.length > 0) setIdCrew(defaultCrews[0].idUser);
    }

    // 2. Fetch or initialize shifts list
    const savedShifts = localStorage.getItem("tixevent_shifts");
    if (savedShifts) {
      setShifts(JSON.parse(savedShifts));
    } else {
      const defaultShifts: ShiftLog[] = [
        {
          idShift: "SHF-MOCK-101",
          idCrew: "STF-MOCK-001",
          crewName: "Lutfi Hakim",
          tanggal: "2026-06-02",
          jamMulai: "08:00",
          jamSelesai: "16:00",
          posTugas: "Gate A Utama",
          statusHadir: "PENDING"
        },
        {
          idShift: "SHF-MOCK-102",
          idCrew: "STF-MOCK-003",
          crewName: "Andi Saputra",
          tanggal: "2026-06-02",
          jamMulai: "16:00",
          jamSelesai: "23:59",
          posTugas: "Keamanan Barikade",
          statusHadir: "PENDING"
        }
      ];
      setShifts(defaultShifts);
      localStorage.setItem("tixevent_shifts", JSON.stringify(defaultShifts));
    }
  }, []);

  const handleSaveShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idCrew || !tanggal || !jamMulai || !jamSelesai || !posTugas) {
      setError("Semua kolom isian wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    setTimeout(() => {
      const selectedCrewObj = crews.find((c) => c.idUser === idCrew);
      const crewName = selectedCrewObj ? selectedCrewObj.nama : "Kru Lapangan";

      if (editingShiftId) {
        // Edit Shift (PUT simulation)
        const updated = shifts.map((s) => {
          if (s.idShift === editingShiftId) {
            return {
              ...s,
              tanggal,
              jamMulai,
              jamSelesai,
              posTugas
            };
          }
          return s;
        });
        setShifts(updated);
        localStorage.setItem("tixevent_shifts", JSON.stringify(updated));
        setSuccess("Jadwal shift berhasil dirombak / diperbarui!");
        setEditingShiftId(null);
      } else {
        // Add Shift (POST simulation)
        const newShift: ShiftLog = {
          idShift: "SHF-MOCK-" + Math.floor(100 + Math.random() * 900),
          idCrew,
          crewName,
          tanggal,
          jamMulai,
          jamSelesai,
          posTugas,
          statusHadir: "PENDING"
        };
        const updated = [newShift, ...shifts];
        setShifts(updated);
        localStorage.setItem("tixevent_shifts", JSON.stringify(updated));
        setSuccess(`Jadwal shift baru berhasil ditambahkan untuk ${crewName}!`);
      }

      // Reset form fields
      setTanggal("");
      setPosTugas("");
      setLoading(false);
    }, 600);
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
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>Penjadwalan Shift Kerja Kru</h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Atur tanggal, slot waktu, dan pos tugas pelayanan gate konser bagi kru lapangan aktif</p>
      </div>

      {success && (
        <div style={{
          marginBottom: "20px",
          padding: "12px 16px",
          borderRadius: "8px",
          backgroundColor: "#ecfdf5",
          border: "1px solid #a7f3d0",
          color: "#059669",
          fontSize: "13px",
          fontWeight: "600"
        }}>
          ✅ {success}
        </div>
      )}

      {error && (
        <div style={{
          marginBottom: "20px",
          padding: "12px 16px",
          borderRadius: "8px",
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#dc2626",
          fontSize: "13px",
          fontWeight: "600"
        }}>
          ❌ {error}
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.8fr",
        gap: "24px",
        alignItems: "start"
      }}>
        {/* Left Form: Add/Edit Shift */}
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>
            {editingShiftId ? "🛠️ Rombak Shift Kerja" : "📅 Jadwalkan Shift Kru"}
          </h2>
          <form onSubmit={handleSaveShift} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                Pilih Kru Lapangan
              </label>
              <select
                value={idCrew}
                onChange={(e) => setIdCrew(e.target.value)}
                disabled={!!editingShiftId}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  backgroundColor: editingShiftId ? "#f1f5f9" : "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  color: "#0f172a",
                  outline: "none",
                  fontWeight: "600",
                  cursor: editingShiftId ? "not-allowed" : "pointer"
                }}
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
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }} htmlFor="tanggal">
                Tanggal Penugasan
              </label>
              <input
                id="tanggal"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  color: "#0f172a",
                  outline: "none"
                }}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                  Jam Mulai
                </label>
                <input
                  type="time"
                  value={jamMulai}
                  onChange={(e) => setJamMulai(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "13px",
                    color: "#0f172a",
                    outline: "none"
                  }}
                  required
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                  Jam Selesai
                </label>
                <input
                  type="time"
                  value={jamSelesai}
                  onChange={(e) => setJamSelesai(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "13px",
                    color: "#0f172a",
                    outline: "none"
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }} htmlFor="posTugas">
                Pos Penugasan / Gerbang Area
              </label>
              <input
                id="posTugas"
                type="text"
                value={posTugas}
                onChange={(e) => setPosTugas(e.target.value)}
                placeholder="misal: Gate Utama Barat, Food Court, Barikade VIP"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  color: "#0f172a",
                  outline: "none"
                }}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
              {editingShiftId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    flex: 1,
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #cbd5e1",
                    fontWeight: "700",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13px"
                  }}
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                disabled={loading || crews.length === 0}
                style={{
                  flex: 2,
                  backgroundColor: editingShiftId ? "#0f172a" : "#4f46e5",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "700",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: crews.length === 0 ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  opacity: loading || crews.length === 0 ? 0.7 : 1,
                  boxShadow: "0 2px 4px 0 rgba(79, 70, 229, 0.15)"
                }}
              >
                {loading ? "Menyimpan..." : editingShiftId ? "💾 Simpan Perubahan" : "➕ Jadwalkan Shift"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Table: Active Shift Log */}
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>Jadwal Shift Kru Saat Ini</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                  <th style={{ padding: "10px", color: "#64748b", fontWeight: "700" }}>KRU</th>
                  <th style={{ padding: "10px", color: "#64748b", fontWeight: "700" }}>TANGGAL</th>
                  <th style={{ padding: "10px", color: "#64748b", fontWeight: "700" }}>JAM KERJA</th>
                  <th style={{ padding: "10px", color: "#64748b", fontWeight: "700" }}>POS PENUGASAN</th>
                  <th style={{ padding: "10px", color: "#64748b", fontWeight: "700" }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift) => (
                  <tr key={shift.idShift} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 10px" }}>
                      <div style={{ fontWeight: "700", color: "#0f172a" }}>{shift.crewName}</div>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>ID: {shift.idCrew}</div>
                    </td>
                    <td style={{ padding: "12px 10px", fontWeight: "600", color: "#475569" }}>{shift.tanggal}</td>
                    <td style={{ padding: "12px 10px", fontWeight: "600", color: "#0f172a" }}>
                      ⏰ {shift.jamMulai} - {shift.jamSelesai}
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        backgroundColor: "#f1f5f9",
                        color: "#334155"
                      }}>
                        📍 {shift.posTugas}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <button
                        onClick={() => handleLoadEdit(shift)}
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#4f46e5",
                          backgroundColor: "#f5f3ff",
                          border: "1px solid #ddd6fe",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
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
