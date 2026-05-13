"use client";

import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { BackendURL } from "@/app/lib/config/url";
import { showToast, toastPromise } from "@/app/lib/toast";

export default function ConsultationModal({
  isOpen,
  isSubmitting,
  consultationForm,
  setConsultationForm,
  onClose,
  onSubmit,
}) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

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
  // Fetch booked slots
  // ---------------------------------------
  useEffect(() => {
    if (!isOpen) return;

    if (!consultationForm?.date) {
      setBookedSlots([]);
      return;
    }

    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);

        const res = await axios.get(
          `${BackendURL}/consultations/slots`,
          {
            params: {
              date: consultationForm.date,
            },
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
  }, [isOpen, consultationForm?.date]);

  if (!isOpen) return null;

  // ---------------------------------------
  // Calendar
  // ---------------------------------------
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

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

  // ---------------------------------------
  // Submit
  // ---------------------------------------
  const handleSubmit = () => {
    if (!consultationForm.date) {
      showToast("Select a date", "error");
      return;
    }

    if (!consultationForm.time) {
      showToast("Select a time slot", "error");
      return;
    }

    if (
      bookedSlots.includes(
        consultationForm.time
      )
    ) {
      showToast(
        "This slot is already booked",
        "error"
      );
      return;
    }

    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/35 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[520px] bg-white rounded-[28px] shadow-[0_25px_70px_rgba(0,0,0,0.14)] overflow-hidden">

        <div className="max-h-[88vh] overflow-y-auto">

          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-black/5 px-5 md:px-7 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] tracking-[0.22em] uppercase text-[#4EDDE2] mb-1">
                  Final Step
                </p>

                <h3 className="text-[24px] md:text-[28px] font-semibold text-[#111111]">
                  Book Consultation
                </h3>

                <p className="text-sm text-black/55 mt-1">
                  Select slot and pay ₹999 booking fee.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-[#F8F8F8] hover:bg-[#F1F1F1] flex items-center justify-center transition"
              >
                <Icon
                  icon="solar:close-circle-linear"
                  width="22"
                />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="px-5 md:px-7 py-4 border-b border-black/5 bg-[#FAFAFB]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#3E1747] text-white flex items-center justify-center font-semibold">
                {consultationForm.name?.[0] || "U"}
              </div>

              <div>
                <p className="font-medium text-[#111111]">
                  {consultationForm.name}
                </p>

                <p className="text-sm text-black/50">
                  {consultationForm.email}
                </p>
              </div>
            </div>
          </div>

          {/* Fee Banner */}
          <div className="px-5 md:px-7 py-4 bg-[#3E1747] text-white">
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-80">
                Consultation Fee
              </span>

              <span className="text-xl font-semibold">
                ₹999
              </span>
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
                className="w-10 h-10 rounded-xl border border-black/10 hover:bg-[#FAFAFB] flex items-center justify-center"
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
                className="w-10 h-10 rounded-xl border border-black/10 hover:bg-[#FAFAFB] flex items-center justify-center"
              >
                <Icon
                  icon="solar:alt-arrow-right-linear"
                  width="18"
                />
              </button>
            </div>

            {/* Week Labels */}
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
                  consultationForm.date ===
                  formatted;

                return (
                  <button
                    key={formatted}
                    disabled={isPast}
                    onClick={() =>
                      setConsultationForm(
                        (prev) => ({
                          ...prev,
                          date: formatted,
                          time: "",
                        })
                      )
                    }
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

            {/* Time Slots */}
            {consultationForm.date && (
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
                      consultationForm.time ===
                      slot;

                    return (
                      <button
                        key={slot}
                        disabled={booked}
                        onClick={() =>
                          !booked &&
                          setConsultationForm(
                            (prev) => ({
                              ...prev,
                              time: slot,
                            })
                          )
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
          <div className="sticky bottom-0 bg-white border-t border-black/5 px-5 md:px-7 py-5">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full h-13 rounded-2xl bg-[#3E1747] text-white font-medium hover:bg-[#4EDDE2] hover:text-[#3E1747] transition disabled:opacity-60"
            >
              {isSubmitting
                ? "Processing..."
                : "Pay ₹999 & Confirm Booking"}
            </button>

            <p className="text-center text-xs text-black/45 mt-3">
              Secure payment via Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}