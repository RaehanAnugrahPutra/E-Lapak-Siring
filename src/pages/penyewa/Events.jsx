// src/pages/penyewa/Events.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  CalendarDays,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { getEvents } from "../../api/Api";

const THEME = {
  navy: "#0D2647",
  gold: "#D8B46A",
  cabernet: "#7A2E3A",
  textSoft: "#4B5563",
  border: "#E5E7EB",
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;

  // ✅ FUNGSI HELPER UNTUK EXTRACT WAKTU DARI DATETIME
  const extractTime = (datetime) => {
    if (!datetime) return null;
    const date = new Date(datetime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;
    // Jangan tampilkan jika 00:00
    return time === '00:00' ? null : time;
  };

  useEffect(() => {
    const fetchEventsData = async () => {
      setLoading(true);
      try {
        const res = await getEvents();
        const mapped = res.map((e) => ({
          id: e.id,
          title: e.nama_event,
          location: e.lokasi_event || "Lokasi belum ditentukan",
          // ✅ Gunakan tanggal_mulai & tanggal_selesai
          dateStart: new Date(e.tanggal_mulai),
          dateEnd: e.tanggal_selesai ? new Date(e.tanggal_selesai) : null,
          // ✅ Extract waktu menggunakan helper function
          timeStart: extractTime(e.tanggal_mulai),
          timeEnd: extractTime(e.tanggal_selesai),
          dot: THEME.gold,
        }));
        setEvents(mapped.sort((a, b) => a.dateStart - b.dateStart));
      } catch (err) {
        console.error("Gagal mengambil data event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsData();
  }, []);

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
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
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
                  Semua Event
                </h3>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: `${THEME.gold}20`, color: THEME.gold }}
                >
                  {events.length} acara
                </span>
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
                        className="p-3 rounded-lg border transition hover:shadow-md cursor-pointer"
                        style={{ borderColor: THEME.border }}
                        onClick={() => setSelectedDate(event.dateStart)}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className="p-1.5 rounded-md flex-shrink-0"
                            style={{ background: THEME.navy }}
                          >
                            <CalendarDays className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5
                              className="font-bold text-sm truncate"
                              style={{ color: THEME.navy }}
                            >
                              {event.title}
                            </h5>
                            <div
                              className="flex items-center gap-1 mt-1 text-xs"
                              style={{ color: THEME.textSoft }}
                            >
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            
                            {/* ✅ TAMPILKAN RANGE TANGGAL & WAKTU */}
                            <div className="text-xs mt-1.5 font-medium" style={{ color: THEME.gold }}>
                              {/* TANGGAL */}
                              <div className="flex items-center gap-1">
                                <CalendarDays className="w-3 h-3 flex-shrink-0" />
                                <span>
                                  {event.dateStart.toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                  {/* TAMPILKAN RANGE JIKA BERBEDA */}
                                  {event.dateEnd && 
                                   event.dateEnd.toDateString() !== event.dateStart.toDateString() && (
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
                              
                              {/* WAKTU - HANYA TAMPIL JIKA ADA DAN BUKAN 00:00 */}
                              {(event.timeStart || event.timeEnd) && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3 h-3 flex-shrink-0" />
                                  <span>
                                    {event.timeStart && event.timeStart}
                                    {event.timeEnd && 
                                     event.timeEnd !== event.timeStart && 
                                     ` - ${event.timeEnd}`}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* PAGINATION */}
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
    </DashboardLayout>
  );
};

export default Events;
