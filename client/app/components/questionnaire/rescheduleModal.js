"use client";

import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { BackendURL } from "@/app/lib/config/url";

export default function RescheduleModal({
  isOpen,
  onClose,
  onSubmit,
  time,
  setTime,
  date,
  setDate,
  isLoading = false,
}) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    date ? new Date(date) : new Date()
  );

  const timeSlots = useMemo(
    () => [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "01:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
      "06:00 PM",
    ],
    []
  );

  // ---------------------------------------
  // Fetch blocked slots
  // ---------------------------------------
  useEffect(() => {
    if (!isOpen) return;

    if (!date) {
      setBookedSlots([]);
      return;
    }

    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);

        const res = await axios.get(
          `${BackendURL}/consultations/slots`,
          {
            params: { date },
          }
        );

        setBookedSlots(
          Array.isArray(res.data?.slots)
            ? res.data.slots
            : []
        );
      } catch (error) {
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [date, isOpen]);

  if (!isOpen) return null;

  // ---------------------------------------
  // Calendar Logic
  // ---------------------------------------
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthLabel =
    currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

  const days = [];

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) days.push(d);

  const formatDate = (day) =>
    `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

  const availableCount =
    timeSlots.length - bookedSlots.length;

  return (
    <div className="fixed inset-0 z-[999] bg-black/35 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[520px] bg-white rounded-[28px] shadow-[0_25px_70px_rgba(0,0,0,0.14)] overflow-hidden">

        {/* Scrollable */}
        <div className="max-h-[88vh] overflow-y-auto">

          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-black/5 px-5 md:px-7 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] tracking-[0.22em] uppercase text-[#4EDDE2] mb-1">
                  Update Booking
                </p>

                <h3 className="text-[24px] md:text-[28px] font-semibold text-[#111111]">
                  Reschedule Consultation
                </h3>

                <p className="text-sm text-black/55 mt-1">
                  Choose a new date & time.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-[#F8F8F8] hover:bg-[#F1F1F1] flex items-center justify-center"
              >
                <Icon
                  icon="solar:close-circle-linear"
                  width="22"
                />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-5 md:px-7 py-5">

            {/* Month Nav */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(year, month - 1, 1)
                  )
                }
                className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center"
              >
                <Icon
                  icon="solar:alt-arrow-left-linear"
                  width="18"
                />
              </button>

              <p className="font-semibold text-[#111111]">
                {monthLabel}
              </p>

              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(year, month + 1, 1)
                  )
                }
                className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center"
              >
                <Icon
                  icon="solar:alt-arrow-right-linear"
                  width="18"
                />
              </button>
            </div>

            {/* Week */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-[10px] uppercase tracking-wide text-center text-black/40">
              {[
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
              ].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, i) => {
                if (!day)
                  return <div key={i}></div>;

                const fullDate = new Date(
                  year,
                  month,
                  day
                );

                fullDate.setHours(0, 0, 0, 0);

                const isPast =
                  fullDate < today;

                const formatted =
                  formatDate(day);

                const active =
                  date === formatted;

                return (
                  <button
                    key={formatted}
                    disabled={isPast}
                    onClick={() => {
                      setDate(formatted);
                      setTime("");
                    }}
                    className={`h-10 rounded-2xl text-sm font-medium transition ${
                      active
                        ? "bg-[#3E1747] text-white"
                        : isPast
                        ? "bg-[#F5F5F5] text-black/25 cursor-not-allowed"
                        : "border border-black/8 hover:border-[#4EDDE2] hover:bg-[#4EDDE2]/10"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Slots */}
            {date && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-[#111111]">
                    Time Slots
                  </h4>

                  <span className="text-xs text-black/50">
                    {loadingSlots
                      ? "Checking..."
                      : `${availableCount} available`}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {timeSlots.map((slot) => {
                    const booked =
                      bookedSlots.includes(
                        slot
                      );

                    const active =
                      time === slot;

                    return (
                      <button
                        key={slot}
                        disabled={booked}
                        onClick={() =>
                          !booked &&
                          setTime(slot)
                        }
                        className={`h-11 rounded-2xl text-sm font-medium transition ${
                          active
                            ? "bg-[#3E1747] text-white"
                            : booked
                            ? "bg-red-50 text-red-400 border border-red-100 line-through cursor-not-allowed"
                            : "border border-black/10 hover:border-[#4EDDE2] hover:bg-[#4EDDE2]/10"
                        }`}
                      >
                        {booked
                          ? `${slot} Full`
                          : slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-black/5 px-5 md:px-7 py-5 flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-12 rounded-2xl border border-black/10 text-[#111111] hover:bg-[#FAFAFB]"
            >
              Cancel
            </button>

            <button
              onClick={onSubmit}
              disabled={
                !date ||
                !time ||
                isLoading
              }
              className="flex-1 h-12 rounded-2xl bg-[#3E1747] text-white hover:bg-[#4EDDE2] hover:text-[#3E1747] transition disabled:opacity-60"
            >
              {isLoading
                ? "Updating..."
                : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}