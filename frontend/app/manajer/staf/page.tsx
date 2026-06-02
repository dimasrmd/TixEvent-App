"use client";

import { useState, useEffect } from "react";

interface StaffMember {
  idUser: string;
  nama: string;
  email: string;
  noHp: string;
  role: "KRU" | "PANITIA";
  status: "AKTIF" | "CUTI";
}

export default function StaffManagement() {
  const [role, setRole] = useState<"KRU" | "PANITIA">("KRU");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [noHp, setNoHp] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Load and store staff list using LocalStorage so changes persist dynamically!
  const [staffList, setStaffList] = useState<StaffMember[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("tixevent_staf");
    if (saved) {
      setStaffList(JSON.parse(saved));
    } else {
      const defaultStaff: StaffMember[] = [
        { idUser: "STF-MOCK-001", nama: "Lutfi Hakim", email: "lutfi.crew@tixevent.com", noHp: "08123456789", role: "KRU", status: "AKTIF" },
        { idUser: "STF-MOCK-002", nama: "Dimas Ramadhan", email: "dimas.panitia@tixevent.com", noHp: "08987654321", role: "PANITIA", status: "AKTIF" },
        { idUser: "STF-MOCK-003", nama: "Andi Saputra", email: "andi.crew@tixevent.com", noHp: "08556677889", role: "KRU", status: "AKTIF" }
      ];
      setStaffList(defaultStaff);
      localStorage.setItem("tixevent_staf", JSON.stringify(defaultStaff));
    }
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !email || !password || !noHp) {
      setError("Semua kolom isian wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Simulate backend POST to /api/auth/{role}/register
    setTimeout(() => {
      const newStaff: StaffMember = {
        idUser: "STF-MOCK-" + Math.floor(100 + Math.random() * 900),
        nama,
        email,
        noHp,
        role,
        status: "AKTIF"
      };

      const updated = [newStaff, ...staffList];
      setStaffList(updated);
      localStorage.setItem("tixevent_staf", JSON.stringify(updated));

      setSuccess(`Berhasil mendaftarkan Staf baru: ${nama} (${role})!`);
      setNama("");
      setEmail("");
      setPassword("");
      setNoHp("");
      setLoading(false);
    }, 600);
  };

  return (
    <div>
      {/* Title Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>Manajemen Staf Internal</h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Daftarkan akun staf baru (Kru Lapangan / Panitia Gate) dan tinjau daftar kru aktif</p>
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
        {/* Left Form: Add New Staff */}
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>Tambah Staf Baru</h2>
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                Pilih Peran Staf
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "KRU" | "PANITIA")}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  color: "#0f172a",
                  outline: "none",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                <option value="KRU">Kru Lapangan (Staff Absensi)</option>
                <option value="PANITIA">Panitia (Gate Keeper Check-In)</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }} htmlFor="nama">
                Nama Lengkap
              </label>
              <input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lengkap"
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
              <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }} htmlFor="email">
                Email Kerja
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staf@tixevent.com"
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
              <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }} htmlFor="password">
                Kata Sandi (Password)
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
              <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }} htmlFor="noHp">
                Nomor Telepon (HP)
              </label>
              <input
                id="noHp"
                type="tel"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                placeholder="0812XXXXXXXX"
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

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                border: "none",
                fontWeight: "700",
                padding: "10px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
                marginTop: "6px",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 2px 4px 0 rgba(79, 70, 229, 0.15)"
              }}
            >
              {loading ? "Mendaftarkan..." : "➕ Daftarkan Akun Staf"}
            </button>
          </form>
        </div>

        {/* Right Table: Active Staff list */}
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>Daftar Staf Aktif</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                  <th style={{ padding: "10px", color: "#64748b", fontWeight: "700" }}>ID STAF</th>
                  <th style={{ padding: "10px", color: "#64748b", fontWeight: "700" }}>NAMA</th>
                  <th style={{ padding: "10px", color: "#64748b", fontWeight: "700" }}>PERAN</th>
                  <th style={{ padding: "10px", color: "#64748b", fontWeight: "700" }}>KONTAK</th>
                  <th style={{ padding: "10px", color: "#64748b", fontWeight: "700" }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staf) => (
                  <tr key={staf.idUser} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 10px", fontWeight: "700", color: "#64748b" }}>{staf.idUser}</td>
                    <td style={{ padding: "12px 10px", fontWeight: "600", color: "#0f172a" }}>{staf.nama}</td>
                    <td style={{ padding: "12px 10px" }}>
                      <span style={{
                        fontSize: "10px",
                        fontWeight: "800",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        backgroundColor: staf.role === "PANITIA" ? "#e0e7ff" : "#ecfdf5",
                        color: staf.role === "PANITIA" ? "#4f46e5" : "#059669"
                      }}>
                        {staf.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <div style={{ color: "#0f172a" }}>{staf.email}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>📱 {staf.noHp}</div>
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        backgroundColor: "#f0fdf4",
                        color: "#16a34a",
                        border: "1px solid #bbf7d0"
                      }}>
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
