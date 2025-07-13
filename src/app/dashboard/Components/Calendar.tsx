import { ChevronLeft, ChevronRight } from "lucide-react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useRef, useState } from "react";

export function CalendarComponent() {
    // Using more specific type for the calendar reference
    const calendarRef = useRef<FullCalendar>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }));
    
    const handlePrevMonth = () => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.prev();
            updateMonthTitle(calendarApi.getDate());
        }
    };
    
    const handleNextMonth = () => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.next();
            updateMonthTitle(calendarApi.getDate());
        }
    };
    
    const updateMonthTitle = (date: Date) => {
        setCurrentMonth(date.toLocaleString('en-US', { month: 'long', year: 'numeric' }));
    };
    
    return (
  <div className="w-full md:w-[450px] rounded-xl border border-gray-200 bg-white shadow-sm">
    <div className="flex flex-row items-center justify-between p-7">
      <div>
        <h3 className="text-xl font-semibold leading-none tracking-tight text-gray-900">
          Calendar
        </h3>
        <p className="text-sm text-gray-500 mt-1">{currentMonth}</p>
      </div>
      <div className="flex items-center space-x-3 relative z-10">
        <button className="bg-gray-600 p-1.5 hover:bg-gray-800 rounded" onClick={handlePrevMonth}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button className="p-1.5 bg-gray-600 hover:bg-gray-800 rounded" onClick={handleNextMonth}>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
    <div className="p-7 pt-0">
      <div className="h-72 bg-gray-50 rounded-lg overflow-hidden">
        <div className="w-full h-full text-gray-900 relative">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            height="100%"
            dayMaxEventRows={1}
            headerToolbar={false}
            events={[
              { title: 'Math Exam', date: '2025-07-10' },
              { title: 'Science Fair', date: '2025-07-14' },
            ]}
            datesSet={(dateInfo) => {
              updateMonthTitle(dateInfo.view.currentStart);
            }}
            eventContent={(eventInfo) => {
              return (
                <div className="text-xs font-medium text-white bg-teal-600 px-1 py-0.5 rounded">
                  {eventInfo.event.title}
                </div>
              )
            }}
          />
        </div>
      </div>
    </div>
  </div>
  )
}

