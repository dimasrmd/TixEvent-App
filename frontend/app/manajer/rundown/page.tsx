"use client";

import { useState, useEffect } from "react";
import { EventItem, ArtistItem, EventSchedule } from "../../../lib/types";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

export default function RundownScheduling() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [artists, setArtists] = useState<ArtistItem[]>([]);
  const [schedules, setSchedules] = useState<EventSchedule[]>([]);

  // Form states - Event
  const [newEventName, setNewEventName] = useState("");
  const [newStageName, setNewStageName] = useState("Main Stage");
  const [newLocation, setNewLocation] = useState("Pusat Niaga Kemayoran");

  // Form states - Artist
  const [newArtistName, setNewArtistName] = useState("");
  const [newArtistGenre, setNewArtistGenre] = useState("");

  // Form states - Schedule
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedArtistId, setSelectedArtistId] = useState("");
  const [schedulePanggung, setSchedulePanggung] = useState("Main Stage");
  const [scheduleStart, setScheduleStart] = useState("");
  const [scheduleEnd, setScheduleEnd] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchAllData = async () => {
    try {
      const [eventsRes, artistsRes, schedulesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/rundown/events`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/rundown/artists`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/rundown`)
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
        if (eventsData.length > 0) setSelectedEventId(eventsData[0].idEvent);
      }
      if (artistsRes.ok) {
        const artistsData = await artistsRes.json();
        setArtists(artistsData);
        if (artistsData.length > 0) setSelectedArtistId(artistsData[0].idArtist);
      }
      if (schedulesRes.ok) {
        const schedulesData = await schedulesRes.json();
        const formatted = schedulesData.map((s: any) => ({
          idJadwal: s.idJadwal,
          panggung: s.panggung,
          startTime: s.startTime,
          endTime: s.endTime,
          eventId: s.event?.idEvent || "",
          eventName: s.event?.eventName || "Event",
          artistId: "",
          artistName: s.event?.eventName || "Penampil"
        }));
        setSchedules(formatted);
      }
    } catch (err) {
      console.error("Gagal memuat data rundown", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rundown/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: newEventName,
          stageName: newStageName,
          location: newLocation
        })
      });
      if (!response.ok) throw new Error("Gagal menambah event");
      const data = await response.json();
      
      setEvents([...events, data]);
      setSelectedEventId(data.idEvent);
      setNewEventName("");
      setSuccess(`Event "${data.eventName}" berhasil ditambahkan!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleAddArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtistName) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rundown/artists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newArtistName,
          genre: newArtistGenre || "Umum"
        })
      });
      if (!response.ok) throw new Error("Gagal menambah artis");
      const data = await response.json();

      setArtists([...artists, data]);
      setSelectedArtistId(data.idArtist);
      setNewArtistName("");
      setNewArtistGenre("");
      setSuccess(`Artis "${data.name}" berhasil didaftarkan!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !schedulePanggung || !scheduleStart || !scheduleEnd) {
      setError("Semua isian jadwal rundown wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const eventObj = events.find((evt) => evt.idEvent === selectedEventId);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rundown`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panggung: schedulePanggung,
          startTime: scheduleStart,
          endTime: scheduleEnd,
          event: eventObj
        })
      });

      const data = await response.json();

      if (!response.ok || data.status === "Failed") {
        throw new Error(data.message || "Jadwal bentrok pada panggung yang sama!");
      }

      setSuccess(`Berhasil menjadwalkan pada panggung ${schedulePanggung}!`);
      setScheduleStart("");
      setScheduleEnd("");
      
      // refresh schedules
      fetchAllData();
    } catch (err: any) {
      setError("Gagal (400 Bad Request): " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rundown/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setSchedules(schedules.filter((s) => s.idJadwal !== id));
        setSuccess("Jadwal rundown berhasil dihapus.");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Gagal menghapus jadwal", err);
    }
  };

  const formatDateTime = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  return (
    <div>
      {/* Title Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 m-0 mb-1">Penjadwalan Rundown Konser</h1>
        <p className="text-xs text-slate-500 m-0">Kelola data event, registrasi musisi, serta susun timeline rundown dengan proteksi pendeteksi jadwal bentrok</p>
      </div>

      {success && (
        <div className="mb-5 py-3 px-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold">
          ✅ {success}
        </div>
      )}

      {error && (
        <div className="mb-5 py-3 px-4 rounded-lg bg-red-50 border border-red-200 text-red-650 text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-6 items-start">
        {/* Left Side: Adding Events, Artists, and Schedules */}
        <div className="flex flex-col gap-6">
          
          {/* Form 1: Add Schedule (Primary) */}
          <Card maxWidth="100%">
            <h2 className="text-sm font-bold text-slate-800 m-0 mb-4">📅 Tambah Jadwal Rundown</h2>
            <form onSubmit={handleAddSchedule} className="flex flex-col gap-3.5">
              <Select
                id="selectedEventId"
                label="Pilih Event"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
              >
                {events.map((evt) => (
                  <option key={evt.idEvent} value={evt.idEvent}>
                    {evt.eventName}
                  </option>
                ))}
              </Select>

              <Select
                id="selectedArtistId"
                label="Pilih Artis Musisi"
                value={selectedArtistId}
                onChange={(e) => setSelectedArtistId(e.target.value)}
              >
                {artists.map((art) => (
                  <option key={art.idArtist} value={art.idArtist}>
                    {art.name} ({art.genre})
                  </option>
                ))}
              </Select>

              <Select
                id="schedulePanggung"
                label="Nama Panggung"
                value={schedulePanggung}
                onChange={(e) => setSchedulePanggung(e.target.value)}
              >
                <option value="Main Stage">Main Stage (Panggung Utama)</option>
                <option value="Cyber Stage">Cyber Stage (Panggung Elektronik)</option>
                <option value="Neon Stage">Neon Stage (Panggung Baru)</option>
              </Select>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="scheduleStart"
                  type="datetime-local"
                  label="Waktu Mulai"
                  value={scheduleStart}
                  onChange={(e) => setScheduleStart(e.target.value)}
                  required
                />
                <Input
                  id="scheduleEnd"
                  type="datetime-local"
                  label="Waktu Selesai"
                  value={scheduleEnd}
                  onChange={(e) => setScheduleEnd(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" loading={loading} disabled={events.length === 0 || artists.length === 0} className="mt-1 shadow-indigo-50">
                ➕ Simpan ke Rundown
              </Button>
            </form>
          </Card>

          {/* Form 2: Add New Event & Form 3: Add New Artist */}
          <div className="grid grid-cols-1 gap-4">
            {/* Event Form */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm box-border">
              <h3 className="text-xs font-bold text-slate-800 m-0 mb-3">🎤 Tambah Master Event</h3>
              <form onSubmit={handleAddEvent} className="flex flex-col gap-2.5">
                <input
                  type="text"
                  placeholder="Nama Event Konser"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2 px-3 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-indigo-500 transition-colors box-border"
                  required
                />
                <input
                  type="text"
                  placeholder="Nama Panggung (misal: Main Stage)"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2 px-3 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-indigo-500 transition-colors box-border"
                  required
                />
                <input
                  type="text"
                  placeholder="Lokasi Event (misal: Arena Barat)"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2 px-3 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-indigo-500 transition-colors box-border"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white border-none font-bold py-2 rounded-lg cursor-pointer text-xs transition-colors"
                >
                  Tambah Event
                </button>
              </form>
            </div>

            {/* Artist Form */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm box-border">
              <h3 className="text-xs font-bold text-slate-800 m-0 mb-3">🎸 Registrasi Musisi / Artis</h3>
              <form onSubmit={handleAddArtist} className="flex flex-col gap-2.5">
                <input
                  type="text"
                  placeholder="Nama Band / DJ / Artis"
                  value={newArtistName}
                  onChange={(e) => setNewArtistName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2 px-3 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-indigo-500 transition-colors box-border"
                  required
                />
                <input
                  type="text"
                  placeholder="Genre (misal: Rock, Jazz, EDM)"
                  value={newArtistGenre}
                  onChange={(e) => setNewArtistGenre(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2 px-3 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-indigo-500 transition-colors box-border"
                />
                <button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white border-none font-bold py-2 rounded-lg cursor-pointer text-xs transition-colors"
                >
                  Registrasi Artis
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side: Timeline Rundown List */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm box-border">
          <h2 className="text-sm font-bold text-slate-800 m-0 mb-4">Jadwal Rundown & Panggung</h2>
          
          {schedules.length > 0 ? (
            <div className="flex flex-col gap-4">
              {schedules.map((sch) => (
                <div key={sch.idJadwal} className="p-4 border border-zinc-200 rounded-xl bg-zinc-50/50 flex justify-between items-center box-border">
                  <div>
                    <span className={`text-[10px] font-bold py-0.5 px-2.5 rounded ${
                      sch.panggung === "Main Stage" ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      ⚡ {sch.panggung}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 mt-2 mb-1">
                      {sch.artistName}
                    </h3>
                    <p className="text-[11px] text-zinc-400 m-0 mb-1">🏆 {sch.eventName}</p>
                    <div className="text-xs text-slate-700 font-semibold">
                      🕐 {formatDateTime(sch.startTime)} - {sch.endTime.split("T")[1]}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSchedule(sch.idJadwal)}
                    className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center border border-zinc-200 rounded-xl bg-zinc-50">
              <p className="text-xs text-zinc-500 m-0">Belum ada jadwal rundown yang terdaftar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
