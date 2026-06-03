"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

interface BoothSpot {
  idBooth: string;
  nomorBooth: string;
  lokasiBooth: string;
  hargaSewa: string;
  keterangan: string;
}

export default function TenantBoothSelection() {
  const [selectedBoothId, setSelectedBoothId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Mock list of empty booths matching BoothArea fields
  const [booths, setBooths] = useState<BoothSpot[]>([
    {
      idBooth: "BTH-A01",
      nomorBooth: "A01",
      lokasiBooth: "Food Court Utara",
      hargaSewa: "Rp 5.000.000",
      keterangan: "Dekat pintu masuk utama konser (Aliran Listrik 900W)"
    },
    {
      idBooth: "BTH-A02",
      nomorBooth: "A02",
      lokasiBooth: "Food Court Selatan",
      hargaSewa: "Rp 4.500.000",
      keterangan: "Sisi teduh sebelah Cyber Stage (Aliran Listrik 900W)"
    },
    {
      idBooth: "BTH-B03",
      nomorBooth: "B03",
      lokasiBooth: "Merchandise Alley",
      hargaSewa: "Rp 7.500.000",
      keterangan: "Tepat di sebelah antrean tiket VIP (Aliran Listrik 1300W)"
    }
  ]);

  const handleRent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoothId) {
      setError("Silakan pilih salah satu nomor booth!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    setTimeout(() => {
      const chosenBooth = booths.find((b) => b.idBooth === selectedBoothId);
      setSuccess(`Berhasil menyewa Booth ${chosenBooth?.nomorBooth} (${chosenBooth?.lokasiBooth})! Tim Keuangan Mitra akan segera memverifikasi.`);
      
      // Remove rented booth from available list
      setBooths(booths.filter((b) => b.idBooth !== selectedBoothId));
      setSelectedBoothId("");
      setLoading(false);
    }, 600);
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-6 font-sans box-border">
      <Card maxWidth="500px">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-zinc-850 m-0 mb-1">Pilih & Sewa Booth Stan</h2>
          <p className="text-xs text-zinc-500 m-0">Gunakan antarmuka di bawah ini untuk memilih lokasi booth stan Anda yang kosong</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-250 text-emerald-600 text-xs font-semibold leading-relaxed">
            {success}
          </div>
        )}

        {booths.length > 0 ? (
          <form onSubmit={handleRent} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {booths.map((spot) => (
                <label
                  key={spot.idBooth}
                  className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedBoothId === spot.idBooth
                      ? "border-emerald-600 bg-emerald-50/50"
                      : "border-zinc-250 bg-zinc-50 hover:bg-zinc-100/55"
                  }`}
                >
                  <input
                    type="radio"
                    name="boothSelection"
                    value={spot.idBooth}
                    checked={selectedBoothId === spot.idBooth}
                    onChange={(e) => setSelectedBoothId(e.target.value)}
                    className="mt-1 accent-emerald-600"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline w-full">
                      <span className="text-sm font-bold text-zinc-900">Booth {spot.nomorBooth}</span>
                      <span className="text-sm font-extrabold text-emerald-600">{spot.hargaSewa}</span>
                    </div>
                    <p className="text-xs text-zinc-500 m-0 my-1">📍 {spot.lokasiBooth}</p>
                    <p className="text-[11px] text-zinc-400 m-0 italic">{spot.keterangan}</p>
                  </div>
                </label>
              ))}
            </div>

            <Button type="submit" variant="secondary" loading={loading} className="mt-2">
              Sewa Booth Terpilih
            </Button>
          </form>
        ) : (
          <div className="p-6 text-center border border-zinc-200 rounded-xl bg-zinc-50">
            <p className="text-sm text-zinc-500 m-0">Semua booth area telah disewa oleh Mitra lainnya.</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-zinc-500 font-semibold no-underline hover:underline text-xs">
            Kembali ke Beranda
          </Link>
        </div>
      </Card>
    </main>
  );
}
