"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { BackendURL } from "../lib/config/url";
import { showToast } from "../lib/toast";

export default function ConsultationCard() {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
  });

  const timeSlots = [
    "10:00 AM","11:00 AM","12:00 PM",
    "01:00 PM","02:00 PM","03:00 PM",
    "04:00 PM","05:00 PM","06:00 PM",
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const formatDate = (d) =>
    `${year}-${String(month + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

  const today = new Date();
  today.setHours(0,0,0,0);

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    if (hours === "12") hours = "00";
    if (modifier === "PM") hours = parseInt(hours) + 12;

    return { hours: parseInt(hours), minutes: parseInt(minutes) };
  };

  // 🔥 Fetch booked slots (UPDATED ROUTE)
  useEffect(() => {
    if (!selectedDate) return;

    axios.get(`${BackendURL}/leads/slots`, {
      params: { date: selectedDate }
    })
    .then(res => setBookedSlots(res.data.slots || []))
    .catch(() => setBookedSlots([]));

  }, [selectedDate]);

  const handleBooking = async () => {
    try {
      if (!form.name || !form.phone || !form.email || !selectedDate || !selectedTime || !form.gender) {
        showToast("Please fill all fields and select date/time", "error");
        return;
      }

      // 🔥 UPDATED ROUTE
      const res = await axios.post(`${BackendURL}/leads/create`, {
        name: form.name,
        phone: form.phone,
        email: form.email,
        date: selectedDate,
        time: selectedTime,
        gender: form.gender,
        source: "direct"
      });

      showToast("Booking Confirmed ✅", "success");

      // update UI
      setBookedSlots(prev => [...prev, selectedTime]);
      setSelectedDate(null);
      setSelectedTime(null);
      setForm({ name: "", phone: "", email: "", gender: "" });

    } catch (err) {
      showToast(err.response.data.message || "An error occurred", "error");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 w-full max-w-lg mx-auto">

      {/* HEADER */}
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-[#111]">
          Protocol Consultation
        </h4>
        <p className="text-xs text-[#3E1747]/60 flex items-center mt-1">
          <Icon icon="solar:clock-circle-linear" className="mr-1" />
          45 min session
        </p>
      </div>

      {/* CALENDAR */}
      <div className="bg-[#FAFAFB] rounded-2xl p-4 mb-6">

        <div className="flex justify-between items-center mb-3">
          <h5 className="text-sm font-medium">
            {currentDate.toLocaleString("default",{month:"long"})} {year}
          </h5>

          <div className="flex gap-2">
            <button onClick={() => setCurrentDate(new Date(year, month - 1))}>
              <Icon icon="solar:alt-arrow-left-linear" />
            </button>
            <button onClick={() => setCurrentDate(new Date(year, month + 1))}>
              <Icon icon="solar:alt-arrow-right-linear" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-xs text-center mb-2 text-gray-400">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1 text-sm text-center">
          {days.map((d,i)=>{
            if (!d) return <div key={i}></div>;

            const fullDate = new Date(year, month, d);
            fullDate.setHours(0,0,0,0);

            const isPast = fullDate < today;
            const isSelected = selectedDate === formatDate(d);

            return (
              <div
                key={i}
                onClick={()=>{
                  if(isPast) return;
                  setSelectedDate(formatDate(d));
                  setSelectedTime(null);
                }}
                className={`py-1.5 rounded-lg transition ${
                  isPast
                    ? "text-gray-300"
                    : isSelected
                    ? "bg-[#3E1747] text-white"
                    : "hover:bg-[#4EDDE2]/20 cursor-pointer"
                }`}
              >
                {d}
              </div>
            );
          })}
        </div>
      </div>

      {/* TIME */}
      {selectedDate && (
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">Available Slots</p>

          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map(time=>{
              const isBooked = bookedSlots.includes(time);

              const now = new Date();
              const selectedDateObj = new Date(selectedDate);

              const isToday = selectedDateObj.toDateString() === now.toDateString();

              let isPastTime = false;
              if (isToday) {
                const { hours, minutes } = convertTo24Hour(time);
                const slotTime = new Date();
                slotTime.setHours(hours, minutes, 0);
                isPastTime = slotTime < now;
              }

              const isDisabled = isBooked || isPastTime;

              return (
                <div
                  key={time}
                  onClick={()=>{
                    if(isDisabled) return;
                    setSelectedTime(time);
                  }}
                  className={`py-2 text-sm rounded-xl text-center transition ${
                    isDisabled
                      ? "text-gray-300"
                      : selectedTime === time
                      ? "bg-[#3E1747] text-white"
                      : "bg-[#FAFAFB] hover:bg-[#4EDDE2]/20 cursor-pointer"
                  }`}
                >
                  {time}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FORM */}
      <div className="space-y-4">

        {/* NAME */}
        <div className="relative">
          <Icon icon="solar:user-linear"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E1747]/40" />
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e)=>setForm({...form,name:e.target.value})}
            className="w-full pl-12 pr-4 py-3.5 text-sm rounded-2xl bg-[#FAFAFB] outline-none focus:ring-2 focus:ring-[#4EDDE2]/40"
          />
        </div>

        {/* PHONE */}
        <div className="relative">
          <Icon icon="solar:phone-linear"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E1747]/40" />
          <input
            type="text"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e)=>setForm({...form,phone:e.target.value})}
            className="w-full pl-12 pr-4 py-3.5 text-sm rounded-2xl bg-[#FAFAFB] outline-none focus:ring-2 focus:ring-[#4EDDE2]/40"
          />
        </div>

        {/* EMAIL */}
        <div className="relative">
          <Icon icon="solar:letter-linear"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E1747]/40" />
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e)=>setForm({...form,email:e.target.value})}
            className="w-full pl-12 pr-4 py-3.5 text-sm rounded-2xl bg-[#FAFAFB] outline-none focus:ring-2 focus:ring-[#4EDDE2]/40"
          />
        </div>

        {/* GENDER */}
        <div className="flex gap-4">
          {["Male","Female","Other"].map(gender=>(
            <div
              key={gender}
              onClick={()=>setForm({...form,gender})}
              className={`py-2 px-4 text-sm rounded-xl cursor-pointer transition ${
                form.gender === gender
                  ? "bg-[#3E1747] text-white"
                  : "bg-[#FAFAFB] hover:bg-[#4EDDE2]/20"
              }`}
            >
              {gender}
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <button
          onClick={handleBooking}
          className="w-full bg-[#3E1747] text-white py-3 rounded-xl text-sm hover:bg-[#4EDDE2] hover:text-[#3E1747] transition"
        >
          Confirm Booking
        </button>

      </div>

    </div>
  );
}