"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

export default function BuyTicket() {
  const [kategori, setKategori] = useState("VIP");
  const [jumlah, setJumlah] = useState(1);
  const [ticketCode, setTicketCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBuy = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Generate a random ticket code
      const generatedCode = "TIX-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      setTicketCode(generatedCode);
      setLoading(false);
    }, 600);
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-6 font-sans box-border">
      <Card maxWidth="450px">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-zinc-850 m-0 mb-1">Beli Tiket Event</h2>
          <p className="text-xs text-zinc-500 m-0">Silakan pilih kategori dan jumlah tiket yang ingin Anda pesan</p>
        </div>

        {ticketCode && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-250 text-center">
            <p className="text-xs text-emerald-800 m-0 mb-1.5 font-bold">TRANSAKSI BERHASIL!</p>
            <p className="text-[11px] text-emerald-700 m-0 mb-3">Simpan kode tiket berikut untuk validasi gate masuk / refund:</p>
            <div className="text-2xl font-extrabold tracking-widest text-emerald-800 bg-white p-2.5 rounded-lg border-2 border-dashed border-emerald-200">
              {ticketCode}
            </div>
          </div>
        )}

        <form onSubmit={handleBuy} className="flex flex-col gap-4">
          <Select
            id="kategori"
            label="Pilih Kategori Tiket"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
          >
            <option value="FESTIVAL">FESTIVAL - Rp 450.000</option>
            <option value="VIP">VIP BACKSTAGE - Rp 1.200.000</option>
            <option value="VVIP">VVIP LOUNGE - Rp 2.500.000</option>
          </Select>

          <Input
            id="jumlah"
            type="number"
            label="Jumlah Tiket"
            min="1"
            max="5"
            value={jumlah}
            onChange={(e) => setJumlah(parseInt(e.target.value) || 1)}
            required
          />

          <Button type="submit" loading={loading} className="mt-2">
            Pesan Tiket
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
