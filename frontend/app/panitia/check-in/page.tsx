"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCookie, deleteCookie } from "../../../lib/cookieUtils";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

interface CheckedInTicket {
  kodeTiket: string;
  waktuCheckIn: string;
  status: "SUCCESS" | "FAILED";
  message: string;
}

export default function TicketCheckIn() {
  const [kodeTiket, setKodeTiket] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    status: "Success" | "Failed" | null;
    message: string;
  }>({ status: null, message: "" });

  const [checkInHistory, setCheckInHistory] = useState<CheckedInTicket[]>([]);
  const [panitiaName, setPanitiaName] = useState("Panitia Gate");

  useEffect(() => {
    // 1. Read logged-in panitia profile name
    const name = getCookie("nama") || localStorage.getItem("nama") || "Panitia Gate";
    setPanitiaName(name);

    // 2. Initialize checked-in logs history from localStorage
    const savedHistory = localStorage.getItem("tixevent_checkin_history");
    if (savedHistory) {
      setCheckInHistory(JSON.parse(savedHistory));
    }

    // 3. Initialize mock valid tickets list if not present
    const savedTickets = localStorage.getItem("tixevent_valid_tickets");
    if (!savedTickets) {
      const initialValidTickets = [
        { kode: "TIX-VIP99A", used: false, kategori: "VIP" },
        { kode: "TIX-FEST88", used: false, kategori: "FESTIVAL" },
        { kode: "TIX-VIP12B", used: true, kategori: "VIP" } // already used example
      ];
      localStorage.setItem("tixevent_valid_tickets", JSON.stringify(initialValidTickets));
    }
  }, []);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kodeTiket.trim()) {
      setStatusMessage({ status: "Failed", message: "Kode tiket tidak boleh kosong!" });
      return;
    }

    setLoading(true);
    setStatusMessage({ status: null, message: "" });

    const validateAPI = async () => {
      try {
        const cleanCode = kodeTiket.trim().toUpperCase();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkin/validate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ kodeTiket: cleanCode }),
        });

        const data = await response.json();
        const isSuccess = response.ok;
        const respMessage = data.message || (isSuccess ? "Check-in sukses!" : "Check-in gagal!");

        const timestamp = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        const newLog: CheckedInTicket = {
          kodeTiket: cleanCode,
          waktuCheckIn: timestamp,
          status: isSuccess ? "SUCCESS" : "FAILED",
          message: respMessage
        };

        const updatedHistory = [newLog, ...checkInHistory];
        setCheckInHistory(updatedHistory);
        localStorage.setItem("tixevent_checkin_history", JSON.stringify(updatedHistory));

        setStatusMessage({
          status: isSuccess ? "Success" : "Failed",
          message: respMessage
        });

        if (isSuccess) {
          setKodeTiket("");
        }
      } catch (err: any) {
        setStatusMessage({
          status: "Failed",
          message: "Kesalahan jaringan: Gagal terhubung ke server."
        });
      } finally {
        setLoading(false);
      }
    };

    validateAPI();
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
          TIXEVENT <span className="text-xs text-zinc-400 font-bold ml-1">PANITIA</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-zinc-650">
          <span>👤 {panitiaName}</span>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-650 font-bold bg-transparent border-none cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row items-center md:items-start justify-center gap-6 p-8 max-w-[960px] mx-auto w-full box-border">
        {/* Left Form: Ticket Scanner / Typing */}
        <Card maxWidth="100%" className="md:flex-1">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-zinc-850 m-0 mb-1">Check-In Tiket Masuk</h2>
            <p className="text-xs text-zinc-500 m-0">Ketikkan kode tiket pengunjung untuk melakukan validasi gerbang konser</p>
          </div>

          {/* Validation Indicator Box */}
          {statusMessage.status !== null && (
            <div className={`mb-5 p-4 rounded-xl border text-center transition-all duration-300 ${
              statusMessage.status === "Success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-600"
            }`}>
              <div className="text-3xl mb-1.5">
                {statusMessage.status === "Success" ? "✅" : "❌"}
              </div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1">
                {statusMessage.status === "Success" ? "VALID - TIKET DITERIMA" : "INVALID - DITOLAK"}
              </p>
              <p className="text-xs m-0 font-medium leading-relaxed">
                {statusMessage.message}
              </p>
            </div>
          )}

          <form onSubmit={handleValidate} className="flex flex-col gap-4">
            <Input
              id="kodeTiket"
              type="text"
              label="Ketik Kode Tiket"
              value={kodeTiket}
              onChange={(e) => setKodeTiket(e.target.value)}
              placeholder="TIX-XXXXXX"
              required
            />

            <Button type="submit" loading={loading} className="mt-2">
              Validasi & Check-In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-zinc-500 font-semibold no-underline hover:underline text-xs">
              Kembali ke Beranda
            </Link>
          </div>
        </Card>

        {/* Right Table: Log History */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-md box-border w-full md:flex-1 md:self-stretch flex flex-col">
          <h2 className="text-sm font-bold text-slate-800 m-0 mb-4">Riwayat Validasi Gate</h2>
          
          {checkInHistory.length > 0 ? (
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[360px] pr-1.5 no-scrollbar">
              {checkInHistory.map((log, idx) => (
                <div
                  key={log.kodeTiket + idx}
                  className={`p-3.5 border rounded-xl flex items-center justify-between text-xs transition-colors duration-150 ${
                    log.status === "SUCCESS"
                      ? "bg-emerald-50/30 border-emerald-100"
                      : "bg-red-50/30 border-red-100"
                  }`}
                >
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">{log.kodeTiket}</span>
                    <p className={`m-0 text-[11px] font-medium ${
                      log.status === "SUCCESS" ? "text-emerald-700" : "text-red-500"
                    }`}>
                      {log.message}
                    </p>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-semibold">
                    🕐 {log.waktuCheckIn}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-center border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
              <p className="text-xs text-zinc-400 m-0">Belum ada aktivitas check-in di gate ini.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
