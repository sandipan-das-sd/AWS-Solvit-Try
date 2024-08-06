

// "use client";
// import React, { useState, useEffect } from "react";
// import { Box, CircularProgress, Typography, MenuItem, Select, InputLabel, FormControl, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
// import { useGetAllCoursesQuery, useGetSubjectsToYearQuery, useEditSubjectMutation, useDeleteSubjectMutation } from "@/redux/features/courses/coursesApi";
// import { useRouter } from 'next/navigation';
// const ViewSubjects = () => {
//     const [selectedCourse, setSelectedCourse] = useState<string | undefined>(undefined);
//     const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);
//     const [openEditSubjectDialog, setOpenEditSubjectDialog] = useState(false);
//     const [subjectToEdit, setSubjectToEdit] = useState<{ _id: string, name: string } | null>(null);
//     const [newSubjectName, setNewSubjectName] = useState<string>("");

//     const { data: coursesData, isLoading: isCoursesLoading, error: coursesError } = useGetAllCoursesQuery();
//     const { data: subjectsData, isLoading: isSubjectsLoading, error: subjectsError, refetch: refetchSubjects } = useGetSubjectsToYearQuery(
//         { courseId: selectedCourse || "", yearId: selectedYear || "" },
//         { skip: !selectedCourse || !selectedYear }
//     );
//     const [editSubject] = useEditSubjectMutation();
//     const [deleteSubject] = useDeleteSubjectMutation();

//     const selectedCourseData = coursesData?.courses.find((course: { _id: string }) => course._id === selectedCourse);
//     const router = useRouter();

//     const handleAddQuestion = (subjectId: string) => {
//         if (selectedCourse && selectedYear) {
//             router.push(`/add-question/${selectedCourse}/${selectedYear}/${subjectId}`);
//         }
//     };
//     const handleEditSubject = async () => {
//         if (selectedCourse && selectedYear && subjectToEdit) {
//             try {
//                 await editSubject({
//                     courseId: selectedCourse,
//                     yearId: selectedYear,
//                     subjectId: subjectToEdit._id,
//                     name: newSubjectName
//                 });
//                 alert(`${newSubjectName} edited successfully`);
//                 setOpenEditSubjectDialog(false);
//                 refetchSubjects();
//             } catch (error) {
//                 alert("Error editing subject");
//                 console.log(error);
//             }
//         }
//     };

//     const handleDeleteSubject = async (subjectId: string) => {
//         if (selectedCourse && selectedYear) {
//             try {
//                 await deleteSubject({
//                     courseId: selectedCourse,
//                     yearId: selectedYear,
//                     subjectId: subjectId
//                 });
//                 alert("Subject deleted successfully");
//                 refetchSubjects();
//             } catch (error) {
//                 alert("Error deleting subject");
//                 console.log(error)
//             }
//         }
//     };

//     const handleYearChange = (yearId: string) => {
//         setSelectedYear(yearId);
//     };

//     if (isCoursesLoading) return <CircularProgress />;
//     if (coursesError) return <Typography>Error loading courses</Typography>;

//     return (
//         <Box m="20px">
//             <Typography variant="h4" mb="20px">View Subjects</Typography>
//             <button className=" btn border-t-indigo-400"> Add Question</button>
//             <FormControl fullWidth margin="normal">
//                 <InputLabel>Course</InputLabel>
//                 <Select
//                     value={selectedCourse || ""}
//                     onChange={(e) => setSelectedCourse(e.target.value as string)}
//                     label="Course"
//                 >
//                     {coursesData?.courses?.map((course: { _id: string, name: string }) => (
//                         <MenuItem key={course._id} value={course._id}>{course.name}</MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>

//             {selectedCourse && (
//                 <FormControl fullWidth margin="normal">
//                     <InputLabel>Year</InputLabel>
//                     <Select
//                         value={selectedYear || ""}
//                         onChange={(e) => handleYearChange(e.target.value as string)}
//                         label="Year"
//                     >
//                         {selectedCourseData?.years?.map((year: { _id: string, year: string }) => (
//                             <MenuItem key={year._id} value={year._id}>{year.year}</MenuItem>
//                         )) || <MenuItem value="">No years available</MenuItem>}
//                     </Select>
//                 </FormControl>
//             )}

//             {selectedYear && (
//                 <Box mt="20px">
//                     <Typography variant="h6">Subjects:</Typography>
//                     {isSubjectsLoading ? (
//                         <CircularProgress />
//                     ) : subjectsError ? (
//                         <Typography>Error loading subjects</Typography>
//                     ) : (
//                         <ul>
//                             {subjectsData?.subjects.map((subject: { _id: string, name: string }) => (
//                                 <li key={subject._id}>
//                                     {subject.name}
//                                     <Button onClick={() => {
//                                         setSubjectToEdit(subject);
//                                         setNewSubjectName(subject.name);
//                                         setOpenEditSubjectDialog(true);
//                                     }}>
//                                         Edit
//                                     </Button>
//                                     <Button onClick={() => handleDeleteSubject(subject._id)}>
//                                         Delete
//                                     </Button>
//                                     <Button onClick={() => handleAddQuestion(subject._id)}>
//                                         Add Question
//                                     </Button>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </Box>
//             )}

//             <Dialog open={openEditSubjectDialog} onClose={() => setOpenEditSubjectDialog(false)}>
//                 <DialogTitle>Edit Subject</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         fullWidth
//                         value={newSubjectName}
//                         onChange={(e) => setNewSubjectName(e.target.value)}
//                         label="Subject Name"
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenEditSubjectDialog(false)}>Cancel</Button>
//                     <Button onClick={handleEditSubject}>Save</Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>

//     );
// };

// export default ViewSubjects;
"use client";
import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, MenuItem, Select, InputLabel, FormControl, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useGetAllCoursesQuery, useGetSubjectsToYearQuery, useEditSubjectMutation, useDeleteSubjectMutation } from "@/redux/features/courses/coursesApi";
import { useRouter } from 'next/navigation';

const ViewSubjects = () => {
    const [selectedCourse, setSelectedCourse] = useState<string | undefined>(undefined);
    const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);
    const [openEditSubjectDialog, setOpenEditSubjectDialog] = useState(false);
    const [subjectToEdit, setSubjectToEdit] = useState<{ _id: string, name: string } | null>(null);
    const [newSubjectName, setNewSubjectName] = useState<string>("");

    // Pass an empty string or other appropriate argument if needed
    const { data: coursesData, isLoading: isCoursesLoading, error: coursesError } = useGetAllCoursesQuery('');
    const { data: subjectsData, isLoading: isSubjectsLoading, error: subjectsError, refetch: refetchSubjects } = useGetSubjectsToYearQuery(
        { courseId: selectedCourse || "", yearId: selectedYear || "" },
        { skip: !selectedCourse || !selectedYear }
    );
    const [editSubject] = useEditSubjectMutation();
    const [deleteSubject] = useDeleteSubjectMutation();

    const selectedCourseData = coursesData?.courses.find((course: { _id: string }) => course._id === selectedCourse);
    const router = useRouter();

    useEffect(() => {
        if (selectedCourse && selectedYear) {
            refetchSubjects();
        }
    }, [selectedCourse, selectedYear, refetchSubjects]);

    const handleAddQuestion = (subjectId: string) => {
        if (selectedCourse && selectedYear) {
            router.push(`/add-question/${selectedCourse}/${selectedYear}/${subjectId}`);
        }
    };

    const handleEditSubject = async () => {
        if (selectedCourse && selectedYear && subjectToEdit) {
            try {
                await editSubject({
                    courseId: selectedCourse,
                    yearId: selectedYear,
                    subjectId: subjectToEdit._id,
                    name: newSubjectName
                });
                alert(`${newSubjectName} edited successfully`);
                setOpenEditSubjectDialog(false);
                refetchSubjects();
            } catch (error) {
                alert("Error editing subject");
                console.log(error);
            }
        }
    };

    const handleDeleteSubject = async (subjectId: string) => {
        if (selectedCourse && selectedYear) {
            try {
                await deleteSubject({
                    courseId: selectedCourse,
                    yearId: selectedYear,
                    subjectId: subjectId
                });
                alert("Subject deleted successfully");
                refetchSubjects();
            } catch (error) {
                alert("Error deleting subject");
                console.log(error);
            }
        }
    };

    const handleYearChange = (yearId: string) => {
        setSelectedYear(yearId);
    };

    if (isCoursesLoading) return <CircularProgress />;
    if (coursesError) return <Typography>Error loading courses</Typography>;

    return (
        <Box m="20px">
            <Typography variant="h4" mb="20px">View Subjects</Typography>
            <Button variant="contained" color="primary" onClick={() => {
                if (selectedCourse && selectedYear) {
                    router.push(`/add-question/${selectedCourse}/${selectedYear}`);
                }
            }}>
                Add Question
            </Button>

            <FormControl fullWidth margin="normal">
                <InputLabel>Course</InputLabel>
                <Select
                    value={selectedCourse || ""}
                    onChange={(e) => setSelectedCourse(e.target.value as string)}
                    label="Course"
                >
                    {coursesData?.courses?.map((course: { _id: string, name: string }) => (
                        <MenuItem key={course._id} value={course._id}>{course.name}</MenuItem>
                    )) || <MenuItem value="">No courses available</MenuItem>}
                </Select>
            </FormControl>

            {selectedCourse && (
                <FormControl fullWidth margin="normal">
                    <InputLabel>Year</InputLabel>
                    <Select
                        value={selectedYear || ""}
                        onChange={(e) => handleYearChange(e.target.value as string)}
                        label="Year"
                    >
                        {selectedCourseData?.years?.map((year: { _id: string, year: string }) => (
                            <MenuItem key={year._id} value={year._id}>{year.year}</MenuItem>
                        )) || <MenuItem value="">No years available</MenuItem>}
                    </Select>
                </FormControl>
            )}

            {selectedYear && (
                <Box mt="20px">
                    <Typography variant="h6">Subjects:</Typography>
                    {isSubjectsLoading ? (
                        <CircularProgress />
                    ) : subjectsError ? (
                        <Typography>Error loading subjects</Typography>
                    ) : (
                        <ul>
                            {subjectsData?.subjects.map((subject: { _id: string, name: string }) => (
                                <li key={subject._id}>
                                    {subject.name}
                                    <Button onClick={() => {
                                        setSubjectToEdit(subject);
                                        setNewSubjectName(subject.name);
                                        setOpenEditSubjectDialog(true);
                                    }}>
                                        Edit
                                    </Button>
                                    <Button onClick={() => handleDeleteSubject(subject._id)}>
                                        Delete
                                    </Button>
                                    <Button onClick={() => handleAddQuestion(subject._id)}>
                                        Add Question
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </Box>
            )}

            <Dialog open={openEditSubjectDialog} onClose={() => setOpenEditSubjectDialog(false)}>
                <DialogTitle>Edit Subject</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        label="Subject Name"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditSubjectDialog(false)}>Cancel</Button>
                    <Button onClick={handleEditSubject}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ViewSubjects;
