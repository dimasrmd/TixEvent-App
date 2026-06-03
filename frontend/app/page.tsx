"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCookie, deleteCookie } from "../lib/cookieUtils";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [nama, setNama] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Read profile from Cookie or LocalStorage
    const currentRole = getCookie("role") || localStorage.getItem("role");
    const currentNama = getCookie("nama") || localStorage.getItem("nama");
    
    if (currentRole) setRole(currentRole.toLowerCase());
    if (currentNama) setNama(currentNama);
  }, []);

  const handleLogout = () => {
    // Clear cookies
    deleteCookie("role");
    deleteCookie("idUser");
    deleteCookie("nama");

    // Clear localStorage
    localStorage.clear();

    // Reload page
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-6 font-sans box-border">
      <Card maxWidth="450px" className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-indigo-600 m-0 mb-2">
          TIXEVENT
        </h1>
        <p className="text-sm text-zinc-500 m-0 mb-6 leading-relaxed">
          Precision & High-Performance Event Management Platform
        </p>

        {/* Dynamic Welcome Header if logged in */}
        {mounted && role && (
          <div className="mb-6 p-4 rounded-xl bg-zinc-100 border border-zinc-200">
            <p className="text-sm m-0 mb-1 text-zinc-900">
              Halo, <strong>{nama}</strong>!
            </p>
            <p className="text-xs m-0 mb-3 uppercase font-bold text-indigo-600">
              Masuk sebagai: {role}
            </p>

            {/* Quick Access Dashboard Buttons for Staff roles */}
            {role === "manajer" && (
              <Link href="/manajer/rundown" className="no-underline block mb-3">
                <Button variant="primary" size="sm" fullWidth>
                  💼 Buka Panel Kontrol Manajer
                </Button>
              </Link>
            )}
            {role === "panitia" && (
              <Link href="/panitia/check-in" className="no-underline block mb-3">
                <Button variant="primary" size="sm" fullWidth>
                  🎟️ Buka Check-In Tiket
                </Button>
              </Link>
            )}
            {(role === "kru" || role === "crew") && (
              <Link href="/crew/absensi" className="no-underline block mb-3">
                <Button variant="primary" size="sm" fullWidth>
                  🕒 Buka Absensi Kru Lapangan
                </Button>
              </Link>
            )}

            <Button
              onClick={handleLogout}
              variant="danger"
              className="text-[11px] font-bold py-1.5 px-3"
              fullWidth
            >
              LOGOUT (KELUAR)
            </Button>
          </div>
        )}

        {/* Gerbang 1: Area Publik / Pengunjung */}
        <div className="mb-5 p-4 border border-zinc-100 rounded-xl bg-zinc-50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600 m-0 mb-3">
            Portal Pengunjung
          </h2>

          {mounted && role === "pengunjung" ? (
            // Logged in as visitor: show features!
            <div className="flex flex-col gap-3">
              <Link href="/pengunjung/tiket" className="no-underline">
                <Button variant="primary">
                  🎟️ Beli Tiket Konser
                </Button>
              </Link>
              <Link href="/pengunjung/refund" className="no-underline">
                <Button variant="outline">
                  💸 Ajukan Refund Tiket
                </Button>
              </Link>
            </div>
          ) : (
            // Not logged in or another role: show login
            <div className="flex gap-3 justify-center">
              <Link href="/login" className="flex-1 no-underline">
                <Button variant="primary">
                  Masuk (Login)
                </Button>
              </Link>
              <Link href="/register" className="flex-1 no-underline">
                <Button variant="outline">
                  Daftar Akun
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Gerbang 2: Area Mitra (Tenant) */}
        <div className="mb-5 p-4 border border-zinc-100 rounded-xl bg-zinc-50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600 m-0 mb-3">
            Portal Mitra (Tenant)
          </h2>

          {mounted && role === "tenant" ? (
            // Logged in as tenant: show booth selection!
            <Link href="/tenant/booth" className="no-underline">
              <Button variant="secondary">
                🎪 Pilih & Sewa Booth Stan
              </Button>
            </Link>
          ) : (
            // Show tenant login
            <div className="flex flex-col gap-3">
              <Link href="/mitra/login" className="no-underline">
                <Button variant="secondary">
                  Masuk Kamar Tenant
                </Button>
              </Link>
              {!role && (
                <Link
                  href="/gabung-mitra"
                  className="no-underline text-xs text-emerald-600 hover:text-emerald-700 font-bold mt-1 inline-block"
                >
                  Berminat Sewa Stan? Registrasi Calon Mitra
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Gerbang 4: Jadwal Umum (Tanpa Login) */}
        <div className="p-4 border border-zinc-100 rounded-xl bg-zinc-50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600 m-0 mb-3">
            Informasi Umum
          </h2>
          <Link href="/jadwal" className="no-underline">
            <Button variant="dark">
              📅 Lihat Rundown & Lineup Artis
            </Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
