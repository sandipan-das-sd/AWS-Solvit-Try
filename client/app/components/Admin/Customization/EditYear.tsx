import React, { useState } from "react";
import { updateCourseYear } from "@/redux/features/CourseYears/editYearLogic";
import { toast } from "react-hot-toast";
import { styles } from "@/app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";

const EditYear = () => {
  const [years, setYears] = useState([{ id: Date.now(), year: "" }]);
  const courseId = "courseId"; // This should be dynamically set

  const updateYear = async (yearId: number, yearValue: string) => {
    if (!yearValue) {
      toast.error("Year is required");
      return;
    }
    try {
      await updateCourseYear({ courseId, year: parseInt(yearValue, 10) });
      toast.success("Year updated successfully");
    } catch (error) {
      toast.error("Error updating year");
    }
  };

  const addNewYear = () => {
    setYears([...years, { id: Date.now(), year: "" }]);
  };

  const deleteYear = (yearId: number) => {
    setYears(years.filter((year) => year.id !== yearId));
  };

  return (
    <div className="mt-[120px] text-center">
      <h1 className={`${styles.title}`}>Add Year</h1>
      {years.map((yearObj, index) => (
        <div className="p-3 flex items-center justify-center" key={yearObj.id}>
          <input
            className={`${styles.input} !w-[unset] !border-none !text-[20px]`}
            type="text"
            value={yearObj.year}
            onChange={(e) => {
              const newYears = [...years];
              newYears[index].year = e.target.value;
              setYears(newYears);
            }}
            placeholder="Enter year"
          />
          <AiOutlineDelete
            className="dark:text-white text-black text-[18px] cursor-pointer"
            onClick={() => deleteYear(yearObj.id)}
          />
        </div>
      ))}
      <div className="w-full flex justify-center">
        <IoMdAddCircleOutline
          className="dark:text-white text-black text-[25px] cursor-pointer"
          onClick={addNewYear}
        />
      </div>
      <div
        className={`${styles.button} !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#42d383] !cursor-pointer !rounded absolute bottom-12 right-12`}
        onClick={() =>
          years.forEach((yearObj) => updateYear(yearObj.id, yearObj.year))
        }
      >
        Save
      </div>
    </div>
  );
};

export default EditYear;
