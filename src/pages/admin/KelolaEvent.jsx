// src/pages/admin/KelolaEvent.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  CalendarDays,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  X,
  Clock,
} from "lucide-react";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../../api/Api";

const THEME = {
  navy: "#0D2647",
  gold: "#D8B46A",
  cabernet: "#7A2E3A",
  textSoft: "#4B5563",
  border: "#E5E7EB",
};

const KelolaEvent = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  
  const [form, setForm] = useState({
    nama_event: "",
    lokasi_event: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    waktu_mulai: "",
    waktu_selesai: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ FUNGSI HELPER UNTUK EXTRACT WAKTU
  const extractTime = (datetime) => {
    if (!datetime) return null;
    const date = new Date(datetime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;
    return time === '00:00' ? null : time;
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getEvents();
      const mapped = res.map((e) => ({
        id: e.id,
        title: e.nama_event,
        location: e.lokasi_event || "Lokasi belum ditentukan",
        dateStart: new Date(e.tanggal_mulai),
        dateEnd: e.tanggal_selesai ? new Date(e.tanggal_selesai) : null,
        timeStart: extractTime(e.tanggal_mulai),
        timeEnd: extractTime(e.tanggal_selesai),
        dot: THEME.gold,
        raw: e,
      }));
      setEvents(mapped.sort((a, b) => a.dateStart - b.dateStart));
    } catch (err) {
      console.error("Gagal mengambil data event:", err);
    } finally {
      setLoading(false);
    }
  };

  const getEventForDate = (date) =>
    events.find(
      (ev) =>
        ev.dateStart.getDate() === date.getDate() &&
        ev.dateStart.getMonth() === date.getMonth() &&
        ev.dateStart.getFullYear() === date.getFullYear()
    );

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++)
      days.push(new Date(year, month, d));

    return days;
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date) =>
    date && selectedDate && date.toDateString() === selectedDate.toDateString();

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
    );
  };

  const days = getDaysInMonth(currentMonth);

  const totalPages = Math.ceil(events.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const openModal = (event = null) => {
    if (event) {
      setEditing(event);
      
      const startDate = event.raw.tanggal_mulai ? event.raw.tanggal_mulai.split('T')[0] : event.dateStart.toISOString().split("T")[0];
      const endDate = event.raw.tanggal_selesai ? event.raw.tanggal_selesai.split('T')[0] : (event.dateEnd ? event.dateEnd.toISOString().split("T")[0] : "");
      
      setForm({
        nama_event: event.title,
        lokasi_event: event.location,
        tanggal_mulai: startDate,
        tanggal_selesai: endDate,
        waktu_mulai: event.timeStart || "",
        waktu_selesai: event.timeEnd || "",
      });
    } else {
      setEditing(null);
      const today = new Date().toISOString().split("T")[0];
      setForm({
        nama_event: "",
        lokasi_event: "",
        tanggal_mulai: today,
        tanggal_selesai: today,
        waktu_mulai: "",
        waktu_selesai: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({
      nama_event: "",
      lokasi_event: "",
      tanggal_mulai: "",
      tanggal_selesai: "",
      waktu_mulai: "",
      waktu_selesai: "",
    });
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveEvent = async () => {
    if (!form.nama_event.trim()) {
      return alert("Nama event wajib diisi!");
    }

    if (!form.tanggal_mulai) {
      return alert("Tanggal mulai wajib diisi!");
    }

    if (!form.tanggal_selesai) {
      return alert("Tanggal selesai wajib diisi!");
    }

    if (!form.lokasi_event.trim()) {
      return alert("Lokasi event wajib diisi!");
    }

    if (new Date(form.tanggal_selesai) < new Date(form.tanggal_mulai)) {
      return alert("Tanggal selesai tidak boleh lebih awal dari tanggal mulai!");
    }

    const payload = {
      nama_event: form.nama_event,
      lokasi_event: form.lokasi_event,
      tanggal_mulai: form.waktu_mulai 
        ? `${form.tanggal_mulai}T${form.waktu_mulai}:00` 
        : `${form.tanggal_mulai}T00:00:00`,
      tanggal_selesai: form.waktu_selesai 
        ? `${form.tanggal_selesai}T${form.waktu_selesai}:00` 
        : `${form.tanggal_selesai}T00:00:00`,
    };

    try {
      if (editing) {
        await updateEvent(editing.id, payload);
        alert("Event berhasil diupdate!");
      } else {
        await createEvent(payload);
        alert("Event berhasil ditambahkan!");
      }
      closeModal();
      fetchEvents();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Gagal menyimpan event!";
      alert(errorMsg);
    }
  };

  const removeEvent = async (id) => {
    if (!window.confirm("Yakin ingin menghapus event ini?")) return;

    try {
      await deleteEvent(id);
      alert("Event berhasil dihapus!");
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus event!");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F7F7F7] py-6 px-4 sm:px-6 lg:px-8 font-poppins">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* CALENDAR */}
            <div
              className="lg:col-span-3 rounded-xl shadow-sm p-5 bg-white border"
              style={{ borderColor: THEME.border }}
            >
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={goToPreviousMonth}
                  className="hover:bg-gray-100 p-2 rounded-lg transition"
                >
                  <ChevronLeft className="w-5 h-5" style={{ color: THEME.navy }} />
                </button>
                <h2 className="text-lg font-bold" style={{ color: THEME.navy }}>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <button
                  onClick={goToNextMonth}
                  className="hover:bg-gray-100 p-2 rounded-lg transition"
                >
                  <ChevronRight className="w-5 h-5" style={{ color: THEME.navy }} />
                </button>
              </div>

              <div
                className="grid grid-cols-7 gap-2 text-center text-xs font-semibold mb-2"
                style={{ color: THEME.textSoft }}
              >
                {dayNames.map((name) => (
                  <div key={name} className="py-2">{name}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  const event = day && getEventForDate(day);

                  return (
                    <div
                      key={index}
                      onClick={() => day && setSelectedDate(day)}
                      className={`h-12 flex items-center justify-center rounded-lg cursor-pointer relative transition hover:bg-gray-50 text-sm font-medium`}
                      style={{
                        background:
                          day && isSelected(day)
                            ? THEME.navy
                            : day && isToday(day)
                            ? `${THEME.gold}33`
                            : "transparent",
                        color: day && isSelected(day) ? "white" : THEME.navy,
                        border: day && isToday(day) ? `2px solid ${THEME.navy}` : "none",
                      }}
                    >
                      {day ? day.getDate() : ""}
                      {event && (
                        <span
                          className="absolute bottom-1 w-1.5 h-1.5 rounded-full shadow"
                          style={{ background: event.dot }}
                        ></span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ALL EVENTS */}
            <div
              className="lg:col-span-2 bg-white rounded-xl shadow-md p-4 border flex flex-col"
              style={{ borderColor: THEME.border }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold" style={{ color: THEME.navy }}>
                  Kelola Event
                </h3>
                <button
                  onClick={() => openModal()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition hover:opacity-90"
                  style={{ background: THEME.gold }}
                >
                  <Plus className="w-3 h-3" />
                  Tambah
                </button>
              </div>

              {loading ? (
                <div className="flex-1 flex items-center justify-center text-sm" style={{ color: THEME.textSoft }}>
                  <p>Memuat data event...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-sm" style={{ color: THEME.textSoft }}>
                  <CalendarDays className="w-10 h-10 mb-2 opacity-30" />
                  <p>Belum ada event</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 flex-1">
                    {currentEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 rounded-lg border transition hover:shadow-md"
                        style={{ borderColor: THEME.border }}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className="p-1.5 rounded-md flex-shrink-0"
                            style={{ background: THEME.navy }}
                          >
                            <CalendarDays className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-sm truncate" style={{ color: THEME.navy }}>
                              {event.title}
                            </h5>
                            <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: THEME.textSoft }}>
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            
                            {/* ✅ TAMPILKAN RANGE TANGGAL & WAKTU */}
                            <div className="text-xs mt-1.5 font-medium" style={{ color: THEME.gold }}>
                              <div className="flex items-center gap-1">
                                <CalendarDays className="w-3 h-3" />
                                <span>
                                  {event.dateStart.toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                  {event.dateEnd && (
                                    <>
                                      {" - "}
                                      {event.dateEnd.toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </>
                                  )}
                                </span>
                              </div>
                              {(event.timeStart || event.timeEnd) && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {event.timeStart || "00:00"}
                                    {event.timeEnd && event.timeEnd !== event.timeStart && ` - ${event.timeEnd}`}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-1.5 mt-2">
                              <button
                                onClick={() => openModal(event)}
                                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition"
                                style={{
                                  background: `${THEME.navy}15`,
                                  color: THEME.navy,
                                }}
                              >
                                <Edit2 className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => removeEvent(event.id)}
                                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition"
                                style={{
                                  background: `${THEME.cabernet}15`,
                                  color: THEME.cabernet,
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: THEME.border }}>
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: currentPage === 1 ? "#E5E7EB" : THEME.navy,
                          color: currentPage === 1 ? THEME.textSoft : "white",
                        }}
                      >
                        Previous
                      </button>

                      <span className="text-xs font-medium" style={{ color: THEME.textSoft }}>
                        {currentPage} / {totalPages}
                      </span>

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: currentPage === totalPages ? "#E5E7EB" : THEME.navy,
                          color: currentPage === totalPages ? THEME.textSoft : "white",
                        }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL FORM */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-lg p-5 border relative"
            style={{ borderColor: THEME.border }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold mb-4" style={{ color: THEME.navy }}>
              {editing ? "Edit Event" : "Tambah Event Baru"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: THEME.navy }}>
                  Nama Event <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.nama_event}
                  onChange={(e) => handleFormChange("nama_event", e.target.value)}
                  className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 outline-none"
                  style={{ borderColor: THEME.border }}
                  placeholder="Pameran Seni Pasar Terapung"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{ color: THEME.navy }}>
                    Tanggal Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.tanggal_mulai}
                    onChange={(e) => handleFormChange("tanggal_mulai", e.target.value)}
                    className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 outline-none"
                    style={{ borderColor: THEME.border }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{ color: THEME.navy }}>
                    Tanggal Selesai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.tanggal_selesai}
                    onChange={(e) => handleFormChange("tanggal_selesai", e.target.value)}
                    className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 outline-none"
                    style={{ borderColor: THEME.border }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{ color: THEME.navy }}>
                    Waktu Mulai
                  </label>
                  <input
                    type="time"
                    value={form.waktu_mulai}
                    onChange={(e) => handleFormChange("waktu_mulai", e.target.value)}
                    className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 outline-none"
                    style={{ borderColor: THEME.border }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{ color: THEME.navy }}>
                    Waktu Selesai
                  </label>
                  <input
                    type="time"
                    value={form.waktu_selesai}
                    onChange={(e) => handleFormChange("waktu_selesai", e.target.value)}
                    className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 outline-none"
                    style={{ borderColor: THEME.border }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: THEME.navy }}>
                  Lokasi Event <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.lokasi_event}
                  onChange={(e) => handleFormChange("lokasi_event", e.target.value)}
                  className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 outline-none"
                  style={{ borderColor: THEME.border }}
                  placeholder="Gedung Siring"
                />
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2.5 text-sm rounded-lg font-semibold border transition"
                  style={{ borderColor: THEME.border, color: THEME.textSoft }}
                >
                  Batal
                </button>
                <button
                  onClick={saveEvent}
                  className="flex-1 py-2.5 text-sm rounded-lg font-semibold text-white transition hover:opacity-90"
                  style={{ background: THEME.gold }}
                >
                  {editing ? "Update" : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default KelolaEvent;
