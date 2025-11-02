import { createContext, useEffect, useState } from "react";

export const MainContext = createContext(null);

export const MainProvider = ({ children }) => {
  const [time, setTime] = useState("");
const [date, setDate] = useState("");
const [selectedTask, setSelectedTask] = useState([]);

useEffect(() => {
  const updateTimeAndDate = () => {
    const now = new Date();
    
    // Format time (12-hour format with AM/PM)
    const timeOptions = {
      timeZone: "Asia/Colombo",
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    setTime(now.toLocaleTimeString('en-US', timeOptions));
    
    // Format date as YYYY-MM-DD (for API payload)
    const dateOptions = {
      timeZone: "Asia/Colombo",
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    const formattedDate = now.toLocaleDateString('en-CA', dateOptions)
      .replace(/\//g, '-');
    setDate(formattedDate);
  };

  updateTimeAndDate();
  const interval = setInterval(updateTimeAndDate, 1000);
  return () => clearInterval(interval);
}, []);

const selectTask = (task) => {
    setSelectedTask(task);
    console.log("Selected task:", task); // Now logging the actual task object
  };

  return (
    <MainContext.Provider value={{ date, time, selectedTask, selectTask  }}>
      {children}
    </MainContext.Provider>
  );
};
