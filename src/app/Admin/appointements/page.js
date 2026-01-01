'use client'
import { useState, useEffect } from 'react'
import CalendarHeader from '../Components/CalendarHeader'
import CalendarView from '../Components/CalendarView'
import ListView from '../Components/ListView'
import CalendarFilters from '../Components/CalendarFilters'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentTimePos, setCurrentTimePos] = useState(0)
  const [viewMode, setViewMode] = useState('calendar')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState([])
  const [showHighPriority, setShowHighPriority] = useState(false)
  const [dateRange, setDateRange] = useState({ start: null, end: null })
  const [showFilters, setShowFilters] = useState(false)
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/appointement')
        if (!response.ok) throw new Error('Failed to fetch appointments')
        
        const data = await response.json()
        const now = new Date()

        const mappedEvents = data.map(appointment => {
          const start = new Date(`${appointment.date}T${appointment.time}`)
          const isPast = start < now
          const status = isPast && appointment.status !== 'canceled' 
            ? 'passed' 
            : appointment.status

          return {
            id: appointment.id,
            patient: `${appointment.patients?.full_name || 'Unknown'} (${appointment.reason})`,
            email: appointment.patients?.email || '',
            type: appointment.priority === 'high' ? 'premium' : 'regular',
            status: status,
            priority: appointment.priority,
            start: start,
            end: new Date(start.getTime() + 30 * 60000),
            contact: appointment.patients?.contact_number || '',
            reason: appointment.reason,
            doctor: 'Not assigned', 
            originalDate: appointment.date,
            originalTime: appointment.time
          }
        })

        // Sort appointments from most recent to oldest
        const sortedEvents = mappedEvents.sort((a, b) => b.start - a.start)
        setEvents(sortedEvents)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const updateEventStatus = async (eventId, newStatus) => {
    try {
      const event = events.find(e => e.id === eventId)
      
      // Prevent modifying passed appointments
      if (event.status === 'passed') {
        alert('Cannot modify passed appointments')
        return
      }

      const response = await fetch(`http://localhost:3000/api/appointement/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (!response.ok) throw new Error('Failed to update status')
      
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId ? { ...event, status: newStatus } : event
        ).sort((a, b) => b.start - a.start)
      )
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const filteredEvents = events.filter(event => {
    const isPassed = event.status === 'passed'
    
    // Calendar view filtering
    const calendarWeekFilter = () => {
      if (isPassed) return true
      const weekStart = new Date(selectedDate)
      weekStart.setDate(selectedDate.getDate() - selectedDate.getDay())
      weekStart.setHours(0, 0, 0, 0)
  
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 7)
  
      return event.start >= weekStart && event.start < weekEnd
    }
  
    const isInCorrectView = viewMode === 'calendar' ? calendarWeekFilter() : true
    
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(event.status)
    const matchesSearch = searchTerm === '' || 
      event.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.id.toString().includes(searchTerm)
    const matchesPriority = !showHighPriority || event.priority === 'high'
    const matchesDateRange = !dateRange.start || !dateRange.end || 
      (event.start >= dateRange.start && event.start <= dateRange.end)

    return isInCorrectView && matchesStatus && matchesSearch && matchesPriority && matchesDateRange
  })

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date()
      if (now.toDateString() === selectedDate.toDateString()) {
        const minutes = now.getHours() * 60 + now.getMinutes()
        setCurrentTimePos((minutes / 60 - 9) * 120)
      }
    }
    updateCurrentTime()
    const interval = setInterval(updateCurrentTime, 60000)
    return () => clearInterval(interval)
  }, [selectedDate])

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() - 7)
    setSelectedDate(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + 7)
    setSelectedDate(newDate)
  }

  const toggleStatusFilter = (status) => {
    setStatusFilter(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter([])
    setShowHighPriority(false)
    setDateRange({ start: null, end: null })
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <CalendarHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={[statusFilter.length, showHighPriority ? 1 : 0, dateRange.start ? 1 : 0, dateRange.end ? 1 : 0].reduce((a, b) => a + b, 0)}
        setShowFilters={setShowFilters}
      />

      {showFilters && (
        <CalendarFilters
          statusFilter={statusFilter}
          showHighPriority={showHighPriority}
          dateRange={dateRange}
          toggleStatusFilter={toggleStatusFilter}
          setShowHighPriority={setShowHighPriority}
          setDateRange={setDateRange}
          clearFilters={clearFilters}
          closeFilters={() => setShowFilters(false)}
        />
      )}

      {viewMode === 'calendar' ? (
        <CalendarView
          selectedDate={selectedDate}
          handlePreviousWeek={handlePreviousWeek}
          handleNextWeek={handleNextWeek}
          filteredEvents={filteredEvents}
          currentTimePos={currentTimePos}
          setSelectedDate={setSelectedDate}
          updateEventStatus={updateEventStatus}
        />
      ) : (
        <ListView 
          filteredEvents={filteredEvents}
          updateEventStatus={updateEventStatus}
        />
      )}
    </div>
  )
}