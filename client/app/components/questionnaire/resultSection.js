"use client";

import { forwardRef } from "react";
import { Icon } from "@iconify/react";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatDisplayTime = (timeString) => {
  if (!timeString) return "";

  const [hour, minute] = timeString.split(":").map(Number);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return timeString;
  }

  const date = new Date();

  date.setHours(hour);
  date.setMinutes(minute);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const ResultSection = forwardRef(function ResultSection(
  {
    gender,
    totalScore,
    resultData,
    onPrimaryAction,
    isAlreadyBooked = false,
    bookedDate = "",
    bookedTime = "",
    userName = "",
    consultationStatus = "draft",
    onCancel,
  },
  ref
) {
  const firstName = userName?.trim()?.split(" ")[0] || "";

  const normalizedStatus = consultationStatus?.trim()?.toLowerCase();

  const isCancelled = normalizedStatus === "cancelled";

  const shouldShowDateTime =
    !isCancelled && (bookedDate || bookedTime);

  const getStatusStyles = () => {
    if (normalizedStatus === "draft") {
      return {
        text: "Draft",
        className:
          "bg-gray-500/10 text-gray-600 border border-gray-500/20",
        icon: "solar:document-bold",
      };
    }

    if (normalizedStatus === "completed") {
      return {
        text: "Completed",
        className:
          "bg-green-500/10 text-green-600 border border-green-500/20",
        icon: "solar:check-circle-bold",
      };
    }

    if (normalizedStatus === "cancelled") {
      return {
        text: "Cancelled",
        className:
          "bg-red-500/10 text-red-500 border border-red-500/20",
        icon: "solar:close-circle-bold",
      };
    }

    if (normalizedStatus === "rescheduled") {
      return {
        text: "Rescheduled",
        className:
          "bg-blue-500/10 text-blue-600 border border-blue-500/20",
        icon: "solar:refresh-bold",
      };
    }

    return {
      text: "Pending",
      className:
        "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20",
      icon: "solar:clock-circle-bold",
    };
  };

  const status = getStatusStyles();

  return (
    <div
      ref={ref}
      className="bg-white rounded-[30px] border border-[#AFAFAF]/15 px-6 md:px-10 py-8 md:py-10 shadow-[0_20px_80px_rgba(0,0,0,0.04)]"
    >
      {/* TOP */}
      <div className="text-center mb-8 flex flex-col items-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#4EDDE2] mb-3">
          Your Free Score
        </p>

        <h2 className="text-[30px] md:text-[40px] font-semibold text-[#111111] leading-[1.08] mb-4">
          {gender?.toLowerCase() === "male"
            ? "Your Body Status"
            : "Here’s what your body is going through"}
        </h2>

        <div className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#3E1747] text-white text-base md:text-lg font-medium">
          Score: {totalScore}
        </div>

        {gender === "male" && (
          <p className="text-[#3E1747]/65 mt-4 text-base">
            {resultData.label}
          </p>
        )}

        {/* BOOKED CARD */}
        {isAlreadyBooked && (
          <div className="mt-5 w-full max-w-[520px] rounded-3xl border border-[#4EDDE2]/20 bg-[#4EDDE2]/8 px-5 py-5">
            {/* heading */}
            <div className="flex items-center justify-center gap-2 text-[#111111]">
              <div className="w-8 h-8 rounded-full bg-[#4EDDE2]/15 flex items-center justify-center">
                <Icon
                  icon={
                    isCancelled
                      ? "solar:close-circle-bold"
                      : "solar:check-circle-bold"
                  }
                  className="text-[#3E1747]"
                  width="18"
                />
              </div>

              <p className="text-sm md:text-base font-semibold">
                {isCancelled
                  ? firstName
                    ? `Consultation Cancelled for ${firstName}`
                    : "Consultation Cancelled"
                  : firstName
                  ? `Consultation Booked for ${firstName}`
                  : "Consultation Already Booked"}
              </p>
            </div>

            {/* slot */}
            {shouldShowDateTime && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-[#3E1747]/75">
                {bookedDate && (
                  <div className="flex items-center gap-1.5">
                    <Icon
                      icon="solar:calendar-linear"
                      width="16"
                    />
                    <span>
                      {formatDisplayDate(bookedDate)}
                    </span>
                  </div>
                )}

                {bookedTime && (
                  <div className="flex items-center gap-1.5">
                    <Icon
                      icon="solar:clock-circle-linear"
                      width="16"
                    />
                    <span>
                      {formatDisplayTime(bookedTime)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* status */}
            <div
              className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${status.className}`}
            >
              <Icon icon={status.icon} width="14" />
              {status.text}
            </div>

            {/* whatsapp button */}
            {!isCancelled && (
              <a
                href="YOUR-WHATSAPP-LINK"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full h-12 rounded-2xl bg-green-500 text-white font-medium flex items-center justify-center gap-1 hover:opacity-90 transition md:px-4 px-1 md:py-2 py-1 md:text-md sm:text-[0.8em] text-[0.7em] whitespace-nowrap"
              >
                <Icon
                  icon="logos:whatsapp-icon md:block hidden"
                  width="20"
                />
                <Icon
                  icon="logos:whatsapp-icon"
                  className="md:hidden"
                  width="14"
                />
                Join WhatsApp Community
              </a>
            )}

            {/* cancel */}
            {(normalizedStatus === "pending" ||
              normalizedStatus === "rescheduled") && (
              <>
                <button
                  onClick={onCancel}
                  className="mt-4 text-sm text-red-500 hover:underline"
                >
                  Cancel Consultation
                </button>

                <p className="mt-2 text-[11px] leading-5 text-red-400 max-w-[280px] mx-auto">
                  Booking fee is non-refundable if cancelled.
                  You may reschedule based on availability.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-3xl bg-[#FAFAFB] border border-[#AFAFAF]/10 p-5 md:p-6">
          <h3 className="text-lg md:text-xl text-[#111111] mb-4 font-semibold">
            Body Insights
          </h3>

          <ul className="space-y-3">
            {resultData.issues?.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[#111111]/85"
              >
                <span className="w-2 h-2 rounded-full bg-[#4EDDE2] mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl bg-[#FAFAFB] border border-[#AFAFAF]/10 p-5 md:p-6">
          <h3 className="text-lg md:text-xl text-[#111111] mb-4 font-semibold">
            Why this happens
          </h3>

          <p className="text-[#111111]/75 leading-8">
            {resultData.message}
          </p>

          {resultData.outcome?.length > 0 && (
            <div className="mt-5">
              <h4 className="text-[#111111] font-medium mb-3">
                Fix this → You get:
              </h4>

              <ul className="space-y-2.5">
                {resultData.outcome.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[#111111]/85"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#4EDDE2] mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center flex flex-col items-center">
        <button
          onClick={onPrimaryAction}
          className="bg-[#3E1747] text-white px-7 py-3.5 rounded-2xl hover:bg-[#4EDDE2] hover:text-[#3E1747] transition-all font-medium flex items-center gap-2 justify-center shadow-md hover:shadow-lg relative"
        >
          {isAlreadyBooked
            ? isCancelled
              ? "Reschedule Consultation"
              : "See Your Packages"
            : "Book Your 1:1 Consultation"}

          <Icon
            icon="solar:arrow-right-linear"
            width="16"
          />
        </button>

        <p className="text-sm text-[#3E1747]/50 mt-4">
          {isAlreadyBooked
            ? isCancelled
              ? "Your previous booking was cancelled. Choose a fresh slot now."
              : "Your consultation is scheduled. Continue to your recommended packages."
            : "Your plan will be built for your body, not copied from a template."}
        </p>
      </div>
    </div>
  );
});

export default ResultSection;