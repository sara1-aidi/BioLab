"use client";
import { useState, useEffect } from "react";

export default function UpcomingAppointmentCard({ appointments, onCancel, onReschedule }) {
  const [appointment, setAppointment] = useState(null);

  const getClosestAppointment = () => {
    const now = new Date();
    let closestAppointment = null;
    let closestDiff = Infinity;

    appointments.forEach((app) => {
      // Use the existing 24-hour format directly
      const appointmentDateTime = new Date(`${app.date}T${app.time}`);
      const diff = appointmentDateTime - now;
      
      // Only consider future appointments that aren't canceled
      if (diff > 0 && diff < closestDiff && app.status === 'confirmed') {
        closestDiff = diff;
        closestAppointment = app;
      }
    });

    return closestAppointment;
  };

  // Convert 24-hour time to 12-hour format for display
  const formatTimeForDisplay = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12; // Convert 0 to 12 for midnight
    return `${hour12}:${minutes} ${suffix}`;
  };

  useEffect(() => {
    const closest = getClosestAppointment();
    setAppointment(closest);
  }, [appointments]);

  const handleCancel = () => {
    const confirmDelete = window.confirm("Are you sure you want to cancel this appointment?");
    if (confirmDelete && appointment) onCancel(appointment.id);
  };

  const handleReschedule = () => {
    if (appointment) onReschedule(appointment.id, appointment.date, formatTimeForDisplay(appointment.time));
  };

  if (!appointment) {
    return (
      <div className="max-w-[600px] w-[90%] mx-auto my-8 bg-[var(--pastel-blue-light)] rounded-lg p-6 text-center border-l-4 border-[var(--pastel-blue-medium)] shadow-md">
        <p className="text-[var(--text-blue-dark)] text-xl">
          No upcoming appointments found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] w-[90%] mx-auto my-8 bg-[var(--pastel-blue-light)] rounded-lg p-6 flex justify-between items-start border-l-4 border-[var(--pastel-blue-medium)] shadow-md">
      <div className="flex-1">
        <h2 className="text-[var(--text-blue-dark)] text-xl font-semibold mb-3">
          Upcoming Appointment
        </h2>
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon />
            <span className="text-[var(--text-blue-medium)] text-base">
              {new Date(appointment.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon />
            <span className="text-[var(--text-blue-medium)] text-base">
              {formatTimeForDisplay(appointment.time)}
            </span>
          </div>
        </div>
        <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-[var(--pastel-green-light)] text-[var(--pastel-green-dark)]">
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <button 
          onClick={handleReschedule}
          className="flex items-center gap-2 bg-[var(--pastel-blue-medium)] text-[var(--text-blue-dark)] px-4 py-2 rounded-md hover:bg-[var(--pastel-blue-dark)] hover:text-white transition-colors"
        >
          <PencilIcon />
          <span>Reschedule</span>
        </button>
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 bg-[var(--pastel-blue-dark)] text-white px-4 py-2 rounded-md hover:bg-[var(--pastel-blue-medium)] hover:text-[var(--text-blue-dark)] transition-colors"
        >
          <XMarkIcon />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
}

// Keep the icon components the same as in your original

// Icon components (same as your original)
const CalendarIcon = () => (
  <svg className="w-5 h-5 text-[var(--text-blue-medium)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5 text-[var(--text-blue-medium)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PencilIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const XMarkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);