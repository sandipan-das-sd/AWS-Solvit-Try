import axios from "axios";

interface IEditYearData {
  courseId: string;
  year: number;
}

export const editYear = async ({ courseId, year }: IEditYearData) => {
  try {
    const response = await axios.patch(`/api/courses/${courseId}/years`, {
      year,
    });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};
