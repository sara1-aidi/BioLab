"use client";
import { useState, useEffect } from "react";
import UpcomingAppointmentCard from "../components/UpcomingAppointmentCard";
import BookingSection from "../components/BookingSection";
import CalendarComponent from "../components/CalendarComponent";
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PauseCircleIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { format } from 'date-fns';

export default function AppointmentPage() {
  const [appointments, setAppointments] = useState([]);
  const [modalState, setModalState] = useState({
    show: false,
    type: "",
    appointmentId: null,
    newDate: new Date(),
    newTime: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const availableTimeSlots = [
    "09:00 AM",
    "10:30 AM",
    "12:00 PM",
    "02:00 PM",
    "03:30 PM",
    "05:00 PM",
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/appointement');
        
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        
        const data = await response.json();
        
        const mappedData = data.map(app => ({
          id: app.id,
          date: app.date,
          time: app.time, // Store time in 24h format
          status: app.status.toLowerCase() === 'approved' ? 'confirmed' : app.status.toLowerCase(),
          patientName: app.patients?.full_name || 'Unknown',
          email: app.patients?.email || '',
          contact: app.patients?.contact_number || '',
          reason: app.reason,
          doctor: 'Not assigned'
        }));

        // Sort appointments by date and time (newest first)
        const sortedData = mappedData.sort((a, b) => 
          new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)
        );

        setAppointments(sortedData);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatTime = (time24h) => {
    if (!time24h) return '';
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${suffix}`;
  };

  const addToCalendar = (appointment) => {
    const startTime = new Date(`${appointment.date}T${appointment.time}`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${format(startTime, "yyyyMMdd'T'HHmmss")}`,
      `DTEND:${format(endTime, "yyyyMMdd'T'HHmmss")}`,
      `SUMMARY:Medical Appointment - ${appointment.reason}`,
      `DESCRIPTION:Patient: ${appointment.patientName}\\nReason: ${appointment.reason}`,
      'LOCATION:Medical Imaging Center',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Appointment_${appointment.date}_${formatTime(appointment.time).replace(/:/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addAppointment = (newAppointment) => {
    const time24h = convertTo24Hour(newAppointment.time);
    const mappedAppointment = {
      id: Date.now(),
      date: newAppointment.date,
      time: time24h,
      status: "pending",
      patientName: newAppointment.fullName,
      reason: newAppointment.reasonForScan,
      email: newAppointment.email,
      contact: newAppointment.contactNumber,
      doctor: 'Not assigned'
    };
    
    // Add new appointment and maintain sort order
    setAppointments(prev => 
      [...prev, mappedAppointment].sort((a, b) => 
        new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)
      )
    );
    addToCalendar(mappedAppointment);
  };

  const cancelAppointment = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/appointement/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'canceled' })
      });

      if (!response.ok) throw new Error('Failed to cancel');

      setAppointments(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status: "canceled" } : app
        ).sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
      );
      closeModal();
    } catch (err) {
      console.error('Cancel error:', err);
      alert('Failed to cancel appointment');
    }
  };

  const confirmReschedule = async () => {
    try {
      const time24h = convertTo24Hour(modalState.newTime);
      const selectedDateTime = new Date(
        `${modalState.newDate.getFullYear()}-${String(modalState.newDate.getMonth() + 1).padStart(2, '0')}-${String(modalState.newDate.getDate()).padStart(2, '0')}T${time24h}`
      );
      
      
      if (selectedDateTime < new Date()) {
        alert("Cannot reschedule to a past date/time");
        return;
      }
  
      const response = await fetch(`http://localhost:3000/api/appointement/${modalState.appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: modalState.newDate.toISOString().split('T')[0],
          time: time24h,
          status: 'pending' // Add status update to the API call
        })
      });
  
      if (!response.ok) throw new Error('Failed to reschedule');
  
      setAppointments(prev => prev.map(app => 
        app.id === modalState.appointmentId ? {
          ...app,
          date: modalState.newDate.toISOString().split('T')[0],
          time: time24h,
          status: "pending" // Update local state to pending
        } : app
      ).sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
      );
      closeModal();
    } catch (err) {
      console.error('Reschedule error:', err);
      alert('Failed to reschedule appointment');
    }
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') hours = '00';
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    
    // Convert to string and pad with leading zero
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };

  const openModal = (type, id, currentDate = "", currentTime = "") => {
    setModalState({
      show: true,
      type,
      appointmentId: id,
      newDate: currentDate ? new Date(currentDate) : new Date(),
      newTime: currentTime ? formatTime(currentTime) : "",
    });
  };

  const closeModal = () => {
    setModalState({
      show: false,
      type: "",
      appointmentId: null,
      newDate: new Date(),
      newTime: "",
    });
  };

  const isPastAppointment = (appointmentDate, appointmentTime) => {
    const now = new Date();
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    return appointmentDateTime < now;
  };

  const getAppointmentStatus = (appointment) => {
    if (appointment.status === 'canceled') return 'Canceled';
    if (isPastAppointment(appointment.date, appointment.time)) return 'Passed';
    return appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1);
  };

  const getStatusStyles = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed': return "bg-green-100 text-green-600";
      case 'pending': return "bg-yellow-100 text-yellow-600";
      case 'canceled': return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading appointments: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 relative">
      {modalState.show && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg shadow-xl border border-gray-200 animate-fade-in ${
            modalState.type === "reschedule" ? "w-full max-w-2xl" : "w-full max-w-md"
          }`}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {modalState.type === "reschedule" 
                  ? "Reschedule Appointment" 
                  : "Confirm Cancellation"}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {modalState.type === "reschedule" ? (
                <div className="space-y-4">
                  <div className="w-full">
                    <CalendarComponent
                      selectedDate={modalState.newDate}
                      onDateChange={(date) => setModalState(prev => ({ ...prev, newDate: date }))}
                      selectedTimeSlot={modalState.newTime}
                      onTimeSlotChange={(time) => setModalState(prev => ({ ...prev, newTime: time }))}
                      availableTimeSlots={availableTimeSlots}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmReschedule}
                      disabled={!modalState.newTime}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        modalState.newTime
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Confirm Reschedule
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Are you sure you want to cancel this appointment? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={() => cancelAppointment(modalState.appointmentId)}
                      className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                      Confirm Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <UpcomingAppointmentCard 
        appointments={appointments.filter(a => a.status === "confirmed")} 
        onCancel={(id) => openModal("cancel", id)}
        onReschedule={(id, date, time) => openModal("reschedule", id, date, time)}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:flex-1 space-y-4">
          <h1 className="text-2xl font-bold text-[var(--text-blue-dark)]">
            Book an Appointment
          </h1>
          <p className="text-[var(--text-blue-medium)]">
            Select a date and time that works for you.
          </p>
          <BookingSection onBook={addAppointment} />
        </div>

        <div className="lg:flex-1 space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-blue-dark)]">
            Appointment History
          </h2>
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="p-4 border rounded-lg bg-white text-center text-gray-500">
                No appointments found
              </div>
            ) : (
              appointments.map((appointment) => {
                const status = getAppointmentStatus(appointment);
                const isPast = isPastAppointment(appointment.date, appointment.time);
                
                return (
                  <div 
                    key={appointment.id} 
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-[var(--text-blue-medium)]" />
                        <p className="text-[var(--text-blue-dark)]">
                          {new Date(appointment.date).toLocaleDateString()} |{" "}
                          <ClockIcon className="w-5 h-5 text-[var(--text-blue-medium)] inline-block mr-1" />
                          {formatTime(appointment.time)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusStyles(appointment.status)}`}>
                          {status === "Confirmed" && <CheckCircleIcon className="w-4 h-4" />}
                          {status === "Pending" && <PauseCircleIcon className="w-4 h-4" />}
                          {status === "Canceled" && <XCircleIcon className="w-4 h-4" />}
                          {status}
                        </span>
                        <div className="flex gap-2">
                          {!isPast && status !== "Canceled" && (
                            <>
                              <button
                                onClick={() => openModal("reschedule", appointment.id, appointment.date, appointment.time)}
                                className="flex items-center gap-1 text-sm text-[var(--text-blue-dark)] hover:text-[var(--pastel-blue-dark)] transition-colors"
                              >
                                <PencilSquareIcon className="w-4 h-4" />
                                Reschedule
                              </button>
                              <button
                                onClick={() => openModal("cancel", appointment.id)}
                                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                              >
                                <XMarkIcon className="w-4 h-4" />
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}