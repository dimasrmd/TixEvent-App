"use client";

import { useState, useEffect } from "react";

interface TenantPartner {
  idTenant: string;
  namaBrand: string;
  email: string;
  noHp: string;
  nomorBooth: string;
  lokasiBooth: string;
  kategoriUsaha: string;
  statusSewa: "TERVERIFIKASI" | "MENUNGGU_BAYAR";
}

export default function TenantManagement() {
  const [tenants, setTenants] = useState<TenantPartner[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("tixevent_manager_tenants");
    if (saved) {
      setTenants(JSON.parse(saved));
    } else {
      const defaultTenants: TenantPartner[] = [
        {
          idTenant: "TNT-MOCK-201",
          namaBrand: "Gourmet Seafood & Grill",
          email: "seafood.grill@mitra.com",
          noHp: "081122334455",
          nomorBooth: "A01",
          lokasiBooth: "Food Court Utara",
          kategoriUsaha: "Makanan Berat",
          statusSewa: "TERVERIFIKASI"
        },
        {
          idTenant: "TNT-MOCK-202",
          namaBrand: "Nitro Brew Coffee & Pastry",
          email: "nitro.brew@mitra.com",
          noHp: "085544332211",
          nomorBooth: "A02",
          lokasiBooth: "Food Court Selatan",
          kategoriUsaha: "Minuman & Dessert",
          statusSewa: "TERVERIFIKASI"
        },
        {
          idTenant: "TNT-MOCK-203",
          namaBrand: "Rhythm Merch Official",
          email: "rhythm.merch@mitra.com",
          noHp: "089900112233",
          nomorBooth: "B03",
          lokasiBooth: "Merchandise Alley",
          kategoriUsaha: "Aksesoris & Baju",
          statusSewa: "TERVERIFIKASI"
        }
      ];
      setTenants(defaultTenants);
      localStorage.setItem("tixevent_manager_tenants", JSON.stringify(defaultTenants));
    }
  }, []);

  return (
    <div>
      {/* Title Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>Daftar Mitra Tenant & Stan</h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Tinjau seluruh data tenant komersial yang telah menyewa lokasi booth stan dan terverifikasi di area event</p>
      </div>

      {/* Tenant Table Container */}
      <div style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
      }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>Rekap Penyewaan Mitra</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700" }}>ID MITRA</th>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700" }}>NAMA BRAND / USAHA</th>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700" }}>KATEGORI</th>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700" }}>BOOTH TERSEWA</th>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700" }}>KONTAK MITRA</th>
                <th style={{ padding: "12px 10px", color: "#64748b", fontWeight: "700" }}>STATUS SEWA</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((partner) => (
                <tr key={partner.idTenant} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "16px 10px", fontWeight: "700", color: "#64748b" }}>{partner.idTenant}</td>
                  <td style={{ padding: "16px 10px" }}>
                    <div style={{ fontWeight: "700", color: "#0f172a" }}>{partner.namaBrand}</div>
                  </td>
                  <td style={{ padding: "16px 10px" }}>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      backgroundColor: "#f1f5f9",
                      color: "#475569"
                    }}>
                      {partner.kategoriUsaha}
                    </span>
                  </td>
                  <td style={{ padding: "16px 10px" }}>
                    <div style={{ fontWeight: "700", color: "#059669" }}>⛺ Booth {partner.nomorBooth}</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>📍 {partner.lokasiBooth}</div>
                  </td>
                  <td style={{ padding: "16px 10px" }}>
                    <div style={{ color: "#0f172a" }}>{partner.email}</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>📱 {partner.noHp}</div>
                  </td>
                  <td style={{ padding: "16px 10px" }}>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      backgroundColor: "#f0fdf4",
                      color: "#16a34a",
                      border: "1px solid #bbf7d0"
                    }}>
                      ✓ {partner.statusSewa}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
