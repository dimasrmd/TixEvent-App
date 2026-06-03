export interface User {
  idUser: string;
  nama: string;
  email: string;
  role: string;
}

export interface StaffMember {
  idUser: string;
  nama: string;
  email: string;
  noHp: string;
  role: "KRU" | "PANITIA";
  status: "AKTIF" | "CUTI";
}

export interface CrewMember {
  idUser: string;
  nama: string;
  role: string;
}

export interface ShiftLog {
  idShift: string;
  idCrew: string;
  crewName: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  posTugas: string;
  statusHadir: "PENDING" | "HADIR" | "ABSEN";
}

export interface RefundClaim {
  idRefund: string;
  idTransaksi: string;
  alasan: string;
  jumlahRefund: number;
  statusRefund: "PENDING" | "APPROVED" | "REJECTED";
  namaPengunjung: string;
  tanggalAjuan: string;
}

export interface TenantPartner {
  idTenant: string;
  namaBrand: string;
  email: string;
  noHp: string;
  nomorBooth: string;
  lokasiBooth: string;
  kategoriUsaha: string;
  statusSewa: "TERVERIFIKASI" | "MENUNGGU_BAYAR";
}

export interface EventItem {
  idEvent: string;
  eventName: string;
  stageName: string;
  location: string;
}

export interface ArtistItem {
  idArtist: string;
  name: string;
  genre: string;
}

export interface EventSchedule {
  idJadwal: string;
  panggung: string;
  startTime: string;
  endTime: string;
  eventId: string;
  eventName: string;
  artistId: string;
  artistName: string;
}
