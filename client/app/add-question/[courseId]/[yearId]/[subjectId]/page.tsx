// "use client";
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useAddQuestionToSubjectMutation, useGetQuestionsToSubjectQuery, useUpdateQuestionInSubjectMutation, useDeleteQuestionMutation } from '@/redux/features/courses/coursesApi';

// const AddQuestion = () => {
//     const params = useParams();
//     const { courseId, yearId, subjectId } = params;

//     const [questionText, setQuestionText] = useState('');
//     const [questionImage, setQuestionImage] = useState(null);
//     const [answers, setAnswers] = useState([{ content: '', isCorrect: false, image: null }]);
//     const [vimeoLink, setVimeoLink] = useState('');

//     const [addQuestionToSubject] = useAddQuestionToSubjectMutation();
//     const { data: questionsData, refetch: refetchQuestions } = useGetQuestionsToSubjectQuery({ courseId, yearId, subjectId });
//     const [editQuestion] = useUpdateQuestionInSubjectMutation();
//     const [deleteQuestion] = useDeleteQuestionMutation();

//     const handleAddAnswer = () => {
//         setAnswers([...answers, { content: '', isCorrect: false, image: null }]);
//     };

//     const handleAnswerChange = (index, field, value) => {
//         const newAnswers = [...answers];
//         newAnswers[index][field] = value;
//         setAnswers(newAnswers);
//     };

//     const handleImageUpload = async (file, type, index = -1) => {
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('upload_preset', 'your_cloudinary_upload_preset');

//         try {
//             const response = await fetch('https://api.cloudinary.com/v1_1/dv9h1noz9/image/upload', {
//                 method: 'POST',
//                 body: formData
//             });
//             const data = await response.json();
//             if (type === 'question') {
//                 setQuestionImage(data.secure_url);
//             } else if (type === 'answer') {
//                 handleAnswerChange(index, 'image', data.secure_url);
//             }
//         } catch (error) {
//             console.error('Error uploading image:', error);
//         }
//     };

//     const handleSubmit = async () => {
//         try {
//             const questionData = {
//                 courseId,
//                 yearId,
//                 subjectId,
//                 text: { type: questionImage ? 'image' : 'text', content: questionImage || questionText },
//                 answers: answers.map(answer => ({
//                     type: answer.image ? 'image' : 'text',
//                     content: answer.image || answer.content,
//                     isCorrect: answer.isCorrect
//                 })),
//                 vimeoLink
//             };

//             await addQuestionToSubject(questionData).unwrap();

//             // Clear form after successful submission
//             setQuestionText('');
//             setQuestionImage(null);
//             setAnswers([{ content: '', isCorrect: false, image: null }]);
//             setVimeoLink('');

//             refetchQuestions();
//         } catch (error) {
//             console.error('Error adding question:', error);
//         }
//     };

//     const handleEdit = async (questionId) => {
//         // Implement edit functionality
//     };

//     const handleDelete = async (questionId) => {
//         try {
//             await deleteQuestion({ courseId, yearId, subjectId, questionId }).unwrap();
//             refetchQuestions();
//         } catch (error) {
//             console.error('Error deleting question:', error);
//         }
//     };

//     return (
//         <Box m="20px">
//             <Typography variant="h4" mb="20px">Add Question</Typography>
//             <TextField
//                 fullWidth
//                 label="Question Text"
//                 value={questionText}
//                 onChange={(e) => setQuestionText(e.target.value)}
//                 margin="normal"
//             />
//             <input
//                 type="file"
//                 onChange={(e) => handleImageUpload(e.target.files[0], 'question')}
//             />
//             {questionImage && <img src={questionImage} alt="Question" style={{ maxWidth: '200px' }} />}

//             {answers.map((answer, index) => (
//                 <Box key={index} display="flex" alignItems="center" mb={2}>
//                     <TextField
//                         fullWidth
//                         label={`Answer ${index + 1}`}
//                         value={answer.content}
//                         onChange={(e) => handleAnswerChange(index, 'content', e.target.value)}
//                         margin="normal"
//                     />
//                     <input
//                         type="file"
//                         onChange={(e) => handleImageUpload(e.target.files[0], 'answer', index)}
//                     />
//                     {answer.image && <img src={answer.image} alt={`Answer ${index + 1}`} style={{ maxWidth: '100px' }} />}
//                     <Button
//                         variant={answer.isCorrect ? "contained" : "outlined"}
//                         onClick={() => handleAnswerChange(index, 'isCorrect', !answer.isCorrect)}
//                         style={{ marginLeft: '10px' }}
//                     >
//                         Correct
//                     </Button>
//                 </Box>
//             ))}
//             <Button onClick={handleAddAnswer}>Add Answer</Button>

//             <TextField
//                 fullWidth
//                 label="Vimeo Link"
//                 value={vimeoLink}
//                 onChange={(e) => setVimeoLink(e.target.value)}
//                 margin="normal"
//             />

//             <Button variant="contained" onClick={handleSubmit} style={{ marginTop: '20px' }}>
//                 Submit Question
//             </Button>

//             <TableContainer component={Paper} style={{ marginTop: '40px' }}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>Question</TableCell>
//                             <TableCell>Answers</TableCell>
//                             <TableCell>Like Count</TableCell>
//                             <TableCell>Dislike Count</TableCell>
//                             <TableCell>Vimeo Link</TableCell>
//                             <TableCell>Actions</TableCell>
//                         </TableRow>
//                     </TableHead>
//                   <TableBody>
//     {questionsData?.questions.map((question) => (
//         <TableRow key={question._id}>
//             <TableCell>
//                 {question.text ? (
//                     question.text.type === 'image' ? (
//                         <img src={question.text.content} alt="Question" style={{ maxWidth: '100px' }} />
//                     ) : (
//                         question.text.content
//                     )
//                 ) : (
//                     question.type === 'image' ? (
//                         <img src={question.content} alt="Question" style={{ maxWidth: '100px' }} />
//                     ) : (
//                         question.content
//                     )
//                 )}
//             </TableCell>
//             <TableCell>
//                 {question.answers.map((answer, index) => (
//                     <div key={index}>
//                         {answer.type === 'image' ? (
//                             <img src={answer.content} alt={`Answer ${index + 1}`} style={{ maxWidth: '50px' }} />
//                         ) : (
//                             answer.content
//                         )}
//                         {answer.isCorrect && ' (Correct)'}
//                     </div>
//                 ))}
//             </TableCell>
//             <TableCell>{question.likeCount || 0}</TableCell>
//             <TableCell>{question.dislikeCount || 0}</TableCell>
//             <TableCell>{question.vimeoLink || ''}</TableCell>
//             <TableCell>
//                 <IconButton onClick={() => handleEdit(question._id)}><EditIcon /></IconButton>
//                 <IconButton onClick={() => handleDelete(question._id)}><DeleteIcon /></IconButton>
//             </TableCell>
//         </TableRow>
//     ))}
// </TableBody>
//                 </Table>
//             </TableContainer>
//         </Box>
//     );
// };

// export default AddQuestion;

//soumadip edit

// "use client";
// import React, { useState } from "react";
// import { useParams } from "next/navigation";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import {
//   useAddQuestionToSubjectMutation,
//   useGetQuestionsToSubjectQuery,
//   useUpdateQuestionInSubjectMutation,
//   useDeleteQuestionMutation,
// } from "@/redux/features/courses/coursesApi";
// import {
//   FormControl,
//   FormLabel,
//   RadioGroup,
//   Radio,
//   FormControlLabel,
// } from "@mui/material";

// const AddQuestion = () => {
//   const params = useParams();
//   const { courseId, yearId, subjectId } = params;
//   const [questionType, setQuestionType] = useState("text");

//   const [questionText, setQuestionText] = useState("");
//   const [questionImage, setQuestionImage] = useState(null);
//   const [answers, setAnswers] = useState([
//     { content: "", isCorrect: false, image: null },
//   ]);
//   const [vimeoLink, setVimeoLink] = useState("");
//   const [editingQuestionId, setEditingQuestionId] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   const [addQuestionToSubject] = useAddQuestionToSubjectMutation();
//   const { data: questionsData, refetch: refetchQuestions } =
//     useGetQuestionsToSubjectQuery({ courseId, yearId, subjectId });
//   const [editQuestion] = useUpdateQuestionInSubjectMutation();
//   const [deleteQuestion] = useDeleteQuestionMutation();

//   const handleAddAnswer = () => {
//     setAnswers([
//       ...answers,
//       { type: "text", content: "", image: "", isCorrect: false },
//     ]);
//   };

//   const handleAnswerChange = (index, field, value) => {
//     const newAnswers = [...answers];
//     newAnswers[index][field] = value;
//     setAnswers(newAnswers);
//   };

//   const handleImageUpload = async (file, type, index = -1) => {
//     if (!file) {
//       console.error("No file selected for upload");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "your_preset_name"); // Replace with your Cloudinary upload preset

//     try {
//       const response = await fetch(
//         "https://api.cloudinary.com/v1_1/dv9h1noz9/image/upload",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (type === "question") {
//         setQuestionImage(data.secure_url);
//       } else if (type === "answer") {
//         handleAnswerChange(index, "image", data.secure_url);
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   };


//   const handleSubmit = async () => {
//     if (!questionText.trim()) {
//       alert("Question text is required");
//       return;
//     }

//     try {
//       const questionData = {
//         courseId,
//         yearId,
//         subjectId,
//         text: {
//           type: questionImage ? "image" : "text",
//           content: questionImage || questionText,
//         },
//         answers: answers.map((answer) => ({
//           type: answer.image ? "image" : "text",
//           content: answer.image || answer.content,
//           isCorrect: answer.isCorrect,
//         })),
//         vimeoLink,
//       };

//       if (editingQuestionId) {
//         await editQuestion({
//           questionId: editingQuestionId,
//           ...questionData,
//         }).unwrap();
//         setEditingQuestionId(null);
//       } else {
//         await addQuestionToSubject(questionData).unwrap();
//       }

//       // Reset state
//       setQuestionText("");
//       setQuestionImage(null);
//       setAnswers([{ content: "", isCorrect: false, image: null }]);
//       setVimeoLink("");
//       setIsEditing(false);

//       refetchQuestions();
//     } catch (error) {
//       console.error("Error submitting question:", error);
//     }
//   };

//   const handleEdit = (question) => {
//     setEditingQuestionId(question._id);
//     setQuestionText(question.text?.content ?? "");
//     setQuestionImage(
//       question.text?.type === "image" ? question.text.content : null
//     );
//     setAnswers(
//       question.answers.map((answer) => ({
//         content: answer.content ?? "",
//         isCorrect: answer.isCorrect ?? false,
//         image: answer.type === "image" ? answer.content : null,
//       }))
//     );
//     setVimeoLink(question.vimeoLink ?? "");
//     setIsEditing(true);
//   };

//   const handleDelete = async (questionId) => {
//     try {
//       await deleteQuestion({
//         courseId,
//         yearId,
//         subjectId,
//         questionId,
//       }).unwrap();
//       refetchQuestions();
//     } catch (error) {
//       console.error("Error deleting question:", error);
//     }
//   };

//   return (
//     <Box m="20px">
//       <Typography variant="h4" mb="20px">
//         Add Question
//       </Typography>

//       <FormControl component="fieldset" margin="normal">
//         <FormLabel component="legend">Question Type</FormLabel>
//         <RadioGroup
//           row
//           value={questionType}
//           onChange={(e) => setQuestionType(e.target.value)}
//         >
//           <FormControlLabel value="text" control={<Radio />} label="Text" />
//           <FormControlLabel value="image" control={<Radio />} label="Image" />
//         </RadioGroup>
//       </FormControl>

//       {questionType === "text" && (
//         <TextField
//           fullWidth
//           label="Question Text"
//           value={questionText}
//           onChange={(e) => setQuestionText(e.target.value)}
//           margin="normal"
//         />
//       )}

//       {questionType === "image" && (
//         <input
//           type="file"
//           onChange={(e) => handleImageUpload(e.target.files[0], "question")}
//         />
//       )}

//       {questionImage && (
//         <img src={questionImage} alt="Question" style={{ maxWidth: "200px" }} />
//       )}

//       {answers.map((answer, index) => (
//         <Box key={index} display="flex" alignItems="center" mb={2}>
//           <FormControl component="fieldset" margin="normal">
//             <FormLabel component="legend">Answer {index + 1} Type</FormLabel>
//             <RadioGroup
//               row
//               value={answer.type}
//               onChange={(e) =>
//                 handleAnswerChange(index, "type", e.target.value)
//               }
//             >
//               <FormControlLabel value="text" control={<Radio />} label="Text" />
//               <FormControlLabel
//                 value="image"
//                 control={<Radio />}
//                 label="Image"
//               />
//             </RadioGroup>
//           </FormControl>

//           {answer.type === "text" && (
//             <TextField
//               fullWidth
//               label={`Answer ${index + 1}`}
//               value={answer.content}
//               onChange={(e) =>
//                 handleAnswerChange(index, "content", e.target.value)
//               }
//               margin="normal"
//             />
//           )}

//           {answer.type === "image" && (
//             <>
//               <input
//                 type="file"
//                 onChange={(e) =>
//                   handleImageUpload(e.target.files[0], "answer", index)
//                 }
//               />
//               {answer.image && (
//                 <img
//                   src={answer.image}
//                   alt={`Answer ${index + 1}`}
//                   style={{ maxWidth: "100px" }}
//                 />
//               )}
//             </>
//           )}

//           <Button
//             variant={answer.isCorrect ? "contained" : "outlined"}
//             onClick={() =>
//               handleAnswerChange(index, "isCorrect", !answer.isCorrect)
//             }
//             style={{ marginLeft: "10px" }}
//           >
//             Correct
//           </Button>
//         </Box>
//       ))}

//       <Button onClick={handleAddAnswer}>Add Answer</Button>

//       <TextField
//         fullWidth
//         label="Vimeo Link"
//         value={vimeoLink}
//         onChange={(e) => setVimeoLink(e.target.value)}
//         margin="normal"
//       />

//       <Button
//         variant="contained"
//         onClick={handleSubmit}
//         style={{ marginTop: "20px" }}
//       >
//         {editingQuestionId ? "Update Question" : "Submit Question"}
//       </Button>

//       <TableContainer component={Paper} style={{ marginTop: "40px" }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Question</TableCell>
//               <TableCell>Answers</TableCell>
//               <TableCell>Like Count</TableCell>
//               <TableCell>Dislike Count</TableCell>
//               <TableCell>Vimeo Link</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {questionsData?.questions.map((question) => (
//               <TableRow key={question._id}>
//                 <TableCell>
//                   {question.text?.type === "image" ? (
//                     <img
//                       src={question.text?.content ?? ""}
//                       alt="Question"
//                       style={{ maxWidth: "100px" }}
//                     />
//                   ) : (
//                     question.content ?? "No text available"
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   {question.answers.map((answer, index) => (
//                     <div key={index}>
//                       {answer.type === "image" ? (
//                         <img
//                           src={answer.content ?? ""}
//                           alt={`Answer ${index + 1}`}
//                           style={{ maxWidth: "50px" }}
//                         />
//                       ) : (
//                         answer.content ?? "No answer available"
//                       )}
//                       {answer.isCorrect && " (Correct)"}
//                     </div>
//                   ))}
//                 </TableCell>
//                 <TableCell>{question.likeCount || 0}</TableCell>
//                 <TableCell>{question.dislikeCount || 0}</TableCell>
//                 <TableCell>{question.vimeoLink || "No Vimeo link"}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => handleEdit(question)}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton onClick={() => handleDelete(question._id)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Edit Question Dialog */}
//       <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
//         <DialogTitle>Edit Question</DialogTitle>
//         <DialogContent>
//           <FormControl component="fieldset" margin="normal">
//             <FormLabel component="legend">Question Type</FormLabel>
//             <RadioGroup
//               row
//               value={questionType}
//               onChange={(e) => setQuestionType(e.target.value)}
//             >
//               <FormControlLabel value="text" control={<Radio />} label="Text" />
//               <FormControlLabel
//                 value="image"
//                 control={<Radio />}
//                 label="Image"
//               />
//             </RadioGroup>
//           </FormControl>

//           {questionType === "text" && (
//             <TextField
//               fullWidth
//               label="Question Text"
//               value={questionText}
//               onChange={(e) => setQuestionText(e.target.value)}
//               margin="normal"
//             />
//           )}

//           {questionType === "image" && (
//             <input
//               type="file"
//               onChange={(e) => handleImageUpload(e.target.files[0], "question")}
//             />
//           )}

//           {questionImage && (
//             <img
//               src={questionImage}
//               alt="Question"
//               style={{ maxWidth: "200px" }}
//             />
//           )}

//           {answers.map((answer, index) => (
//             <Box key={index} display="flex" alignItems="center" mb={2}>
//               <FormControl component="fieldset" margin="normal">
//                 <FormLabel component="legend">
//                   Answer {index + 1} Type
//                 </FormLabel>
//                 <RadioGroup
//                   row
//                   value={answer.type}
//                   onChange={(e) =>
//                     handleAnswerChange(index, "type", e.target.value)
//                   }
//                 >
//                   <FormControlLabel
//                     value="text"
//                     control={<Radio />}
//                     label="Text"
//                   />
//                   <FormControlLabel
//                     value="image"
//                     control={<Radio />}
//                     label="Image"
//                   />
//                 </RadioGroup>
//               </FormControl>

//               {answer.type === "text" && (
//                 <TextField
//                   fullWidth
//                   label={`Answer ${index + 1}`}
//                   value={answer.content}
//                   onChange={(e) =>
//                     handleAnswerChange(index, "content", e.target.value)
//                   }
//                   margin="normal"
//                 />
//               )}

//               {answer.type === "image" && (
//                 <>
//                   <input
//                     type="file"
//                     onChange={(e) =>
//                       handleImageUpload(e.target.files[0], "answer", index)
//                     }
//                   />
//                   {answer.image && (
//                     <img
//                       src={answer.image}
//                       alt={`Answer ${index + 1}`}
//                       style={{ maxWidth: "100px" }}
//                     />
//                   )}
//                 </>
//               )}

//               <Button
//                 variant={answer.isCorrect ? "contained" : "outlined"}
//                 onClick={() =>
//                   handleAnswerChange(index, "isCorrect", !answer.isCorrect)
//                 }
//                 style={{ marginLeft: "10px" }}
//               >
//                 Correct
//               </Button>
//             </Box>
//           ))}

//           <Button onClick={handleAddAnswer}>Add Answer</Button>

//           <TextField
//             fullWidth
//             label="Vimeo Link"
//             value={vimeoLink}
//             onChange={(e) => setVimeoLink(e.target.value)}
//             margin="normal"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setIsEditing(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleSubmit}>
//             Save Changes
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default AddQuestion;


// "use client";
// import React, { useState } from "react";
// import { useParams } from "next/navigation";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControl,
//   FormLabel,
//   RadioGroup,
//   Radio,
//   FormControlLabel,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import {
//   useAddQuestionToSubjectMutation,
//   useGetQuestionsToSubjectQuery,
//   useUpdateQuestionInSubjectMutation,
//   useDeleteQuestionMutation,
// } from "@/redux/features/courses/coursesApi";

// const AddQuestion = () => {
//   const params = useParams();
//   const { courseId, yearId, subjectId } = params;
//   const [questionType, setQuestionType] = useState("text");
//   const [questionText, setQuestionText] = useState("");
//   const [questionImage, setQuestionImage] = useState(null);
//   const [answers, setAnswers] = useState([{ content: "", isCorrect: false, image: null }]);
//   const [vimeoLink, setVimeoLink] = useState("");
//   const [editingQuestionId, setEditingQuestionId] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   const [addQuestionToSubject] = useAddQuestionToSubjectMutation();
//   const { data: questionsData, refetch: refetchQuestions } = useGetQuestionsToSubjectQuery({ courseId, yearId, subjectId });
//   const [editQuestion] = useUpdateQuestionInSubjectMutation();
//   const [deleteQuestion] = useDeleteQuestionMutation();

//   const handleAddAnswer = () => {
//     setAnswers([...answers, { content: "", isCorrect: false, image: null }]);
//   };

//   const handleAnswerChange = (index, field, value) => {
//     const newAnswers = [...answers];
//     newAnswers[index][field] = value;
//     setAnswers(newAnswers);
//   };

//   const handleImageUpload = async (file, type, index = -1) => {
//     if (!file) {
//       console.error("No file selected for upload");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "images"); // Replace with your Cloudinary upload preset

//     try {
//       const response = await fetch("https://api.cloudinary.com/v1_1/dv9h1noz9/image/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (type === "question") {
//         setQuestionImage(data.secure_url);
//       } else if (type === "answer") {
//         handleAnswerChange(index, "image", data.secure_url);
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!questionText.trim() && !questionImage) {
//       alert("Question text or image is required");
//       return;
//     }

//     try {
//       const questionData = {
//         courseId,
//         yearId,
//         subjectId,
//         text: {
//           type: questionImage ? "image" : "text",
//           content: questionImage || questionText,
//         },
//         answers: answers.map((answer) => ({
//           type: answer.image ? "image" : "text",
//           content: answer.image || answer.content,
//           isCorrect: answer.isCorrect,
//         })),
//         vimeoLink,
//       };

//       if (editingQuestionId) {
//         await editQuestion({ questionId: editingQuestionId, ...questionData }).unwrap();
//         setEditingQuestionId(null);
//       } else {
//         await addQuestionToSubject(questionData).unwrap();
//       }

//       // Reset state
//       setQuestionText("");
//       setQuestionImage(null);
//       setAnswers([{ content: "", isCorrect: false, image: null }]);
//       setVimeoLink("");
//       setIsEditing(false);

//       refetchQuestions();
//     } catch (error) {
//       console.error("Error submitting question:", error);
//     }
//   };

//   const handleEdit = (question) => {
//     setEditingQuestionId(question._id);
//     setQuestionText(question.text?.content ?? "");
//     setQuestionImage(question.text?.type === "image" ? question.text.content : null);
//     setAnswers(
//       question.answers.map((answer) => ({
//         content: answer.content ?? "",
//         isCorrect: answer.isCorrect ?? false,
//         image: answer.type === "image" ? answer.content : null,
//       }))
//     );
//     setVimeoLink(question.vimeoLink ?? "");
//     setIsEditing(true);
//   };

//   const handleDelete = async (questionId) => {
//     try {
//       await deleteQuestion({ courseId, yearId, subjectId, questionId }).unwrap();
//       refetchQuestions();
//     } catch (error) {
//       console.error("Error deleting question:", error);
//     }
//   };

//   return (
//     <Box m="20px">
//       <Typography variant="h4" mb="20px">
//         Add Question
//       </Typography>

//       <FormControl component="fieldset" margin="normal">
//         <FormLabel component="legend">Question Type</FormLabel>
//         <RadioGroup
//           row
//           value={questionType}
//           onChange={(e) => setQuestionType(e.target.value)}
//         >
//           <FormControlLabel value="text" control={<Radio />} label="Text" />
//           <FormControlLabel value="image" control={<Radio />} label="Image" />
//         </RadioGroup>
//       </FormControl>

//       {questionType === "text" && (
//         <TextField
//           fullWidth
//           label="Question Text"
//           value={questionText}
//           onChange={(e) => setQuestionText(e.target.value)}
//           margin="normal"
//         />
//       )}

//       {questionType === "image" && (
//         <input
//           type="file"
//           onChange={(e) => handleImageUpload(e.target.files[0], "question")}
//         />
//       )}

//       {questionImage && (
//         <img src={questionImage} alt="Question" style={{ maxWidth: "200px" }} />
//       )}

//       {answers.map((answer, index) => (
//         <Box key={index} display="flex" alignItems="center" mb={2}>
//           <FormControl component="fieldset" margin="normal">
//             <FormLabel component="legend">Answer {index + 1} Type</FormLabel>
//             <RadioGroup
//               row
//               value={answer.type}
//               onChange={(e) => handleAnswerChange(index, "type", e.target.value)}
//             >
//               <FormControlLabel value="text" control={<Radio />} label="Text" />
//               <FormControlLabel value="image" control={<Radio />} label="Image" />
//             </RadioGroup>
//           </FormControl>

//           {answer.type === "text" && (
//             <TextField
//               fullWidth
//               label={`Answer ${index + 1}`}
//               value={answer.content}
//               onChange={(e) => handleAnswerChange(index, "content", e.target.value)}
//               margin="normal"
//             />
//           )}

//           {answer.type === "image" && (
//             <>
//               <input
//                 type="file"
//                 onChange={(e) => handleImageUpload(e.target.files[0], "answer", index)}
//               />
//               {answer.image && (
//                 <img src={answer.image} alt={`Answer ${index + 1}`} style={{ maxWidth: "100px" }} />
//               )}
//             </>
//           )}

//           <Button
//             variant={answer.isCorrect ? "contained" : "outlined"}
//             onClick={() => handleAnswerChange(index, "isCorrect", !answer.isCorrect)}
//             style={{ marginLeft: "10px" }}
//           >
//             Correct
//           </Button>
//         </Box>
//       ))}

//       <Button onClick={handleAddAnswer}>Add Answer</Button>

//       <TextField
//         fullWidth
//         label="Vimeo Link"
//         value={vimeoLink}
//         onChange={(e) => setVimeoLink(e.target.value)}
//         margin="normal"
//       />

//       <Button
//         variant="contained"
//         onClick={handleSubmit}
//         style={{ marginTop: "20px" }}
//       >
//         {editingQuestionId ? "Update Question" : "Submit Question"}
//       </Button>

//       <TableContainer component={Paper} style={{ marginTop: "40px" }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Question</TableCell>
//               <TableCell>Answers</TableCell>
//               <TableCell>Like Count</TableCell>
//               <TableCell>Dislike Count</TableCell>
//               <TableCell>Vimeo Link</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {questionsData?.questions.map((question) => (
//               <TableRow key={question._id}>
//                 <TableCell>
//                   {question.text.type === "text" ? question.text.content : (
//                     <img src={question.text.content} alt="Question" style={{ maxWidth: "200px" }} />
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   <ul>
//                     {question.answers.map((answer, idx) => (
//                       <li key={idx}>
//                         {answer.type === "text" ? answer.content : (
//                           <img src={answer.content} alt={`Answer ${idx + 1}`} style={{ maxWidth: "100px" }} />
//                         )}
//                       </li>
//                     ))}
//                   </ul>
//                 </TableCell>
//                 <TableCell>{question.likeCount}</TableCell>
//                 <TableCell>{question.dislikeCount}</TableCell>
//                 <TableCell>{question.vimeoLink}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => handleEdit(question)}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton onClick={() => handleDelete(question._id)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default AddQuestion;
// "use client";
// import React, { useState } from "react";
// import { useParams } from "next/navigation";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   FormControl,
//   FormLabel,
//   RadioGroup,
//   Radio,
//   FormControlLabel,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import {
//   useAddQuestionToSubjectMutation,
//   useGetQuestionsToSubjectQuery,
//   useUpdateQuestionInSubjectMutation,
//   useDeleteQuestionMutation,
// } from "@/redux/features/courses/coursesApi";

// const AddQuestion = () => {
//   const params = useParams();
//   const { courseId, yearId, subjectId } = params;
//   const [questionType, setQuestionType] = useState("text");
//   const [questionText, setQuestionText] = useState("");
//   const [questionImage, setQuestionImage] = useState(null);
//   const [answers, setAnswers] = useState([{ content: "", isCorrect: false, image: null }]);
//   const [vimeoLink, setVimeoLink] = useState("");
//   const [editingQuestionId, setEditingQuestionId] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   const [addQuestionToSubject] = useAddQuestionToSubjectMutation();
//   const { data: questionsData, refetch: refetchQuestions } = useGetQuestionsToSubjectQuery({ courseId, yearId, subjectId });
//   const [editQuestion] = useUpdateQuestionInSubjectMutation();
//   const [deleteQuestion] = useDeleteQuestionMutation();

//   const handleAddAnswer = () => {
//     setAnswers([...answers, { content: "", isCorrect: false, image: null }]);
//   };

//   const handleAnswerChange = (index, field, value) => {
//     const newAnswers = [...answers];
//     newAnswers[index][field] = value;
//     setAnswers(newAnswers);
//   };

//   const handleImageUpload = async (file, type, index = -1) => {
//     if (!file) {
//       console.error("No file selected for upload");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "images"); // Replace with your Cloudinary upload preset

//     try {
//       const response = await fetch("https://api.cloudinary.com/v1_1/dv9h1noz9/image/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (type === "question") {
//         setQuestionImage(data.secure_url);
//       } else if (type === "answer") {
//         handleAnswerChange(index, "image", data.secure_url);
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!questionText.trim() && !questionImage) {
//       alert("Question text or image is required");
//       return;
//     }

//     try {
//       const questionData = {
//         courseId,
//         yearId,
//         subjectId,
//         text: {
//           content: questionText,
//           image: questionImage ? { url: questionImage } : null,
//         },
//         answers: answers.map((answer) => ({
//           content: answer.content,
//           image: answer.image ? { url: answer.image } : null,
//           isCorrect: answer.isCorrect,
//         })),
//         videoLink: vimeoLink,
//         videoId: vimeoLink ? extractVideoId(vimeoLink) : null,
//       };

//       if (editingQuestionId) {
//         await editQuestion({ questionId: editingQuestionId, ...questionData }).unwrap();
//         setEditingQuestionId(null);
//       } else {
//         await addQuestionToSubject(questionData).unwrap();
//       }

//       // Reset state
//       setQuestionText("");
//       setQuestionImage(null);
//       setAnswers([{ content: "", isCorrect: false, image: null }]);
//       setVimeoLink("");
//       setIsEditing(false);

//       refetchQuestions();
//     } catch (error) {
//       console.error("Error submitting question:", error);
//     }
//   };

//   const handleEdit = (question) => {
//     setEditingQuestionId(question._id);
//     setQuestionText(question.text?.content ?? "");
//     setQuestionImage(question.text?.image?.url ?? null);
//     setAnswers(
//       question.answers.map((answer) => ({
//         content: answer.content ?? "",
//         isCorrect: answer.isCorrect ?? false,
//         image: answer.image?.url ?? null,
//       }))
//     );
//     setVimeoLink(question.videoLink ?? "");
//     setIsEditing(true);
//   };

//   const handleDelete = async (questionId) => {
//     try {
//       await deleteQuestion({ courseId, yearId, subjectId, questionId }).unwrap();
//       refetchQuestions();
//     } catch (error) {
//       console.error("Error deleting question:", error);
//     }
//   };

//   const extractVideoId = (url) => {
//     const match = url.match(/vimeo\.com\/(\d+)/);
//     return match ? match[1] : null;
//   };

//   return (
//     <Box m="20px">
//       <Typography variant="h4" mb="20px">
//         Add Question
//       </Typography>

//       <FormControl component="fieldset" margin="normal">
//         <FormLabel component="legend">Question Type</FormLabel>
//         <RadioGroup
//           row
//           value={questionType}
//           onChange={(e) => setQuestionType(e.target.value)}
//         >
//           <FormControlLabel value="text" control={<Radio />} label="Text" />
//           <FormControlLabel value="image" control={<Radio />} label="Image" />
//         </RadioGroup>
//       </FormControl>

//       {questionType === "text" && (
//         <TextField
//           fullWidth
//           label="Question Text"
//           value={questionText}
//           onChange={(e) => setQuestionText(e.target.value)}
//           margin="normal"
//         />
//       )}

//       {questionType === "image" && (
//         <input
//           type="file"
//           onChange={(e) => handleImageUpload(e.target.files[0], "question")}
//         />
//       )}

//       {questionImage && (
//         <img src={questionImage} alt="Question" style={{ maxWidth: "200px" }} />
//       )}

//       {answers.map((answer, index) => (
//         <Box key={index} display="flex" alignItems="center" mb={2}>
//           <FormControl component="fieldset" margin="normal">
//             <FormLabel component="legend">Answer {index + 1} Type</FormLabel>
//             <RadioGroup
//               row
//               value={answer.type || "text"}
//               onChange={(e) => handleAnswerChange(index, "type", e.target.value)}
//             >
//               <FormControlLabel value="text" control={<Radio />} label="Text" />
//               <FormControlLabel value="image" control={<Radio />} label="Image" />
//             </RadioGroup>
//           </FormControl>

//           {answer.type === "text" && (
//             <TextField
//               fullWidth
//               label={`Answer ${index + 1}`}
//               value={answer.content}
//               onChange={(e) => handleAnswerChange(index, "content", e.target.value)}
//               margin="normal"
//             />
//           )}

//           {answer.type === "image" && (
//             <>
//               <input
//                 type="file"
//                 onChange={(e) => handleImageUpload(e.target.files[0], "answer", index)}
//               />
//               {answer.image && (
//                 <img src={answer.image} alt={`Answer ${index + 1}`} style={{ maxWidth: "100px" }} />
//               )}
//             </>
//           )}

//           <Button
//             variant={answer.isCorrect ? "contained" : "outlined"}
//             onClick={() => handleAnswerChange(index, "isCorrect", !answer.isCorrect)}
//             style={{ marginLeft: "10px" }}
//           >
//             Correct
//           </Button>
//         </Box>
//       ))}

//       <Button onClick={handleAddAnswer}>Add Answer</Button>

//       <TextField
//         fullWidth
//         label="Vimeo Link"
//         value={vimeoLink}
//         onChange={(e) => setVimeoLink(e.target.value)}
//         margin="normal"
//       />

//       <Button
//         variant="contained"
//         onClick={handleSubmit}
//         style={{ marginTop: "20px" }}
//       >
//         {editingQuestionId ? "Update Question" : "Submit Question"}
//       </Button>

//       <TableContainer component={Paper} style={{ marginTop: "40px" }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Question</TableCell>
//               <TableCell>Answers</TableCell>
//               <TableCell>Like Count</TableCell>
//               <TableCell>Dislike Count</TableCell>
//               <TableCell>Vimeo Link</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {questionsData?.questions.map((question) => (
//               <TableRow key={question._id}>
//                 <TableCell>
//                   {question.text?.image ? (
//                     <img src={question.text.image.url} alt="Question" style={{ maxWidth: "200px" }} />
//                   ) : (
//                     question.text?.content
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   {question.answers.map((answer, index) => (
//                     <Box key={index} display="flex" flexDirection="column">
//                       {answer.image ? (
//                         <img src={answer.image.url} alt={`Answer ${index + 1}`} style={{ maxWidth: "100px" }} />
//                       ) : (
//                         answer.content
//                       )}
//                       {answer.isCorrect && <Typography color="green">Correct</Typography>}
//                     </Box>
//                   ))}
//                 </TableCell>
//                 <TableCell>{question.likeCount}</TableCell>
//                 <TableCell>{question.dislikeCount}</TableCell>
//                 <TableCell>
//                   {question.videoLink ? (
//                     <a href={question.videoLink} target="_blank" rel="noopener noreferrer">
//                       {question.videoLink}
//                     </a>
//                   ) : (
//                     "No video link"
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => handleEdit(question)}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton onClick={() => handleDelete(question._id)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default AddQuestion;
// "use client"
// import React from 'react';
// import { useParams } from 'next/navigation';
// import AddQuestionForm from './AddQuestionForm';

// const AddQuestion = () => {
//   const params = useParams();
//   const { courseId, yearId, subjectId } = params;

//   return (
//     <div>
//       <AddQuestionForm courseId={courseId} yearId={yearId} subjectId={subjectId} />
//     </div>
//   );
// };

// export default AddQuestion;
"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import AddQuestionForm from './AddQuestionForm';

const AddQuestion = () => {
  const params = useParams();

  // Optional chaining to handle the case where params might be null or missing
  const courseId = params?.courseId as string | undefined;
  const yearId = params?.yearId as string | undefined;
  const subjectId = params?.subjectId as string | undefined;

  // Check if all required parameters are present
  if (!courseId || !yearId || !subjectId) {
    return <div>Missing parameters</div>;
  }

  return (
    <div>
      <AddQuestionForm courseId={courseId} yearId={yearId} subjectId={subjectId} />
    </div>
  );
};

export default AddQuestion;
