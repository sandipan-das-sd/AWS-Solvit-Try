

import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal, TextField } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi";

import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
  useAddYearToCourseMutation,
} from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";
import Link from "next/link";

import { useRouter } from "next/navigation";
type Props = {};

const AllCourses = (props: Props) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [openDelete, setOpenDelete] = useState(false);
  const [openAddYear, setOpenAddYear] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [year, setYear] = useState("");
  const { isLoading, data, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteCourse, { isSuccess, error }] = useDeleteCourseMutation({});
  const [addYearToCourse, { isSuccess: isYearAdded, error: yearAddError }] =
    useAddYearToCourseMutation({});

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Subject Title", flex: 1 },
    { field: "exam", headerName: "Exam Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },
    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "addYear",
      headerName: "Add Year",
      flex: 0.5,
      renderCell: (params: any) => (
        <Button
          onClick={() => {
            setOpenAddYear(true);
            setCourseId(params.row.id);
          }}
        >
          Add Year
        </Button>
      ),
    },
    {
      field: "year",
      headerName: "View Year",
      flex: 0.5,
      renderCell: (params: any) => (
        <Button
          onClick={() => {

            router.push(`/admin/yearfetch/${params.row.id}`); // Use router.push
            console.log("Course ID for View Year:", params.row.id);
          }}
        >
          View Year
        </Button>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params: any) => (
        <Link href={`/admin/edit-course/${params.row.id}`}>
          <FiEdit2 className="dark:text-white text-black" size={20} />
        </Link>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => (
        <Button
          onClick={() => {
            setOpenDelete(true);
            setCourseId(params.row.id);
          }}
        >
          <AiOutlineDelete className="dark:text-white text-black" size={20} />
        </Button>
      ),
    },
  ];

  const rows = data
    ? data.courses.map((item: any) => ({
      id: item._id,
      title: item.name,
      exam: item.tags,
      ratings: item.ratings,
      purchased: item.purchased,
      created_at: format(item.createdAt),
      addYear: item.year,
      year: item.years.map((year: any) => year.year).join(", "),
    }))
    : [];

  useEffect(() => {
    if (isSuccess) {
      setOpenDelete(false);
      refetch();
      toast.success("Course Deleted Successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error, refetch]);

  useEffect(() => {
    if (isYearAdded) {
      setOpenAddYear(false);
      refetch();
      toast.success("Year Added Successfully");

    }
    if (yearAddError) {
      if ("data" in yearAddError) {
        const errorMessage = yearAddError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isYearAdded, yearAddError, refetch]);

  const handleDelete = async () => {
    await deleteCourse(courseId);
  };

  const handleAddYear = async () => {
    await addYearToCourse({ courseId, year });
  };

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom:
                  theme === "dark"
                    ? "1px solid #ffffff30!important"
                    : "1px solid #ccc!important",
              },
              "& .MuiTablePagination-root": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none!important",
              },
              "& .name-column--cell": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                borderBottom: "none",
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1B2537" : "#F2F0F0",
              },
              "& .MuiDataGrid-footerContainer": {
                color: theme === "dark" ? "#fff" : "#000",
                borderTop: "none",
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
              },
              "& .MuiCheckbox-root": {
                color: theme === "dark" ? `#b7ebde !important` : `#000 !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `#fff !important`,
              },
            }}
          >
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>
          {openDelete && (
            <Modal
              open={openDelete}
              onClose={() => setOpenDelete(!openDelete)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this course?
                </h1>
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#47d097]`}
                    onClick={() => setOpenDelete(!openDelete)}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#d63f3f]`}
                    onClick={handleDelete}
                  >
                    Delete
                  </div>
                </div>
              </Box>
            </Modal>
          )}
          {openAddYear && (
            <Modal
              open={openAddYear}
              onClose={() => setOpenAddYear(!openAddYear)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>Add Year to Course</h1>
                <TextField
                  label="Year"
                  variant="outlined"
                  fullWidth
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="mt-4"
                />
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <Button
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#47d097]`}
                    onClick={() => setOpenAddYear(!openAddYear)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#3e4396]`}
                    onClick={handleAddYear}
                  >
                    Add Year
                  </Button>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllCourses;




