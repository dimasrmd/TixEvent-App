"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "../../components/ui/Card";

interface ScheduleItem {
  id: string;
  artist: string;
  panggung: string;
  waktu: string;
  keterangan: string;
}

export default function ScheduleLineup() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rundown`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data jadwal acara dari server.");
        }
        
        const data = await response.json();
        
        // Memetakan respons Backend (EventSchedule) ke format UI Frontend
        const formattedSchedules = data.map((item: any) => {
          let waktuString = `${item.startTime} - ${item.endTime}`;
          
          try {
            if (item.startTime && item.endTime) {
              const start = new Date(item.startTime);
              const end = new Date(item.endTime);
              const formatTime = (d: Date) => 
                d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
              waktuString = `${formatTime(start)} - ${formatTime(end)} WIB`;
            }
          } catch (e) {
            // Abaikan jika format tanggal invalid
          }

          return {
            id: item.idJadwal || "N/A",
            artist: item.event?.eventName || "TBA",
            panggung: item.panggung || "TBA",
            waktu: waktuString,
            keterangan: item.event?.location || "Live Performance"
          };
        });

        setSchedules(formattedSchedules);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-6 font-sans box-border">
      <Card maxWidth="500px">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-zinc-850 m-0 mb-1">Jadwal Acara & Lineup</h2>
          <p className="text-xs text-zinc-500 m-0">Daftar penampil resmi dan rundown jam tampil di panggung</p>
        </div>

        {loading ? (
          <div className="text-center text-sm text-zinc-500 mb-6 font-semibold animate-pulse">
            Memuat jadwal dari Supabase...
          </div>
        ) : error ? (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center">
            {error}
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center text-sm text-zinc-500 mb-6 italic">
            Belum ada jadwal acara yang dipublikasikan.
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-6">
            {schedules.map((item) => (
              <div key={item.id} className="p-4 border border-zinc-200 rounded-xl bg-zinc-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-zinc-900 m-0">{item.artist}</h3>
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 padding-xs rounded-md px-1.5 py-0.5 border border-indigo-100">
                    {item.id}
                  </span>
                </div>
                <p className="text-xs text-indigo-600 font-semibold m-0 mb-1">
                  📍 {item.panggung}
                </p>
                <p className="text-xs text-emerald-600 font-bold m-0 mb-1.5">
                  🕒 {item.waktu}
                </p>
                <p className="text-xs text-zinc-500 m-0 italic">
                  {item.keterangan}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="text-zinc-500 font-semibold no-underline hover:underline text-xs">
            Kembali ke Beranda
          </Link>
        </div>
      </Card>
    </main>
  );
}
