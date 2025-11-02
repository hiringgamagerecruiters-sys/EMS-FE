import React, { useState, useEffect } from 'react';

function WorkingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    setCurrentDate(new Date());
    setSelectedMonth(new Date().getMonth());
    setSelectedYear(new Date().getFullYear());
  }, []);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const renderCalendar = () => {
    const totalDays = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];
    const today = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<td key={`empty-${i}`} className="p-2 sm:p-4 text-center border-r border-gray-200"><span className="text-gray-400 font-medium"></span></td>);
    }

    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
      const isToday = day === today && selectedMonth === currentMonth && selectedYear === currentYear;
      const isWorkingDay = selectedMonth === 5 && selectedYear === 2025 && [].includes(day); // Example working days, adjust as needed
      days.push(
        <td key={day} className={`p-2 sm:p-4 text-center border-r border-gray-200 ${isWorkingDay ? 'bg-[#0097A7]' : ''} ${day === totalDays ? '' : 'border-b'} ${isToday ? 'bg-teal-200' : ''}`}>
          <span className={`text-xs sm:text-sm ${isWorkingDay ? 'text-black' : isToday ? 'text-black' : 'text-gray-700'} font-medium`}>{day}</span>
        </td>
      );
    }

    // Fill the rest of the grid with empty cells
    while (days.length % 7 !== 0) {
      days.push(<td key={`empty-${days.length}`} className="p-2 sm:p-4 text-center border-r border-gray-200"><span className="text-gray-400 font-medium"></span></td>);
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(<tr key={i} className="border-b border-gray-200">{days.slice(i, i + 7)}</tr>);
    }

    return weeks;
  };

  return (
    <section className="bg-white rounded-xl shadow-lg overflow-hidden mx-2 sm:mx-6 lg:mx-12 my-6">
      {/* Calendar Header */}
      <div className="bg-[#228C97] text-white px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
        <button
          onClick={handlePrevMonth}
          className="text-white text-lg sm:text-xl hover:bg-teal-600 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Previous Month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg sm:text-xl font-bold">Working Calendar</h2>
        <button
          onClick={handleNextMonth}
          className="text-white text-lg sm:text-xl hover:bg-teal-600 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Next Month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Month/Year Selector */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 flex justify-end gap-2 sm:gap-3">
        <div className="relative w-28 sm:w-32">
          <select
            className="appearance-none bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 pr-8 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <svg className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <div className="relative w-20 sm:w-24">
          <select
            className="appearance-none bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 pr-8 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {Array.from({ length: 21 }, (_, i) => 2015 + i).map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <svg className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-2 sm:p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[300px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-600 border-r border-gray-200">Sun</th>
                <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-600 border-r border-gray-200">Mon</th>
                <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-600 border-r border-gray-200">Tue</th>
                <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-600 border-r border-gray-200">Wed</th>
                <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-600 border-r border-gray-200">Thu</th>
                <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-600 border-r border-gray-200">Fri</th>
                <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-600">Sat</th>
              </tr>
            </thead>
            <tbody>{renderCalendar()}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default WorkingCalendar;