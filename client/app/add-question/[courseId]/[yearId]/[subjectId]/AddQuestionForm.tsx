
//first code

// "use client";
// import React, { useState } from 'react';
// import Modal from 'react-modal';
// import { ToastContainer, toast } from 'react-toastify';
// import { IQuestion } from '../../../../../../server/models/course.model';
// import 'react-toastify/dist/ReactToastify.css';
// import './AddQuestion.css';
// import {
//     useAddQuestionToSubjectMutation,
//     useGetQuestionsToSubjectQuery,
//     useUpdateQuestionInSubjectMutation,
//     useDeleteQuestionMutation
// } from './../../../../../redux/features/courses/coursesApi';

// interface AddQuestionFormProps {
//     courseId: string;
//     yearId: string;
//     subjectId: string;
// }

// const AddQuestionForm: React.FC<AddQuestionFormProps> = ({ courseId, yearId, subjectId }) => {
//     const [questionText, setQuestionText] = useState('');
//     const [answerText, setAnswerText] = useState('');
//     const [videoLink, setVideoLink] = useState('');
//     const [questionImage, setQuestionImage] = useState<File | null>(null);
//     const [answerImage, setAnswerImage] = useState<File | null>(null);
//     const [questionType, setQuestionType] = useState('text');
//     const [answerType, setAnswerType] = useState('text');
//     const [isFormVisible, setIsFormVisible] = useState(false);
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [editQuestionId, setEditQuestionId] = useState<string | null>(null);

//     const [addQuestionToSubject, { isLoading: isAdding }] = useAddQuestionToSubjectMutation();
//     const { data: questionsData, refetch: refetchQuestions, isFetching: isFetchingQuestions } = useGetQuestionsToSubjectQuery({
//         courseId,
//         yearId,
//         subjectId,
//     });
//     const [updateQuestionInSubject, { isLoading: isUpdating }] = useUpdateQuestionInSubjectMutation();
//     const [deleteQuestion, { isLoading: isDeleting }] = useDeleteQuestionMutation();

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<File | null>>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setImage(file);
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         try {
//             if (isEditMode && editQuestionId) {
//                 await updateQuestionInSubject({
//                     courseId,
//                     yearId,
//                     subjectId,
//                     questionId: editQuestionId,
//                     questionText,
//                     answerText,
//                     videoLink,
//                     questionImage,
//                     answerImage,
//                 }).unwrap();
//                 toast.success('Question updated successfully!');
//             } else {
//                 await addQuestionToSubject({
//                     courseId,
//                     yearId,
//                     subjectId,
//                     questionText,
//                     answerText,
//                     videoLink,
//                     questionImage,
//                     answerImage,
//                 }).unwrap();
//                 toast.success('Question added successfully!');
//             }
//             refetchQuestions(); // Fetch questions after adding/updating
//             setIsFormVisible(false); // Close the modal after submitting
//             // Clear input fields after successful submission
//             setQuestionText('');
//             setAnswerText('');
//             setVideoLink('');
//             setQuestionImage(null);
//             setAnswerImage(null);
//             setIsEditMode(false);
//             setEditQuestionId(null);
//         } catch (error) {
//             console.error('Error adding/updating question:', error);
//             toast.error('Error adding/updating question');
//         }
//     };

//     const toggleFormVisibility = () => {
//         setIsFormVisible(!isFormVisible);
//     };

//     const handleEditQuestion = (questionId: string) => {
//         const question = questionsData?.questions.find(q => q._id === questionId);
//         if (question) {
//             setQuestionText(question.questionText);
//             setAnswerText(question.answerText);
            
//             setVideoLink(question.videoLink);
//             setQuestionType(question.questionImage ? 'image' : 'text');
//             setAnswerType(question.answerImage ? 'image' : 'text');
//             setEditQuestionId(questionId);
//             setIsEditMode(true);
//             setIsFormVisible(true);
//         }
//     };

//     const handleDeleteQuestion = async (questionId: string) => {
//         try {
//             await deleteQuestion({
//                 courseId,
//                 yearId,
//                 subjectId,
//                 questionId,
//             }).unwrap();
//             toast.success('Question deleted successfully!');
//             refetchQuestions(); // Fetch questions after deleting
//         } catch (error) {
//             console.error('Error deleting question:', error);
//             toast.error('Error deleting question');
//         }
//     };

//     const handleInsertUp = (index: number) => {
//         if (index > 0) {
//             const newQuestions = [...(questionsData?.questions || [])];
//             [newQuestions[index], newQuestions[index - 1]] = [newQuestions[index - 1], newQuestions[index]];
//             // Assuming there's an API or method to update the order of questions
//             refetchQuestions();
//         }
//     };

//     const handleInsertDown = (index: number) => {
//         if (index < (questionsData?.questions.length || 0) - 1) {
//             const newQuestions = [...(questionsData?.questions || [])];
//             [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
//             // Assuming there's an API or method to update the order of questions
//             refetchQuestions();
//         }
//     };

//     return (
//         <div className="p-4 max-w-lg mx-auto bg-white rounded shadow">
//             <ToastContainer />
//             <button
//                 onClick={toggleFormVisibility}
//                 className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-4 rounded hover:from-blue-500 hover:to-blue-700 mb-8"
//             >
//                 {isFormVisible ? 'Close Form' : 'Add Question'}
//             </button>

//             <Modal
//                 isOpen={isFormVisible}
//                 onRequestClose={toggleFormVisibility}
//                 contentLabel="Add Question Modal"
//                 className="modal"
//                 overlayClassName="modal-overlay"
//             >
//                 <div className="p-4 max-w-lg mx-auto bg-white rounded shadow">
//                     <h1 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit' : 'Add'} a Question</h1>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Question Type</label>
//                             <select
//                                 value={questionType}
//                                 onChange={(e) => setQuestionType(e.target.value)}
//                                 className="mt-1 block w-full border border-gray-300 rounded p-2"
//                             >
//                                 <option value="text">Text</option>
//                                 <option value="image">Image</option>
//                                 <option value="both">Both</option>
//                             </select>
//                         </div>
//                         {questionType === 'text' || questionType === 'both' ? (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Question Text</label>
//                                 <input
//                                     type="text"
//                                     value={questionText}
//                                     onChange={(e) => setQuestionText(e.target.value)}
//                                     className="mt-1 block w-full border border-gray-300 rounded p-2"
//                                 />
//                             </div>
//                         ) : null}
//                         {questionType === 'image' || questionType === 'both' ? (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Question Image</label>
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={(e) => handleImageChange(e, setQuestionImage)}
//                                     className="mt-1 block w-full border border-gray-300 rounded p-2"
//                                 />
//                                 {questionImage && (
//                                     <img
//                                         src={URL.createObjectURL(questionImage)}
//                                         alt="Question Preview"
//                                         className="mt-2 h-16 w-16 object-cover"
//                                     />
//                                 )}
//                             </div>
//                         ) : null}

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Answer Type</label>
//                             <select
//                                 value={answerType}
//                                 onChange={(e) => setAnswerType(e.target.value)}
//                                 className="mt-1 block w-full border border-gray-300 rounded p-2"
//                             >
//                                 <option value="text">Text</option>
//                                 <option value="image">Image</option>
//                                 <option value="both">Both</option>
//                             </select>
//                         </div>
//                         {answerType === 'text' || answerType === 'both' ? (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Answer Text</label>
//                                 <input
//                                     type="text"
//                                     value={answerText}
//                                     onChange={(e) => setAnswerText(e.target.value)}
//                                     className="mt-1 block w-full border border-gray-300 rounded p-2"
//                                 />
//                             </div>
//                         ) : null}
//                         {answerType === 'image' || answerType === 'both' ? (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Answer Image</label>
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={(e) => handleImageChange(e, setAnswerImage)}
//                                     className="mt-1 block w-full border border-gray-300 rounded p-2"
//                                 />
//                                 {answerImage && (
//                                     <img
//                                         src={URL.createObjectURL(answerImage)}
//                                         alt="Answer Preview"
//                                         className="mt-2 h-16 w-16 object-cover"
//                                     />
//                                 )}
//                             </div>
//                         ) : null}

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Video Link</label>
//                             <input
//                                 type="text"
//                                 value={videoLink}
//                                 onChange={(e) => setVideoLink(e.target.value)}
//                                 className="mt-1 block w-full border border-gray-300 rounded p-2"
//                             />
//                         </div>

//                         <button
//                             type="submit"
//                             className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-4 rounded hover:from-blue-500 hover:to-blue-700"
//                             disabled={isAdding || isUpdating}
//                         >
//                             {isAdding || isUpdating ? 'Saving...' : isEditMode ? 'Update Question' : 'Add Question'}
//                         </button>
//                     </form>
//                 </div>
//             </Modal>

//             <div className="mt-8">
//                 <h2 className="text-xl font-bold mb-4">Questions</h2>
//                 {isFetchingQuestions ? (
//                     <div>Loading questions...</div>
//                 ) : (
//                     <table className="min-w-full bg-white">
//                         <thead>
//                             <tr>
//                                 <th className="py-2">#</th>
//                                 <th className="py-2">Question Text</th>
//                                 <th className="py-2">Question Image</th>
//                                 <th className="py-2">Answer Text</th>
//                                 <th className="py-2">Answer Image</th>
//                                 <th className="py-2">Video Link</th>
//                                 <th className="py-2">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {questionsData?.questions.map((question:IQuestion, index:number) => (
//                                 <tr key={question._id.toString()} className="even:bg-gray-50">
//                                     <td className="border px-4 py-2">{index + 1}</td>
//                                     <td className="border px-4 py-2">{question.questionText }</td>
//                                     <td className="border px-4 py-2">
//                                         {question.questionImage?.url && (
//                                             <img src={question.questionImage.url as string} alt="Question" className="h-18  w-24 object-cover" />
//                                         )}
//                                     </td>
//                                     <td className="border px-4 py-2">{question.answerText}</td>
//                                     <td className="border px-4 py-2">
//                                         {question.answerImage?.url && (
//                                             <img src={question.answerImage.url as string} alt="Answer" className="h-16 w-16 object-cover" />
//                                         )}
//                                     </td>
//                                     <td className="border px-4 py-2">
//                                         {question.videoLink && (
//                                             <a href={question.videoLink} target="_blank" rel="noopener noreferrer">
//                                                 {question.videoLink}
//                                             </a>
//                                         )}
//                                     </td>
//                                     <td className="border px-4 py-2 space-x-2">
//                                         <button
//                                             onClick={() => handleEditQuestion(question._id.toString())}
//                                             className="text-blue-500 hover:underline"
//                                         >
//                                             Edit
//                                         </button>
//                                         <button
//                                             onClick={() => handleDeleteQuestion(question._id.toString())}
//                                             className="text-red-500 hover:underline"
//                                         >
//                                             Delete
//                                         </button>
//                                         <button
//                                             onClick={() => handleInsertUp(index)}
//                                             className="text-green-500 hover:underline"
//                                         >
//                                             ↑
//                                         </button>
//                                         <button
//                                             onClick={() => handleInsertDown(index)}
//                                             className="text-green-500 hover:underline"
//                                         >
//                                             ↓
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AddQuestionForm;



//corect code server included

"use client";
import React, { useState } from 'react';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

import './AddQuestion.css';
import {
    useAddQuestionToSubjectMutation,
    useGetQuestionsToSubjectQuery,
    useUpdateQuestionInSubjectMutation,
    useDeleteQuestionMutation
} from './../../../../../redux/features/courses/coursesApi';

interface AddQuestionFormProps {
    courseId: string;
    yearId: string;
    subjectId: string;
}
interface IQuestion {
    _id: string;
    questionText: string;
    questionImage?: {
        url: string;
        public_id: string;
    };
    answerText: string;
    answerImage?: {
        url: string;
        public_id: string;
    };
    videoLink?: string;
    videoId?: string; // Extracted video ID
    order: number;
}

interface QuestionsData {
    questions: IQuestion[];
}

const AddQuestionForm: React.FC<AddQuestionFormProps> = ({ courseId, yearId, subjectId }) => {
    const [questionText, setQuestionText] = useState('');
    const [answerText, setAnswerText] = useState('');
    const [videoLink, setVideoLink] = useState('');
    const [questionImage, setQuestionImage] = useState<File | null>(null);
    const [answerImage, setAnswerImage] = useState<File | null>(null);
    const [questionType, setQuestionType] = useState('text');
    const [answerType, setAnswerType] = useState('text');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editQuestionId, setEditQuestionId] = useState<string | null>(null);

    const [addQuestionToSubject, { isLoading: isAdding }] = useAddQuestionToSubjectMutation();
    const { data: questionsData, refetch: refetchQuestions, isFetching: isFetchingQuestions } = useGetQuestionsToSubjectQuery({
        courseId,
        yearId,
        subjectId,
    });
    const [updateQuestionInSubject, { isLoading: isUpdating }] = useUpdateQuestionInSubjectMutation();
    const [deleteQuestion, { isLoading: isDeleting }] = useDeleteQuestionMutation();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<File | null>>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditMode && editQuestionId) {
                await updateQuestionInSubject({
                    courseId,
                    yearId,
                    subjectId,
                    questionId: editQuestionId,
                    questionText,
                    answerText,
                    videoLink,
                    questionImage,
                    answerImage,
                }).unwrap();
                toast.success('Question updated successfully!');
            } else {
                await addQuestionToSubject({
                    courseId,
                    yearId,
                    subjectId,
                    questionText,
                    answerText,
                    videoLink,
                    questionImage,
                    answerImage,
                }).unwrap();
                toast.success('Question added successfully!');
            }
            refetchQuestions(); // Fetch questions after adding/updating
            setIsFormVisible(false); // Close the modal after submitting
            // Clear input fields after successful submission
            setQuestionText('');
            setAnswerText('');
            setVideoLink('');
            setQuestionImage(null);
            setAnswerImage(null);
            setIsEditMode(false);
            setEditQuestionId(null);
        } catch (error) {
            console.error('Error adding/updating question:', error);
            toast.error('Error adding/updating question');
        }
    };

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    // const handleEditQuestion = (questionId: string) => {
    //     const question = questionsData?.questions.find(q => q._id === questionId);
    //     if (question) {
    //         setQuestionText(question.questionText);
    //         setAnswerText(question.answerText);

    //         // Check if questionImage and answerImage are available and create File objects if needed
    //         if (question.questionImage?.url) {
    //             fetch(question.questionImage.url)
    //                 .then(res => res.blob())
    //                 .then(blob => {
    //                     const file = new File([blob], "questionImage", { type: blob.type });
    //                     setQuestionImage(file);
    //                 });
    //         } else {
    //             setQuestionImage(null);
    //         }

    //         if (question.answerImage?.url) {
    //             fetch(question.answerImage.url)
    //                 .then(res => res.blob())
    //                 .then(blob => {
    //                     const file = new File([blob], "answerImage", { type: blob.type });
    //                     setAnswerImage(file);
    //                 });
    //         } else {
    //             setAnswerImage(null);
    //         }

    //         setVideoLink(question.videoLink);
    //         setQuestionType(question.questionImage ? 'image' : 'text');
    //         setAnswerType(question.answerImage ? 'image' : 'text');
    //         setEditQuestionId(questionId);
    //         setIsEditMode(true);
    //         setIsFormVisible(true);
    //     }
    // };

    // const handleEditQuestion = (questionId: string) => {
    //     const question = questionsData?.questions.find((q: IQuestion) => q._id === questionId);
    //     if (question) {
    //         setQuestionText(question.questionText);
    //         setAnswerText(question.answerText);

    //         // Check if questionImage and answerImage are available and create File objects if needed
    //         if (question.questionImage?.url) {
    //             fetch(question.questionImage.url)
    //                 .then(res => res.blob())
    //                 .then(blob => {
    //                     const file = new File([blob], "questionImage", { type: blob.type });
    //                     setQuestionImage(file);
    //                 });
    //         } else {
    //             setQuestionImage(null);
    //         }

    //         if (question.answerImage?.url) {
    //             fetch(question.answerImage.url)
    //                 .then(res => res.blob())
    //                 .then(blob => {
    //                     const file = new File([blob], "answerImage", { type: blob.type });
    //                     setAnswerImage(file);
    //                 });
    //         } else {
    //             setAnswerImage(null);
    //         }

    //         setVideoLink(question.videoLink);
    //         setQuestionType(question.questionImage ? 'image' : 'text');
    //         setAnswerType(question.answerImage ? 'image' : 'text');
    //         setEditQuestionId(questionId);
    //         setIsEditMode(true);
    //         setIsFormVisible(true);
    //     }
    // };
    const handleEditQuestion = (questionId: string) => {
        const question = questionsData?.questions.find((q: IQuestion) => q._id.toString() === questionId);
        if (question) {
            setQuestionText(question.questionText);
            setAnswerText(question.answerText);

            // Check if questionImage and answerImage are available and create File objects if needed
            if (question.questionImage?.url) {
                fetch(question.questionImage.url)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], "questionImage", { type: blob.type });
                        setQuestionImage(file);
                    });
            } else {
                setQuestionImage(null);
            }

            if (question.answerImage?.url) {
                fetch(question.answerImage.url)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], "answerImage", { type: blob.type });
                        setAnswerImage(file);
                    });
            } else {
                setAnswerImage(null);
            }

            setVideoLink(question.videoLink);
            setQuestionType(question.questionImage ? 'image' : 'text');
            setAnswerType(question.answerImage ? 'image' : 'text');
            setEditQuestionId(questionId);
            setIsEditMode(true);
            setIsFormVisible(true);
        }
    };



    const handleDeleteQuestion = async (questionId: string) => {
        try {
            await deleteQuestion({
                courseId,
                yearId,
                subjectId,
                questionId,
            }).unwrap();
            toast.success('Question deleted successfully!');
            refetchQuestions(); // Fetch questions after deleting
        } catch (error) {
            console.error('Error deleting question:', error);
            toast.error('Error deleting question');
        }
    };

    const handleInsertUp = (index: number) => {
        if (index > 0) {
            const newQuestions = [...(questionsData?.questions || [])];
            [newQuestions[index], newQuestions[index - 1]] = [newQuestions[index - 1], newQuestions[index]];
            // Assuming there's an API or method to update the order of questions
            refetchQuestions();
        }
    };

    const handleInsertDown = (index: number) => {
        if (index < (questionsData?.questions.length || 0) - 1) {
            const newQuestions = [...(questionsData?.questions || [])];
            [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
            // Assuming there's an API or method to update the order of questions
            refetchQuestions();
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto bg-white rounded shadow">
            <ToastContainer />
            <button
                onClick={toggleFormVisibility}
                className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-4 rounded hover:from-blue-500 hover:to-blue-700 mb-8"
            >
                {isFormVisible ? 'Close Form' : 'Add Question'}
            </button>

            <Modal
                isOpen={isFormVisible}
                onRequestClose={toggleFormVisibility}
                contentLabel="Add Question Modal"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <div className="p-4 max-w-lg mx-auto bg-white rounded shadow">
                    <h1 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit' : 'Add'} a Question</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Question Type</label>
                            <select
                                value={questionType}
                                onChange={(e) => setQuestionType(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                            >
                                <option value="text">Text</option>
                                <option value="image">Image</option>
                                <option value="both">Both</option>
                            </select>
                        </div>
                        {questionType === 'text' || questionType === 'both' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Question Text</label>
                                <input
                                    type="text"
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                        ) : null}
                        {questionType === 'image' || questionType === 'both' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Question Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, setQuestionImage)}
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                />
                                {/* {questionImage && (
                                    <img
                                        src={URL.createObjectURL(questionImage)}
                                        alt="Question Preview"
                                        className="mt-2 h-16 w-16 object-cover"
                                    />
                                )} */}
                                {questionImage && typeof questionImage === 'object' && (
                                    // <img
                                    //     src={URL.createObjectURL(questionImage)}
                                    //     alt="Question Preview"
                                    //     className="mt-2 h-16 w-16 object-cover"
                                    // />
                                    <Image
                                        src={URL.createObjectURL(questionImage)}
                                        alt="Question Preview"
                                        width={64} // equivalent to h-16
                                        height={64} // equivalent to w-16
                                        className="mt-2 object-cover"
                                    />

                                )}


                            </div>
                        ) : null}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Answer Type</label>
                            <select
                                value={answerType}
                                onChange={(e) => setAnswerType(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                            >
                                <option value="text">Text</option>
                                <option value="image">Image</option>
                                <option value="both">Both</option>
                            </select>
                        </div>
                        {answerType === 'text' || answerType === 'both' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Answer Text</label>
                                <input
                                    type="text"
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                        ) : null}
                        {answerType === 'image' || answerType === 'both' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Answer Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, setAnswerImage)}
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                />
                                {answerImage && (
                                    <Image
                                        src={URL.createObjectURL(answerImage)}
                                        alt="Answer Preview"
                                        width={64} // equivalent to h-16
                                        height={64} // equivalent to w-16
                                        className="mt-2 h-16 w-16 object-cover"
                                    />
                                )}
                            </div>
                        ) : null}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Video Link</label>
                            <input
                                type="text"
                                value={videoLink}
                                onChange={(e) => setVideoLink(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-4 rounded hover:from-blue-500 hover:to-blue-700"
                            disabled={isAdding || isUpdating}
                        >
                            {isAdding || isUpdating ? 'Saving...' : isEditMode ? 'Update Question' : 'Add Question'}
                        </button>
                    </form>
                </div>
            </Modal>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Questions</h2>
                {isFetchingQuestions ? (
                    <div>Loading questions...</div>
                ) : (
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">#</th>
                                <th className="py-2">Question Text</th>
                                <th className="py-2">Question Image</th>
                                <th className="py-2">Answer Text</th>
                                <th className="py-2">Answer Image</th>
                                <th className="py-2">Video Link</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionsData?.questions.map((question:IQuestion, index:number) => (
                                <tr key={question._id.toString()} className="even:bg-gray-50">
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{question.questionText}</td>
                                    <td className="border px-4 py-2">
                                        {question.questionImage?.url && (
                                            <Image src={question.questionImage.url as string} alt="Question"
                                                width={64} // equivalent to h-16
                                                height={64} // equivalent to w-16
                                                className=" 

                                            object-cover" />
                                        )}
                                    </td>
                                    <td className="border px-4 py-2">{question.answerText}</td>
                                    <td className="border px-4 py-2">
                                        {question.answerImage?.url && (
                                            <Image src={question.answerImage.url as string} alt="Answer"
                                                width={64} // equivalent to h-16
                                                height={64} // equivalent to w-16
                                                className=" object-cover" />
                                        )}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {question.videoLink && (
                                            <a href={question.videoLink} target="_blank" rel="noopener noreferrer">
                                                {question.videoLink}
                                            </a>
                                        )}
                                    </td>
                                    <td className="border px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => handleEditQuestion(question._id.toString())}
                                            className="text-blue-500 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteQuestion(question._id.toString())}
                                            className="text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handleInsertUp(index)}
                                            className="text-green-500 hover:underline"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() => handleInsertDown(index)}
                                            className="text-green-500 hover:underline"
                                        >
                                            ↓
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AddQuestionForm;
// "use client";
// import React, { useState } from 'react';
// import Modal from 'react-modal';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './AddQuestion.css';
// import {
//     useAddQuestionToSubjectMutation,
//     useGetQuestionsToSubjectQuery,
//     useUpdateQuestionInSubjectMutation,
//     useDeleteQuestionMutation
// } from './../../../../../redux/features/courses/coursesApi';

// interface AddQuestionFormProps {
//     courseId: string;
//     yearId: string;
//     subjectId: string;
// }

// interface IQuestion {
//     _id: string;
//     questionText: string;
//     questionImage?: {
//         url: string;
//         public_id: string;
//     };
//     answerText: string;
//     answerImage?: {
//         url: string;
//         public_id: string;
//     };
//     videoLink?: string;
//     videoId?: string; // Extracted video ID
//     order: number;
// }

// interface QuestionsData {
//     questions: IQuestion[];
// }

// const AddQuestionForm: React.FC<AddQuestionFormProps> = ({ courseId, yearId, subjectId }) => {
//     const [questionText, setQuestionText] = useState('');
//     const [answerText, setAnswerText] = useState('');
//     const [videoLink, setVideoLink] = useState('');
//     const [questionImage, setQuestionImage] = useState<File | null>(null);
//     const [answerImage, setAnswerImage] = useState<File | null>(null);
//     const [questionType, setQuestionType] = useState('text');
//     const [answerType, setAnswerType] = useState('text');
//     const [isFormVisible, setIsFormVisible] = useState(false);
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [editQuestionId, setEditQuestionId] = useState<string | null>(null);

//     const [addQuestionToSubject, { isLoading: isAdding }] = useAddQuestionToSubjectMutation();
//     const { data: questionsData, refetch: refetchQuestions, isFetching: isFetchingQuestions } = useGetQuestionsToSubjectQuery({
//         courseId,
//         yearId,
//         subjectId,
//     });
//     const [updateQuestionInSubject, { isLoading: isUpdating }] = useUpdateQuestionInSubjectMutation();
//     const [deleteQuestion, { isLoading: isDeleting }] = useDeleteQuestionMutation();

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<File | null>>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setImage(file);
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         try {
//             if (isEditMode && editQuestionId) {
//                 await updateQuestionInSubject({
//                     courseId,
//                     yearId,
//                     subjectId,
//                     questionId: editQuestionId,
//                     questionText,
//                     answerText,
//                     videoLink,
//                     questionImage,
//                     answerImage,
//                 }).unwrap();
//                 toast.success('Question updated successfully!');
//             } else {
//                 await addQuestionToSubject({
//                     courseId,
//                     yearId,
//                     subjectId,
//                     questionText,
//                     answerText,
//                     videoLink,
//                     questionImage,
//                     answerImage,
//                 }).unwrap();
//                 toast.success('Question added successfully!');
//             }
//             refetchQuestions(); // Fetch questions after adding/updating
//             setIsFormVisible(false); // Close the modal after submitting
//             // Clear input fields after successful submission
//             setQuestionText('');
//             setAnswerText('');
//             setVideoLink('');
//             setQuestionImage(null);
//             setAnswerImage(null);
//             setIsEditMode(false);
//             setEditQuestionId(null);
//         } catch (error) {
//             console.error('Error adding/updating question:', error);
//             toast.error('Error adding/updating question');
//         }
//     };

//     const toggleFormVisibility = () => {
//         setIsFormVisible(!isFormVisible);
//     };

//     const handleEditQuestion = (questionId: string) => {
//         const question = questionsData?.questions.find((q: IQuestion) => q._id === questionId);
//         if (question) {
//             setQuestionText(question.questionText);
//             setAnswerText(question.answerText);

//             setVideoLink(question.videoLink);
//             setQuestionType(question.questionImage ? 'image' : 'text');
//             setAnswerType(question.answerImage ? 'image' : 'text');
//             setEditQuestionId(questionId);
//             setIsEditMode(true);
//             setIsFormVisible(true);
//         }
//     };

//     const handleDeleteQuestion = async (questionId: string) => {
//         try {
//             await deleteQuestion({
//                 courseId,
//                 yearId,
//                 subjectId,
//                 questionId,
//             }).unwrap();
//             toast.success('Question deleted successfully!');
//             refetchQuestions(); // Fetch questions after deleting
//         } catch (error) {
//             console.error('Error deleting question:', error);
//             toast.error('Error deleting question');
//         }
//     };

//     const handleInsertUp = (index: number) => {
//         if (index > 0) {
//             const newQuestions = [...(questionsData?.questions || [])];
//             [newQuestions[index], newQuestions[index - 1]] = [newQuestions[index - 1], newQuestions[index]];
//             // Assuming there's an API or method to update the order of questions
//             refetchQuestions();
//         }
//     };

//     const handleInsertDown = (index: number) => {
//         if (index < (questionsData?.questions.length || 0) - 1) {
//             const newQuestions = [...(questionsData?.questions || [])];
//             [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
//             // Assuming there's an API or method to update the order of questions
//             refetchQuestions();
//         }
//     };

//     return (
//         <div className="p-4 max-w-lg mx-auto bg-white rounded shadow">
//             <ToastContainer />
//             <button
//                 onClick={toggleFormVisibility}
//                 className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-4 rounded hover:from-blue-500 hover:to-blue-700 mb-8"
//             >
//                 {isFormVisible ? 'Close Form' : 'Add Question'}
//             </button>

//             <Modal
//                 isOpen={isFormVisible}
//                 onRequestClose={toggleFormVisibility}
//                 contentLabel="Add Question Modal"
//                 className="modal"
//                 overlayClassName="modal-overlay"
//             >
//                 <div className="p-4 max-w-lg mx-auto bg-white rounded shadow">
//                     <h1 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit' : 'Add'} a Question</h1>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Question Type</label>
//                             <select
//                                 value={questionType}
//                                 onChange={(e) => setQuestionType(e.target.value)}
//                                 className="mt-1 block w-full border border-gray-300 rounded p-2"
//                             >
//                                 <option value="text">Text</option>
//                                 <option value="image">Image</option>
//                                 <option value="both">Both</option>
//                             </select>
//                         </div>
//                         {questionType === 'text' || questionType === 'both' ? (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Question Text</label>
//                                 <input
//                                     type="text"
//                                     value={questionText}
//                                     onChange={(e) => setQuestionText(e.target.value)}
//                                     className="mt-1 block w-full border border-gray-300 rounded p-2"
//                                 />
//                             </div>
//                         ) : null}
//                         {questionType === 'image' || questionType === 'both' ? (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Question Image</label>
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={(e) => handleImageChange(e, setQuestionImage)}
//                                     className="mt-1 block w-full border border-gray-300 rounded p-2"
//                                 />
//                                 {questionImage && (
//                                     <img
//                                         src={URL.createObjectURL(questionImage)}
//                                         alt="Question Preview"
//                                         className="mt-2 h-16 w-16 object-cover"
//                                     />
//                                 )}
//                             </div>
//                         ) : null}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Answer Type</label>
//                             <select
//                                 value={answerType}
//                                 onChange={(e) => setAnswerType(e.target.value)}
//                                 className="mt-1 block w-full border border-gray-300 rounded p-2"
//                             >
//                                 <option value="text">Text</option>
//                                 <option value="image">Image</option>
//                                 <option value="both">Both</option>
//                             </select>
//                         </div>
//                         {answerType === 'text' || answerType === 'both' ? (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Answer Text</label>
//                                 <input
//                                     type="text"
//                                     value={answerText}
//                                     onChange={(e) => setAnswerText(e.target.value)}
//                                     className="mt-1 block w-full border border-gray-300 rounded p-2"
//                                 />
//                             </div>
//                         ) : null}
//                         {answerType === 'image' || answerType === 'both' ? (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Answer Image</label>
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={(e) => handleImageChange(e, setAnswerImage)}
//                                     className="mt-1 block w-full border border-gray-300 rounded p-2"
//                                 />
//                                 {answerImage && (
//                                     <img
//                                         src={URL.createObjectURL(answerImage)}
//                                         alt="Answer Preview"
//                                         className="mt-2 h-16 w-16 object-cover"
//                                     />
//                                 )}
//                             </div>
//                         ) : null}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Video Link</label>
//                             <input
//                                 type="text"
//                                 value={videoLink}
//                                 onChange={(e) => setVideoLink(e.target.value)}
//                                 className="mt-1 block w-full border border-gray-300 rounded p-2"
//                             />
//                         </div>
//                         <button
//                             type="submit"
//                             className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-2 px-4 rounded hover:from-green-500 hover:to-green-700"
//                         >
//                             {isEditMode ? 'Update Question' : 'Add Question'}
//                         </button>
//                     </form>
//                 </div>
//             </Modal>

//             <div className="mt-8">
//                 <h2 className="text-xl font-bold mb-4">Questions List</h2>
//                 {isFetchingQuestions ? (
//                     <p>Loading...</p>
//                 ) : (
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead>
//                             <tr>
//                                 <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
//                                 <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question Text</th>
//                                 <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question Image</th>
//                                 <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer Text</th>
//                                 <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer Image</th>
//                                 <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video Link</th>
//                                 <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {(questionsData?.questions || []).map((question:IQuestion, index:number) => (
//                                 <tr key={question._id}>
//                                     <td className="px-6 py-4 whitespace-nowrap">{question.order}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{question.questionText}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         {question.questionImage?.url ? (
//                                             <img
//                                                 src={question.questionImage.url}
//                                                 alt="Question"
//                                                 className="h-16 w-16 object-cover"
//                                             />
//                                         ) : null}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{question.answerText}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         {question.answerImage?.url ? (
//                                             <img
//                                                 src={question.answerImage.url}
//                                                 alt="Answer"
//                                                 className="h-16 w-16 object-cover"
//                                             />
//                                         ) : null}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         {question.videoLink ? (
//                                             <a href={question.videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
//                                                 {question.videoLink}
//                                             </a>
//                                         ) : null}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <button
//                                             onClick={() => handleEditQuestion(question._id)}
//                                             className="text-blue-600 hover:text-blue-800"
//                                         >
//                                             Edit
//                                         </button>
//                                         <button
//                                             onClick={() => handleDeleteQuestion(question._id)}
//                                             className="ml-4 text-red-600 hover:text-red-800"
//                                         >
//                                             Delete
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AddQuestionForm;
