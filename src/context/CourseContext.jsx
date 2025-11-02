import { createContext, useState } from "react";

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectUser, setSelectuser] = useState("public")

  return (
    <CourseContext.Provider value={{ selectedCourse, setSelectedCourse, selectUser, setSelectuser }}>
      {children}
    </CourseContext.Provider>
  );
};
