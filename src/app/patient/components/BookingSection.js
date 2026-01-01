'use client'
import { useState } from 'react'
import CalendarComponent from './CalendarComponent'
import { format } from 'date-fns'

export default function BookingSection() {
  const [date, setDate] = useState(new Date())
  const [timeSlot, setTimeSlot] = useState('')
  const [patientInfo, setPatientInfo] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    email: '',
    address: '',
    patientId: '',
    prescription: null,
    reasonForScan: ''
  })
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookedData, setBookedData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const availableTimeSlots = [
    "09:00 AM",
    "10:30 AM",
    "12:00 PM",
    "02:00 PM",
    "03:30 PM",
    "05:00 PM",
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validate required fields
    const requiredFields = ['fullName', 'dateOfBirth', 'gender', 'contactNumber', 'email', 'reasonForScan']
    const missingFields = requiredFields.filter(field => !patientInfo[field])
    
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`)
      setIsSubmitting(false)
      return
    }

    if (!date || !timeSlot) {
      setError('Please select a date and time')
      setIsSubmitting(false)
      return
    }

    try {
      const bookingData = {
        fullName: patientInfo.fullName,
        email: patientInfo.email,
        date: date.toISOString().split('T')[0],
        time: convertTo24Hour(timeSlot),
        contactNumber: patientInfo.contactNumber,
        reasonForScan: patientInfo.reasonForScan,
        dateOfBirth: patientInfo.dateOfBirth,
        gender: patientInfo.gender,
        address: patientInfo.address,
        patientId: patientInfo.patientId
      }

      const response = await fetch('http://localhost:3000/api/appointement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Booking failed')
      }

      const result = await response.json()
      setBookedData({ 
        date: result.date, 
        time: timeSlot,
        fullName: patientInfo.fullName,
        reasonForScan: patientInfo.reasonForScan
      })
      setBookingSuccess(true)
      setPatientInfo({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        contactNumber: '',
        email: '',
        address: '',
        patientId: '',
        prescription: null,
        reasonForScan: ''
      })
    } catch (err) {
      console.error('Booking error:', err)
      setError(err.message || 'Failed to book appointment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':')
    if (hours === '12') hours = '00'
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12
    return `${hours}:${minutes}:00`
  }

  const generateCalendarLinks = (bookedData) => {
    try {
      const startTime = new Date(`${bookedData.date}T${convertTo24Hour(bookedData.time)}`)
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000) // 30 minute appointment

      // Google Calendar link
      const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Appointment for ${bookedData.fullName}`)}&dates=${format(startTime, "yyyyMMdd'T'HHmmss")}/${format(endTime, "yyyyMMdd'T'HHmmss")}&details=${encodeURIComponent(`Reason: ${bookedData.reasonForScan}`)}&location=Medical%20Imaging%20Center`

      // Outlook Calendar link
      const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&startdt=${startTime.toISOString()}&enddt=${endTime.toISOString()}&subject=${encodeURIComponent(`Medical Appointment`)}&body=${encodeURIComponent(`Patient: ${bookedData.fullName}\nReason: ${bookedData.reasonForScan}`)}&location=Medical%20Imaging%20Center`

      // ICS file download
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${format(startTime, "yyyyMMdd'T'HHmmss")}`,
        `DTEND:${format(endTime, "yyyyMMdd'T'HHmmss")}`,
        `SUMMARY:Appointment for ${bookedData.fullName}`,
        `DESCRIPTION:Reason: ${bookedData.reasonForScan}`,
        'LOCATION:Medical Imaging Center',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\n')

      const icsBlob = new Blob([icsContent], { type: 'text/calendar' })
      const icsUrl = URL.createObjectURL(icsBlob)

      return { googleUrl, outlookUrl, icsUrl }
    } catch (error) {
      console.error('Error generating calendar links:', error)
      return null
    }
  }

  const handleFileChange = (e) => {
    setPatientInfo({
      ...patientInfo,
      prescription: e.target.files[0]
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setPatientInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (bookingSuccess) {
    const calendarLinks = generateCalendarLinks(bookedData)

    return (
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mt-3">Appointment Booked Successfully!</h3>
          <p className="mt-2 text-sm text-gray-500">
            Your appointment is scheduled for {bookedData.date} at {bookedData.time}.
          </p>
        </div>

        {calendarLinks && (
          <div className="mt-6 space-y-3">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Add to Calendar:</h4>
            <a
              href={calendarLinks.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-center text-sm"
            >
              Google Calendar
            </a>
            <a
              href={calendarLinks.outlookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-center text-sm"
            >
              Outlook
            </a>
            <a
              href={calendarLinks.icsUrl}
              download="appointment.ics"
              className="block px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-center text-sm"
            >
              Download ICS File
            </a>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={() => setBookingSuccess(false)}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-medium text-[var(--text-blue-dark)] mb-4">
          Select Date & Time
        </h3>
        <CalendarComponent 
          selectedDate={date}
          onDateChange={setDate}
          selectedTimeSlot={timeSlot}
          onTimeSlotChange={setTimeSlot}
          availableTimeSlots={availableTimeSlots}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-xl font-medium text-[var(--text-blue-dark)] mb-4">
          Patient Information
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={patientInfo.fullName}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-[var(--pastel-blue-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--pastel-blue-dark)]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={patientInfo.dateOfBirth}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-[var(--pastel-blue-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--pastel-blue-dark)]"
                required
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={patientInfo.gender}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-[var(--pastel-blue-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--pastel-blue-dark)]"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                placeholder="Phone Number"
                value={patientInfo.contactNumber}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-[var(--pastel-blue-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--pastel-blue-dark)]"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                value={patientInfo.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-[var(--pastel-blue-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--pastel-blue-dark)]"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Street Address"
              value={patientInfo.address}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-[var(--pastel-blue-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--pastel-blue-dark)]"
            />
          </div>

          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
              Patient ID (if registered with the lab)
            </label>
            <input
              id="patientId"
              name="patientId"
              type="text"
              placeholder="Patient ID"
              value={patientInfo.patientId}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-[var(--pastel-blue-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--pastel-blue-dark)]"
            />
          </div>

          <div>
            <label htmlFor="prescription" className="block text-sm font-medium text-gray-700 mb-1">
              Prescription Upload (if a referral is required)
            </label>
            <input
              id="prescription"
              name="prescription"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full p-3 rounded-lg border border-[var(--pastel-blue-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--pastel-blue-dark)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--pastel-blue-light)] file:text-[var(--text-blue-dark)] hover:file:bg-[var(--pastel-blue-medium)]"
            />
            {patientInfo.prescription && (
              <p className="mt-1 text-sm text-gray-500">Selected file: {patientInfo.prescription.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="reasonForScan" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Scan / Symptoms <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reasonForScan"
              name="reasonForScan"
              placeholder="Describe your symptoms or reason for the scan"
              value={patientInfo.reasonForScan}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-[var(--pastel-blue-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--pastel-blue-dark)]"
              rows={3}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-[var(--pastel-blue-dark)] text-white p-3 rounded-lg hover:bg-[var(--pastel-blue-medium)] transition-colors ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  )
}