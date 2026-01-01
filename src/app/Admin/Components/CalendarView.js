'use client'
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import AppointmentCard from './AppointmentCard';

export default function CalendarView({
  selectedDate,
  handlePreviousWeek,
  handleNextWeek,
  filteredEvents,
  currentTimePos,
  setSelectedDate,
  updateEventStatus
}) {
  const generateWeekDays = (date) => {
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - date.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      return day;
    });
  };

  const calculateEventPositions = (events) => {
    const timeGroups = {};
    
    events.forEach(event => {
      const startTime = event.start.getTime();
      if (!timeGroups[startTime]) {
        timeGroups[startTime] = [];
      }
      timeGroups[startTime].push(event);
    });
    
    const positionedEvents = [];
    const CARD_WIDTH = 260;
    const CARD_GAP = 10;
    
    Object.values(timeGroups).forEach(group => {
      group.forEach((event, index) => {
        const startMinutes = event.start.getHours() * 60 + event.start.getMinutes();
        
        positionedEvents.push({
          ...event,
          position: {
            top: (startMinutes / 60 - 9) * 120,
            height: '120px',
            left: 10 + (index * (CARD_WIDTH + CARD_GAP)),
            width: CARD_WIDTH
          }
        });
      });
    });
    
    return positionedEvents;
  };

  const dayEvents = filteredEvents.filter(event => 
    event.start.toDateString() === selectedDate.toDateString()
  );

  const maxEventsAtSameTime = Math.max(
    ...Object.values(
      dayEvents.reduce((groups, event) => {
        const time = event.start.getTime();
        groups[time] = (groups[time] || 0) + 1;
        return groups;
      }, {})
    ),
    0
  );

  const containerWidth = 10 + (maxEventsAtSameTime * (260 + 10));

  return (
    <>
      <div className="flex items-center mb-6 justify-center">
        <button
          onClick={handlePreviousWeek}
          className="p-2 hover:bg-gray-200 rounded-lg text-[var(--text-blue-medium)] mr-2"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-[var(--text-blue-dark)]">
            {selectedDate.toLocaleDateString('en-US', { month: 'long' })}
          </span>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {generateWeekDays(selectedDate).map((date, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center px-3 py-1 rounded-lg min-w-[80px] transition-colors border-2 ${
                  date.toDateString() === selectedDate.toDateString()
                    ? 'bg-[var(--pastel-blue-dark)] text-white border-transparent'
                    : `bg-white hover:bg-gray-100 ${
                        date.toDateString() === new Date().toDateString()
                          ? 'border-[var(--pastel-blue-medium)]'
                          : 'border-transparent'
                      }`
                }`}
              >
                <span className="text-xs font-medium">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="text-base font-semibold">
                  {date.getDate()}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleNextWeek}
          className="p-2 hover:bg-gray-200 rounded-lg text-[var(--text-blue-medium)] ml-2"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden bg-white rounded-xl shadow-sm border border-[var(--pastel-blue-medium)]">
        <div className="w-24 flex flex-col items-end pr-4 border-r border-[var(--pastel-blue-medium)] py-4">
          {['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'].map(time => (
            <div 
              key={time} 
              className="h-[120px] flex items-center gap-1 text-sm text-[var(--text-blue-medium)] pl-4"
            >
              <ClockIcon className="w-4 h-4 text-[var(--text-blue-dark)]" />
              {time}
            </div>
          ))}
        </div>

        <div className="flex-1 relative overflow-x-auto overflow-y-hidden">
          {selectedDate.toDateString() === new Date().toDateString() && (
            <div
              className="absolute left-0 right-0 h-px bg-red-500 z-50"
              style={{ top: `${currentTimePos}px` }}
            >
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-red-500 rounded-full" />
            </div>
          )}

          <div className="h-full" style={{ minWidth: `${containerWidth}px` }}>
            {calculateEventPositions(dayEvents).map(event => (
              <AppointmentCard 
                key={event.id} 
                event={event}
                updateEventStatus={updateEventStatus}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}