"use client";

import { useState } from "react";
import Link from "next/link";
import { setCookie } from "../../lib/cookieUtils";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function VisitorRegister() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !email || !noHp || !password) {
      setError("Semua kolom isian wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/pengunjung/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama, email, noHp, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal!");
      }

      setSuccess(data.message || "Registrasi Pengunjung Sukses! Silakan login.");
      
      setNama("");
      setEmail("");
      setNoHp("");
      setPassword("");
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
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
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-indigo-600 no-underline">
            TIXEVENT
          </Link>
          <h2 className="text-xl font-bold text-zinc-850 mt-4 mb-1">Buat Akun Pengunjung</h2>
          <p className="text-xs text-zinc-500 m-0">Daftarkan diri Anda untuk memesan tiket event (Simulasi Frontend)</p>
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

        <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
          <Input
            id="nama"
            type="text"
            label="Nama Lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Masukkan nama lengkap"
            required
          />

          <Input
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            required
          />

          <Input
            id="noHp"
            type="tel"
            label="Nomor Telepon (No. HP)"
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
            placeholder="08123456789"
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

          <Button type="submit" loading={loading} className="mt-2">
            Daftar Akun
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-zinc-500 m-0">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-indigo-600 font-semibold no-underline hover:underline">
              Masuk Disini
            </Link>
          </p>
        </div>
      </Card>
    </main>
  );
}
