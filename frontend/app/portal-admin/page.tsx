"use client";

import { useState } from "react";
import Link from "next/link";
import { setCookie } from "../../lib/cookieUtils";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

export default function AdminPortalLogin() {
  const [role, setRole] = useState("manajer"); // default to manajer
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !role) {
      setError("Semua kolom isian wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Simulate instant client-side frontend admin portal authentication
    setTimeout(() => {
      const roleNameFormatted = role.charAt(0).toUpperCase() + role.slice(1);
      setSuccess(`Login Staf (${roleNameFormatted}) Sukses (Frontend Simulation)!`);
      const fullname = `Lutfi ${roleNameFormatted}`;
      
      // Save data for client-side use
      localStorage.setItem("role", role);
      localStorage.setItem("idUser", "STF-MOCK-ID");
      localStorage.setItem("nama", fullname);
      
      // Save to cookies for middleware route guard checks
      setCookie("role", role, 86400);
      setCookie("idUser", "STF-MOCK-ID", 86400);
      setCookie("nama", fullname, 86400);

      setTimeout(() => {
        if (role === "manajer") {
          window.location.href = "/manajer/rundown";
        } else if (role === "panitia") {
          window.location.href = "/panitia/check-in";
        } else {
          window.location.href = "/crew/absensi";
        }
      }, 1000);
    }, 500);
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-6 font-sans box-border">
      <Card maxWidth="450px">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-zinc-900 no-underline">
            TIXEVENT <span className="text-zinc-500 text-lg">PORTAL</span>
          </Link>
          <h2 className="text-xl font-bold text-zinc-850 mt-4 mb-1">Login Staf Internal</h2>
          <p className="text-xs text-zinc-500 m-0">Halaman masuk khusus untuk Manajer, Panitia, dan Kru Lapangan (Simulasi Frontend)</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold">
            {success}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Select
            id="role"
            label="Pilih Hak Akses / Jabatan"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="manajer">Manajer (Super Admin)</option>
            <option value="panitia">Panitia (Gate keeper)</option>
            <option value="kru">Kru Lapangan (Staff)</option>
          </Select>

          <Input
            id="email"
            type="email"
            label="Email Staf"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="staf@email.com"
            required
          />

          <Input
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" variant="dark" loading={loading} className="mt-2">
            Masuk ke Sistem
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-zinc-500 font-semibold no-underline hover:underline text-xs">
            Kembali ke Beranda
          </Link>
        </div>
      </Card>
    </main>
  );
}
