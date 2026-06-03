"use client";

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
  // Mock lineup data matching EventSchedule structure in backend
  const schedules: ScheduleItem[] = [
    {
      id: "SCH-001",
      artist: "Hologram DJ Pulse",
      panggung: "Neon Main Stage",
      waktu: "19:00 - 20:30 WIB",
      keterangan: "Electronic Pulse Live Opening Set"
    },
    {
      id: "SCH-002",
      artist: "Vaporwave Symphony",
      panggung: "Cyber Dome Stage",
      waktu: "21:00 - 22:30 WIB",
      keterangan: "Retro Synth & Immersive Soundscapes"
    },
    {
      id: "SCH-003",
      artist: "Acid Bass Collective",
      panggung: "Synth Cave Stage",
      waktu: "23:00 - 00:30 WIB",
      keterangan: "Deep Bass & Immersive Light Displays"
    },
    {
      id: "SCH-004",
      artist: "Neon Rhythm Orchestra",
      panggung: "Neon Main Stage",
      waktu: "01:00 - 03:00 WIB",
      keterangan: "Spectacular Laser Finale Closing Set"
    }
  ];

  return (
    <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-6 font-sans box-border">
      <Card maxWidth="500px">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-zinc-850 m-0 mb-1">Jadwal Acara & Lineup</h2>
          <p className="text-xs text-zinc-500 m-0">Daftar penampil resmi dan rundown jam tampil di panggung</p>
        </div>

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

        <div className="text-center">
          <Link href="/" className="text-zinc-500 font-semibold no-underline hover:underline text-xs">
            Kembali ke Beranda
          </Link>
        </div>
      </Card>
    </main>
  );
}
