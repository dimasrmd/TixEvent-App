"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function VisitorRefund() {
  const [ticketCode, setTicketCode] = useState("");
  const [alasan, setAlasan] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketCode || !alasan) {
      setError("Kolom Kode Tiket dan Alasan wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refund/ajukan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          idTransaksi: ticketCode, 
          alasan: alasan
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status === "Failed") {
        throw new Error(data.message || "Gagal mengajukan refund!");
      }

      setSuccess(data.message || "Pengajuan refund berhasil dikirimkan!");
      setTicketCode("");
      setAlasan("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-6 font-sans box-border">
      <Card maxWidth="450px">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-zinc-850 m-0 mb-1">Pengajuan Refund Tiket</h2>
          <p className="text-xs text-zinc-500 m-0">Masukkan kode tiket Anda beserta alasan pembatalan event</p>
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

        <form onSubmit={handleRefund} className="flex flex-col gap-4">
          <Input
            id="ticketCode"
            type="text"
            label="Kode Tiket / ID Transaksi"
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value)}
            placeholder="TIX-XXXXXX"
            required
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label
              htmlFor="alasan"
              className="text-[11px] font-bold uppercase tracking-wider text-zinc-500"
            >
              Alasan Pengajuan Refund
            </label>
            <textarea
              id="alasan"
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Sebutkan alasan mengapa Anda mengajukan pembatalan tiket..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-indigo-500 transition-colors duration-150 min-h-[100px] resize-y font-sans box-border"
              required
            />
          </div>

          <Button type="submit" variant="danger" loading={loading} className="mt-2">
            Ajukan Refund
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
