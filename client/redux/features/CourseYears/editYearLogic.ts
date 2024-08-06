import { editYear } from "./editYearApi";

interface IEditYear {
  courseId: string;
  year: number;
}

export const updateCourseYear = async ({ courseId, year }: IEditYear) => {
  try {
    const data = await editYear({ courseId, year });
    console.log("Year updated successfully:", data);
    // Update UI or state as needed
  } catch (error) {
    console.error("Error updating year:", error);
    // Handle error (e.g., display error message)
  }
};
