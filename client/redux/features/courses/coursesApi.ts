

import { apiSlice } from "../api/apiSlice";

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "create-course",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "get-admin-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),


    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `delete-course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getUsersAllCourses: builder.query({
      query: () => ({
        url: "get-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCourseDetails: builder.query({
      query: (id: any) => ({
        url: `get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCourseContent: builder.query({
      query: (id) => ({
        url: `get-course-content/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    addNewQuestion: builder.mutation({
      query: ({ question, courseId, contentId }) => ({
        url: "add-question",
        body: {
          question,
          courseId,
          contentId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addAnswerInQuestion: builder.mutation({
      query: ({ answer, courseId, contentId, questionId }) => ({
        url: "add-answer",
        body: {
          answer,
          courseId,
          contentId,
          questionId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addReviewInCourse: builder.mutation({
      query: ({ review, rating, courseId }: any) => ({
        url: `add-review/${courseId}`,
        body: {
          review,
          rating,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addReplyInReview: builder.mutation({
      query: ({ comment, courseId, reviewId }: any) => ({
        url: `add-reply`,
        body: {
          comment,
          courseId,
          reviewId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addYearToCourse: builder.mutation({
      query: ({ courseId, year }) => ({
        url: `course/${courseId}/year`,
        method: "POST",
        body: { year },
        credentials: "include" as const,
      }),
    }),
    getYearToCourse: builder.query({
      query: ({ courseId }) => ({
        url: `course/${courseId}/years`,
        method: "GET",
        credentials: "include",
      }),
    }),
    editYearToCourse: builder.mutation({
      query: ({ courseId, yearId, year }) => ({
        url: `course/${courseId}/year/${yearId}`,
        method: 'PUT',
        body: { year },
        credentials: 'include',
      }),
    }),
    deleteYearToCourse: builder.mutation({
      query: ({ courseId, yearId }) => ({
        url: `course/${courseId}/year/${yearId}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
    addSubjectToYear: builder.mutation({
      query: ({ courseId, yearId, name }) => ({
        url: `course/${courseId}/year/${yearId}/subject`,
        method: 'POST',
        body: { name },
        credentials: 'include',
      }),
    }),
    getSubjectsToYear: builder.query({
      query: ({ courseId, yearId }) => ({
        url: `course/${courseId}/year/${yearId}/subjects`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
    editSubject: builder.mutation({
      query: ({ courseId, yearId, subjectId, name }) => ({
        url: `course/${courseId}/year/${yearId}/subject/${subjectId}`,
        method: 'PUT',
        body: { name },
        credentials: 'include',
      }),
    }),
    deleteSubject: builder.mutation({
      query: ({ courseId, yearId, subjectId }) => ({
        url: `course/${courseId}/year/${yearId}/subject/${subjectId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
    }),
    addQuestionToSubject: builder.mutation({
      query: ({ courseId, yearId, subjectId, questionText, answerText, videoLink, questionImage, answerImage }) => {
        const formData = new FormData();
        formData.append('questionText', questionText);
        formData.append('answerText', answerText);
        formData.append('videoLink', videoLink);
        if (questionImage) formData.append('questionImage', questionImage);
        if (answerImage) formData.append('answerImage', answerImage);

        return {
          url: `course/${courseId}/year/${yearId}/subject/${subjectId}/question`,
          method: 'POST',
          body: formData,
          credentials: 'include',
        };
      },
    }),

    getQuestionsToSubject: builder.query({
      query: ({ courseId, yearId, subjectId }) => ({
        url: `course/${courseId}/year/${yearId}/subject/${subjectId}/questions`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
    // updateQuestionInSubject: builder.mutation({
    //   query: ({ courseId, yearId, subjectId, questionId, text, answers }) => ({
    //     url: `course/${courseId}/year/${yearId}/subject/${subjectId}/question/${questionId}`,
    //     method: 'PUT',
    //     body: { text, answers },
    //     credentials: 'include',
    //   }),
    // }),

    updateQuestionInSubject: builder.mutation({
      query: ({ courseId, yearId, subjectId, questionId, questionText, answerText, videoLink, questionImage, answerImage }) => {
        const formData = new FormData();
        formData.append('questionText', questionText);
        formData.append('answerText', answerText);
        formData.append('videoLink', videoLink);
        if (questionImage) {
          formData.append('questionImage', questionImage);
        }
        if (answerImage) {
          formData.append('answerImage', answerImage);
        }

        return {
          url: `course/${courseId}/year/${yearId}/subject/${subjectId}/question/${questionId}`,
          method: 'PUT',
          body: formData,
          credentials: 'include',
        };
      },
    }),


    deleteQuestion: builder.mutation({
      query: ({ courseId, yearId, subjectId, questionId }) => ({
        url: `course/${courseId}/year/${yearId}/subject/${subjectId}/question/${questionId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
    }),
    reorderQuestions: builder.mutation({
      query: ({ courseId, yearId, subjectId, orderedQuestions }) => ({
        url: `/courses/${courseId}/years/${yearId}/subjects/${subjectId}/questions/reorder`,
        method: 'PATCH',
        body: { orderedQuestions },
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useEditCourseMutation,
  useGetUsersAllCoursesQuery,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
  useAddNewQuestionMutation,
  useAddAnswerInQuestionMutation,
  useAddReviewInCourseMutation,
  useAddReplyInReviewMutation,
  useAddYearToCourseMutation,
  useEditYearToCourseMutation,
  useDeleteYearToCourseMutation,
  useGetYearToCourseQuery,
  useAddSubjectToYearMutation,
  useGetSubjectsToYearQuery,
  useEditSubjectMutation,
  useDeleteSubjectMutation,
  useAddQuestionToSubjectMutation,
  useUpdateQuestionInSubjectMutation,
  useDeleteQuestionMutation,
  useGetQuestionsToSubjectQuery,
  useReorderQuestionsMutation
} = coursesApi;
