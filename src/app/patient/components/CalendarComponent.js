"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const Calendar = dynamic(() => import("react-calendar"), {
  ssr: false,
});

import "react-calendar/dist/Calendar.css";
import "./BookingSection.css";

export default function CalendarComponent({ 
  selectedDate, 
  onDateChange, 
  selectedTimeSlot, 
  onTimeSlotChange,
  availableTimeSlots = [
    "09:00 AM",
    "10:30 AM",
    "12:00 PM",
    "02:00 PM",
    "03:30 PM",
    "05:00 PM",
  ],
  className = ""
}) {
  return (
    <div className={`flex flex-col md:flex-row gap-8 ${className}`}>
      <div className="flex-1">
        <Calendar
          onChange={onDateChange}
          value={selectedDate}
          minDate={new Date()}
          className="custom-calendar"
        />
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-medium text-[var(--text-blue-dark)] mb-4">
          Available Time Slots
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {availableTimeSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => onTimeSlotChange(slot)}
              className={`p-2 rounded-md text-sm ${
                selectedTimeSlot === slot
                  ? "bg-[var(--pastel-blue-dark)] text-white"
                  : "bg-[var(--pastel-blue-light)] text-[var(--text-blue-dark)] hover:bg-[var(--pastel-blue-medium)]"
              } transition-colors`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}