"use client";

import { useState, useEffect } from "react";

interface EventItem {
  idEvent: string;
  eventName: string;
  stageName: string;
  location: string;
}

interface ArtistItem {
  idArtist: string;
  name: string;
  genre: string;
}

interface EventSchedule {
  idJadwal: string;
  panggung: string;
  startTime: string; // ISO date string
  endTime: string;   // ISO date string
  eventId: string;
  eventName: string;
  artistId: string;
  artistName: string;
}

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
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>Penjadwalan Rundown Konser</h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Kelola data event, registrasi musisi, serta susun timeline rundown dengan proteksi pendeteksi jadwal bentrok</p>
      </div>

      {success && (
        <div style={{
          marginBottom: "20px",
          padding: "12px 16px",
          borderRadius: "8px",
          backgroundColor: "#ecfdf5",
          border: "1px solid #a7f3d0",
          color: "#059669",
          fontSize: "13px",
          fontWeight: "600"
        }}>
          ✅ {success}
        </div>
      )}

      {error && (
        <div style={{
          marginBottom: "20px",
          padding: "12px 16px",
          borderRadius: "8px",
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#dc2626",
          fontSize: "13px",
          fontWeight: "600"
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.6fr",
        gap: "24px",
        alignItems: "start"
      }}>
        {/* Left Side: Adding Events, Artists, and Schedules */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Form 1: Add Schedule (Primary) */}
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
          }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>📅 Tambah Jadwal Rundown</h2>
            <form onSubmit={handleAddSchedule} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                  Pilih Event
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "13px",
                    color: "#0f172a",
                    outline: "none",
                    fontWeight: "600"
                  }}
                >
                  {events.map((evt) => (
                    <option key={evt.idEvent} value={evt.idEvent}>
                      {evt.eventName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                  Pilih Artis Musisi
                </label>
                <select
                  value={selectedArtistId}
                  onChange={(e) => setSelectedArtistId(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "13px",
                    color: "#0f172a",
                    outline: "none",
                    fontWeight: "600"
                  }}
                >
                  {artists.map((art) => (
                    <option key={art.idArtist} value={art.idArtist}>
                      {art.name} ({art.genre})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                  Nama Panggung
                </label>
                <select
                  value={schedulePanggung}
                  onChange={(e) => setSchedulePanggung(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "13px",
                    color: "#0f172a",
                    outline: "none",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  <option value="Main Stage">Main Stage (Panggung Utama)</option>
                  <option value="Cyber Stage">Cyber Stage (Panggung Elektronik)</option>
                  <option value="Neon Stage">Neon Stage (Panggung Baru)</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                    Waktu Mulai
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleStart}
                    onChange={(e) => setScheduleStart(e.target.value)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      fontSize: "13px",
                      color: "#0f172a",
                      outline: "none"
                    }}
                    required
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                    Waktu Selesai
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleEnd}
                    onChange={(e) => setScheduleEnd(e.target.value)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      fontSize: "13px",
                      color: "#0f172a",
                      outline: "none"
                    }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || events.length === 0 || artists.length === 0}
                style={{
                  width: "100%",
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "700",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  marginTop: "6px",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: "0 2px 4px 0 rgba(79, 70, 229, 0.15)"
                }}
              >
                {loading ? "Memproses..." : "➕ Simpan ke Rundown"}
              </button>
            </form>
          </div>

          {/* Form 2: Add New Event & Form 3: Add New Artist */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "16px"
          }}>
            {/* Event Form */}
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
            }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 12px 0" }}>🎤 Tambah Master Event</h3>
              <form onSubmit={handleAddEvent} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Nama Event Konser"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    color: "#0f172a",
                    outline: "none"
                  }}
                  required
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#0f172a",
                    color: "#ffffff",
                    border: "none",
                    fontWeight: "700",
                    padding: "8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "11px"
                  }}
                >
                  Tambah Event
                </button>
              </form>
            </div>

            {/* Artist Form */}
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
            }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 12px 0" }}>🎸 Registrasi Musisi / Artis</h3>
              <form onSubmit={handleAddArtist} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Nama Band / DJ / Artis"
                  value={newArtistName}
                  onChange={(e) => setNewArtistName(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    color: "#0f172a",
                    outline: "none"
                  }}
                  required
                />
                <input
                  type="text"
                  placeholder="Genre (misal: Rock, Jazz, EDM)"
                  value={newArtistGenre}
                  onChange={(e) => setNewArtistGenre(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    color: "#0f172a",
                    outline: "none"
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#0f172a",
                    color: "#ffffff",
                    border: "none",
                    fontWeight: "700",
                    padding: "8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "11px"
                  }}
                >
                  Registrasi Artis
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side: Timeline Rundown List */}
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>Jadwal Rundown & Panggung</h2>
          
          {schedules.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {schedules.map((sch) => (
                <div key={sch.idJadwal} style={{
                  padding: "16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  backgroundColor: "#fafafa",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: "800",
                      backgroundColor: sch.panggung === "Main Stage" ? "#eeebff" : "#fffbeb",
                      color: sch.panggung === "Main Stage" ? "#4f46e5" : "#d97706",
                      padding: "2px 8px",
                      borderRadius: "4px"
                    }}>
                      ⚡ {sch.panggung}
                    </span>
                    <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", margin: "8px 0 4px 0" }}>
                      {sch.artistName}
                    </h3>
                    <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 4px 0" }}>🏆 {sch.eventName}</p>
                    <div style={{ fontSize: "12px", color: "#475569", fontWeight: "600" }}>
                      🕐 {formatDateTime(sch.startTime)} - {sch.endTime.split("T")[1]}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSchedule(sch.idJadwal)}
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#ef4444",
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fee2e2",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    🗑️ Hapus
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: "24px",
              textAlign: "center",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              backgroundColor: "#fafafa"
            }}>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Belum ada jadwal rundown yang terdaftar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
