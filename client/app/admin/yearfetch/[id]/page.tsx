


"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button, Modal, TextField } from "@mui/material";
import { toast } from "react-hot-toast";
import { useGetYearToCourseQuery, useEditYearToCourseMutation, useDeleteYearToCourseMutation, useAddSubjectToYearMutation } from "@/redux/features/courses/coursesApi";

const ViewCourseYears = () => {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const courseId = params?.id;

    // Skip query if courseId is null
    const { data: yearData, isLoading: isYearLoading, error: yearError } = useGetYearToCourseQuery(
        { courseId: courseId || "" },
        { skip: !courseId }
    );

    // Set up mutations
    const [editYear] = useEditYearToCourseMutation();
    const [deleteYear] = useDeleteYearToCourseMutation();
    const [addSubjectToYear] = useAddSubjectToYearMutation();

    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openAddSubject, setOpenAddSubject] = useState(false);
    const [selectedYear, setSelectedYear] = useState<{ _id: string, year: number } | null>(null);
    const [yearValue, setYearValue] = useState("");
    const [subjectName, setSubjectName] = useState("");

    const handleEditYear = async () => {
        if (selectedYear && courseId) {
            try {
                await editYear({ courseId, yearId: selectedYear._id, year: yearValue }).unwrap();
                toast.success("Year updated successfully");
                setOpenEdit(false);
                window.location.reload();
            } catch (err) {
                toast.error("Failed to update year");
            }
        }
    };

    const handleDeleteYear = async () => {
        if (selectedYear && courseId) {
            try {
                await deleteYear({ courseId, yearId: selectedYear._id }).unwrap();
                toast.success("Year deleted successfully");
                setOpenDelete(false);
                window.location.reload();
            } catch (err) {
                toast.error("Failed to delete year");
            }
        }
    };

    const handleAddSubject = async () => {
        if (selectedYear && subjectName && courseId) {
            try {
                await addSubjectToYear({ courseId, yearId: selectedYear._id, name: subjectName }).unwrap();
                toast.success("Subject added successfully");
                setOpenAddSubject(false);
                setSubjectName(""); // Clear input after successful addition
            } catch (err) {
                toast.error("Failed to add subject");
            }
        }
    };

    const handleViewSubjects = (yearId: string) => {
        if (courseId) {
            // router.push(`/admin/subjectfetch/${courseId}?yearId=${yearId}`);
            router.push(`/admin/subjectfetch/${courseId}?yearId=${yearId}`);

        }
    };

    if (isYearLoading) return <CircularProgress />;
    if (yearError) return <Typography>Error loading years</Typography>;

    return (
        <Box m="20px">
            <Typography variant="h4" mb="20px">Years for Course {courseId}</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Year</TableCell>
                        <TableCell>Edit</TableCell>
                        <TableCell>Delete</TableCell>
                        <TableCell>Add Subject</TableCell>
                        <TableCell>View Subjects</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {yearData?.years.map((year: { _id: string, year: number }) => (
                        <TableRow key={year._id}>
                            <TableCell>{year._id}</TableCell>
                            <TableCell>{year.year}</TableCell>
                            <TableCell>
                                <Button onClick={() => {
                                    setSelectedYear(year);
                                    setYearValue(year.year.toString());
                                    setOpenEdit(true);
                                }}>Edit</Button>
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => {
                                    setSelectedYear(year);
                                    setOpenDelete(true);
                                }}>Delete</Button>
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => {
                                    setSelectedYear(year);
                                    setOpenAddSubject(true);
                                }}>Add Subject</Button>
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => handleViewSubjects(year._id)}>View Subjects</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Edit Year Modal */}
            <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
                <Box p={4} bgcolor="white" m="auto" mt="20vh" maxWidth="400px">
                    <Typography variant="h6">Edit Year</Typography>
                    <TextField
                        fullWidth
                        label="Year"
                        value={yearValue}
                        onChange={(e) => setYearValue(e.target.value)}
                        margin="normal"
                    />
                    <Button onClick={handleEditYear}>Save</Button>
                </Box>
            </Modal>

            {/* Delete Year Modal */}
            <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
                <Box p={4} bgcolor="white" m="auto" mt="20vh" maxWidth="400px">
                    <Typography variant="h6">Delete Year</Typography>
                    <Typography>Are you sure you want to delete this year?</Typography>
                    <Button onClick={handleDeleteYear}>Delete</Button>
                </Box>
            </Modal>

            {/* Add Subject Modal */}
            <Modal open={openAddSubject} onClose={() => setOpenAddSubject(false)}>
                <Box p={4} bgcolor="white" m="auto" mt="20vh" maxWidth="400px">
                    <Typography variant="h6">Add Subject</Typography>
                    <TextField
                        fullWidth
                        label="Subject Name"
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                        margin="normal"
                    />
                    <Button onClick={handleAddSubject}>Add</Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default ViewCourseYears;
