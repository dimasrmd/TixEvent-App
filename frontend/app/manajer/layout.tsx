"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCookie, deleteCookie } from "../../lib/cookieUtils";
import Button from "../../components/ui/Button";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [nama, setNama] = useState("MANAJER");
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    
    // Retrieve role and name
    const currentRole = getCookie("role") || localStorage.getItem("role");
    const currentNama = getCookie("nama") || localStorage.getItem("nama");

    if (currentRole?.toLowerCase() === "manajer") {
      setAuthorized(true);
      if (currentNama) setNama(currentNama);
    } else {
      // Redirect unauthorized roles back to portal admin
      setTimeout(() => {
        window.location.href = "/portal-admin";
      }, 1000);
    }
  }, []);

  const handleLogout = () => {
    // Clear cookies
    deleteCookie("role");
    deleteCookie("idUser");
    deleteCookie("nama");
    
    // Clear localStorage
    localStorage.clear();
    
    // Redirect to home
    window.location.href = "/";
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <p className="text-zinc-550 text-sm">Memuat modul...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans p-6 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-extrabold text-red-650 mb-2">Akses Terbatas</h2>
        <p className="text-sm text-zinc-500 mb-4 max-w-[360px]">
          Halaman ini khusus untuk peran <strong>Manajer</strong>. Anda tidak memiliki otoritas atau sesi Anda telah kedaluwarsa.
        </p>
        <p className="text-xs text-zinc-400">Mengalihkan ke gerbang portal masuk...</p>
      </div>
    );
  }

  // Define sidebar menu options
  const menuItems = [
    { name: "💼 Laporan Keuangan", path: "/manajer/keuangan" },
    { name: "👥 Manajemen Staf", path: "/manajer/staf" },
    { name: "🕒 Penjadwalan Shift", path: "/manajer/shift" },
    { name: "💸 Persetujuan Refund", path: "/manajer/refund" },
    { name: "🎪 Tenant & Booth", path: "/manajer/tenant" },
    { name: "📅 Rundown & Artis", path: "/manajer/rundown" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-[260px] bg-white border-r border-zinc-200 flex flex-col fixed top-0 bottom-0 left-0 z-10 p-6 box-border">
        {/* Brand Header */}
        <div className="mb-8 flex flex-col gap-1">
          <Link href="/" className="text-lg font-black tracking-tight text-indigo-600 no-underline flex items-center gap-2">
            TIXEVENT <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-extrabold">SUPER</span>
          </Link>
          <span className="text-[11px] text-zinc-400">Dashboard Manajer</span>
        </div>

        {/* Sidebar Profile Container */}
        <div className="mb-6 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
          <p className="text-[10px] text-zinc-400 m-0 mb-0.5 uppercase font-bold">LOGGED IN AS</p>
          <p className="text-sm font-extrabold text-slate-800 m-0 mb-0.5 truncate">{nama}</p>
          <span className="text-[10px] text-indigo-600 font-extrabold">👑 SUPER ADMIN</span>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} className="no-underline">
                <div className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-150 border-l-3 ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50 border-indigo-600 font-bold"
                    : "text-zinc-600 hover:text-zinc-950 bg-transparent border-transparent"
                }`}>
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="flex flex-col gap-2 mt-auto">
          <Link href="/" className="no-underline">
            <div className="py-2.5 px-3 rounded-lg text-xs font-bold text-zinc-650 bg-zinc-100 text-center hover:bg-zinc-150 transition-colors">
              🏠 Halaman Utama (Beranda)
            </div>
          </Link>
          <Button
            onClick={handleLogout}
            variant="danger"
            className="py-2.5 px-3 rounded-lg text-xs font-bold text-center"
            fullWidth
          >
            ❌ Log Out (Keluar)
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-[260px] flex-1 min-w-0 box-border">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 sticky top-0 z-5">
          <div className="text-xs font-semibold text-zinc-400">
            Status Server: <span className="text-emerald-500 font-bold">● MOCK FRONTEND ONLINE</span>
          </div>
          <div className="text-[11px] text-zinc-400">
            TixEvent Enterprise Edition v2.0
          </div>
        </header>

        {/* Dynamic Inner Viewport */}
        <div className="p-8 box-border">
          {children}
        </div>
      </main>
    </div>
  );
}
