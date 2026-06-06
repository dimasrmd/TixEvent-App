"use client";

import { useState } from "react";
import Link from "next/link";
import { setCookie } from "../../../lib/cookieUtils";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function TenantLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan Password wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/tenant/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal! Silakan periksa kembali email dan password Anda.");
      }

      setSuccess(data.message || "Login Tenant Sukses!");
      
      // Save data from backend
      localStorage.setItem("role", data.role.toLowerCase());
      localStorage.setItem("idUser", data.idUser);
      localStorage.setItem("nama", data.nama);
      
      // Save to cookies for middleware route guard checks
      setCookie("role", data.role.toLowerCase(), 86400);
      setCookie("idUser", data.idUser, 86400);
      setCookie("nama", data.nama, 86400);

      setTimeout(() => {
        window.location.href = "/tenant/booth";
      }, 1000);
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
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-emerald-600 no-underline">
            TIXEVENT MITRA
          </Link>
          <h2 className="text-xl font-bold text-zinc-850 mt-4 mb-1">Login Mitra (Tenant)</h2>
          <p className="text-xs text-zinc-500 m-0">Gunakan akun Tenant Anda untuk memesan sewa lokasi booth stan (Simulasi Frontend)</p>
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
          <Input
            id="email"
            type="email"
            label="Email Tenant"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tenant@email.com"
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

          <Button type="submit" variant="secondary" loading={loading} className="mt-2">
            Masuk Tenant
          </Button>
        </form>

        <div className="mt-6 text-center flex flex-col gap-3">
          <p className="text-xs text-zinc-500 m-0">
            Belum punya akun tenant?{" "}
            <Link href="/gabung-mitra" className="text-emerald-600 font-semibold no-underline hover:underline">
              Registrasi
            </Link>
          </p>
          <Link href="/" className="text-zinc-500 font-semibold no-underline hover:underline text-xs">
            Kembali ke Beranda
          </Link>
        </div>
      </Card>
    </main>
  );
}
