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

  useEffect(() => {
    // 1. Initialize or load Events
    const savedEvents = localStorage.getItem("tixevent_events");
    if (savedEvents) {
      const parsed = JSON.parse(savedEvents);
      setEvents(parsed);
      if (parsed.length > 0) setSelectedEventId(parsed[0].idEvent);
    } else {
      const defaultEvents: EventItem[] = [
        { idEvent: "EVT-MOCK-01", eventName: "Neon Rhythm Festival 2026", stageName: "Main Stage", location: "Arena Barat" }
      ];
      setEvents(defaultEvents);
      setSelectedEventId(defaultEvents[0].idEvent);
      localStorage.setItem("tixevent_events", JSON.stringify(defaultEvents));
    }

    // 2. Initialize or load Artists
    const savedArtists = localStorage.getItem("tixevent_artists");
    if (savedArtists) {
      const parsed = JSON.parse(savedArtists);
      setArtists(parsed);
      if (parsed.length > 0) setSelectedArtistId(parsed[0].idArtist);
    } else {
      const defaultArtists: ArtistItem[] = [
        { idArtist: "ART-MOCK-01", name: "Cyber Pulse DJ", genre: "Electronic" },
        { idArtist: "ART-MOCK-02", name: "The Rock Anthems", genre: "Rock" },
        { idArtist: "ART-MOCK-03", name: "Synth Wave Trio", genre: "Indie Pop" }
      ];
      setArtists(defaultArtists);
      setSelectedArtistId(defaultArtists[0].idArtist);
      localStorage.setItem("tixevent_artists", JSON.stringify(defaultArtists));
    }

    // 3. Initialize or load Schedules
    const savedSchedules = localStorage.getItem("tixevent_schedules");
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    } else {
      const defaultSchedules: EventSchedule[] = [
        {
          idJadwal: "SCH-MOCK-701",
          panggung: "Main Stage",
          startTime: "2026-06-02T19:00",
          endTime: "2026-06-02T20:30",
          eventId: "EVT-MOCK-01",
          eventName: "Neon Rhythm Festival 2026",
          artistId: "ART-MOCK-01",
          artistName: "Cyber Pulse DJ"
        },
        {
          idJadwal: "SCH-MOCK-702",
          panggung: "Cyber Stage",
          startTime: "2026-06-02T20:00",
          endTime: "2026-06-02T21:30",
          eventId: "EVT-MOCK-01",
          eventName: "Neon Rhythm Festival 2026",
          artistId: "ART-MOCK-03",
          artistName: "Synth Wave Trio"
        }
      ];
      setSchedules(defaultSchedules);
      localStorage.setItem("tixevent_schedules", JSON.stringify(defaultSchedules));
    }
  }, []);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName) return;

    const newEvt: EventItem = {
      idEvent: "EVT-MOCK-" + Math.floor(100 + Math.random() * 900),
      eventName: newEventName,
      stageName: newStageName,
      location: newLocation
    };

    const updated = [...events, newEvt];
    setEvents(updated);
    localStorage.setItem("tixevent_events", JSON.stringify(updated));
    setSelectedEventId(newEvt.idEvent);
    setNewEventName("");
    setNewStageName("Main Stage");
    setNewLocation("Pusat Niaga Kemayoran");
    setSuccess(`Event "${newEvt.eventName}" berhasil ditambahkan!`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleAddArtist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtistName) return;

    const newArt: ArtistItem = {
      idArtist: "ART-MOCK-" + Math.floor(100 + Math.random() * 900),
      name: newArtistName,
      genre: newArtistGenre || "Umum"
    };

    const updated = [...artists, newArt];
    setArtists(updated);
    localStorage.setItem("tixevent_artists", JSON.stringify(updated));
    setSelectedArtistId(newArt.idArtist);
    setNewArtistName("");
    setNewArtistGenre("");
    setSuccess(`Artis "${newArt.name}" berhasil didaftarkan!`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !selectedArtistId || !schedulePanggung || !scheduleStart || !scheduleEnd) {
      setError("Semua isian jadwal rundown wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    setTimeout(() => {
      // 1. Conflict Check: Same Stage overlapping time slot!
      const startMs = new Date(scheduleStart).getTime();
      const endMs = new Date(scheduleEnd).getTime();

      if (startMs >= endMs) {
        setError("Gagal! Waktu Mulai tidak boleh setelah atau sama dengan Waktu Selesai!");
        setLoading(false);
        return;
      }

      // Check conflict inside schedules array
      const hasConflict = schedules.some((s) => {
        if (s.panggung.toLowerCase() !== schedulePanggung.toLowerCase()) return false;

        const existingStartMs = new Date(s.startTime).getTime();
        const existingEndMs = new Date(s.endTime).getTime();

        // Check overlap: (StartA < EndB) AND (EndA > StartB)
        return startMs < existingEndMs && endMs > existingStartMs;
      });

      if (hasConflict) {
        // Trigger simulated 400 Bad Request conflict exception
        setError("Gagal (400 Bad Request): Jadwal bentrok pada panggung yang sama!");
        setLoading(false);
        return;
      }

      // 2. No conflict: Save Schedule!
      const eventObj = events.find((e) => e.idEvent === selectedEventId);
      const artistObj = artists.find((a) => a.idArtist === selectedArtistId);

      const newSchedule: EventSchedule = {
        idJadwal: "SCH-MOCK-" + Math.floor(100 + Math.random() * 900),
        panggung: schedulePanggung,
        startTime: scheduleStart,
        endTime: scheduleEnd,
        eventId: selectedEventId,
        eventName: eventObj ? eventObj.eventName : "Event Acara",
        artistId: selectedArtistId,
        artistName: artistObj ? artistObj.name : "Artis Musisi"
      };

      const updated = [newSchedule, ...schedules];
      setSchedules(updated);
      localStorage.setItem("tixevent_schedules", JSON.stringify(updated));

      setSuccess(`Berhasil menjadwalkan "${artistObj?.name}" pada panggung ${schedulePanggung}!`);
      setScheduleStart("");
      setScheduleEnd("");
      setLoading(false);
    }, 700);
  };

  const handleDeleteSchedule = (id: string) => {
    const updated = schedules.filter((s) => s.idJadwal !== id);
    setSchedules(updated);
    localStorage.setItem("tixevent_schedules", JSON.stringify(updated));
    setSuccess("Jadwal rundown berhasil dihapus.");
    setTimeout(() => setSuccess(""), 3000);
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
