import React, { useState } from "react";
import axios from "axios";
// Assuming you might want to use editYearLogic for some reason here,
// but since it's primarily for adding a year, we'll stick to the original functionality

const CourseYear = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const courseId = "courseId"; // This should be dynamically set

  const addYear = async () => {
    try {
      const response = await axios.post("/api/course/addYear", {
        year,
        courseId,
      });
      console.log(response.data);
      // Handle success (e.g., show a message, redirect, etc.)
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div>
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(parseInt(e.target.value))}
      />
      <button onClick={addYear}>Add Year</button>
    </div>
  );
};

export default CourseYear;
