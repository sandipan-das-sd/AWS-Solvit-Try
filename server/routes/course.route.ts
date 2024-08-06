// import express from "express";
// import {
//   addAnwser,
//   addQuestion,
//   addReplyToReview,
//   addReview,
//   deleteCourse,
//   editCourse,
//   generateVideoUrl,
//   getAdminAllCourses,
//   getAllCourses,
//   getCourseByUser,
//   getSingleCourse,
//   uploadCourse,
// } from "../controllers/course.controller";
// import { authorizeRoles, isAutheticated } from "../middleware/auth";
// const courseRouter = express.Router();

// courseRouter.post(
//   "/create-course",
//   isAutheticated,
//   authorizeRoles("admin"),
//   uploadCourse
// );

// courseRouter.put(
//   "/edit-course/:id",
//   isAutheticated,
//   authorizeRoles("admin"),
//   editCourse
// );

// courseRouter.get("/get-course/:id", getSingleCourse);

// courseRouter.get("/get-courses", getAllCourses);

// courseRouter.get(
//   "/get-admin-courses",
//   isAutheticated,
//   authorizeRoles("admin"),
//   getAdminAllCourses
// );

// courseRouter.get("/get-course-content/:id", isAutheticated, getCourseByUser);

// courseRouter.put("/add-question", isAutheticated, addQuestion);

// courseRouter.put("/add-answer", isAutheticated, addAnwser);

// courseRouter.put("/add-review/:id", isAutheticated, addReview);

// courseRouter.put(
//   "/add-reply",
//   isAutheticated,
//   authorizeRoles("admin"),
//   addReplyToReview
// );



// courseRouter.post("/getVdoCipherOTP", generateVideoUrl);

// courseRouter.delete(
//   "/delete-course/:id",
//   isAutheticated,
//   authorizeRoles("admin"),
//   deleteCourse
// );

// export default courseRouter;





import express from "express";
import {
  addAnwser,
  addQuestion,
  AddQuestToSubject,
  addReplyToReview,
  addReview,
  AddSubjectToYear,
  AddYeartoCourse,
  deleteCourse,
  editCourse,
  generateVideoUrl,
  getAdminAllCourses,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
  EditYear,
  DeleteYear,
  EditSubject,
  DeleteSubject,
 
  DeleteQuestion,
  UpdateQuestInSubject,
  GetYearsOfCourse,
  GetAllSubjects,
  GetQuestions,
 
 
} from "../controllers/course.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";

import { uploadImage } from "../services/course.service";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAutheticated,
  authorizeRoles("admin"),
  uploadCourse
);

//add year to course
courseRouter.post(
  "/course/:courseId/year",
  isAutheticated,
  authorizeRoles("admin"),
  (req, res, next) => {
    console.log("Route hit!");
    next();
  },
  AddYeartoCourse);

//get the year
  

courseRouter.get("/course/:courseId/years", isAutheticated, authorizeRoles("admin"), GetYearsOfCourse);


//add subject to year
courseRouter.post(
  "/course/:courseId/year/:yearId/subject",
  isAutheticated,
  authorizeRoles("admin"),
  AddSubjectToYear)

//Add question to subject
courseRouter.post(
  "/course/:courseId/year/:yearId/subject/:subjectId/question",
  isAutheticated,
  AddQuestToSubject,
  uploadImage,
  authorizeRoles("admin"),
)

// Update a question
courseRouter.put(
  "/course/:courseId/year/:yearId/subject/:subjectId/question/:questionId",
  isAutheticated,
  uploadImage, // Ensure this middleware is only used when you are uploading images
  authorizeRoles("admin"),
UpdateQuestInSubject
);

// Delete a question
courseRouter.delete(
  "/course/:courseId/year/:yearId/subject/:subjectId/question/:questionId",
  isAutheticated,
  authorizeRoles("admin"),
  DeleteQuestion
);
courseRouter.put(
  "/course/:courseId/year/:yearId",
  isAutheticated,
  authorizeRoles("admin"),
  EditYear
);

courseRouter.delete(
  "/course/:courseId/year/:yearId",
  isAutheticated,
  authorizeRoles("admin"),
  DeleteYear
);

courseRouter.put(
  "/course/:courseId/year/:yearId/subject/:subjectId",
  isAutheticated,
  authorizeRoles("admin"),
  EditSubject
);

courseRouter.delete(
  "/course/:courseId/year/:yearId/subject/:subjectId",
  isAutheticated,
  authorizeRoles("admin"),
  DeleteSubject
);

courseRouter.get(
  "/course/:courseId/year/:yearId/subjects",
  isAutheticated,
  authorizeRoles("admin"),
 GetAllSubjects
);

//get question
courseRouter.get('/course/:courseId/year/:yearId/subject/:subjectId/questions', isAutheticated, authorizeRoles("admin"), GetQuestions);
//delete question
courseRouter.delete(
  "/course/:courseId/year/:yearId/subject/:subjectId/question/:questionId",
  isAutheticated,
  authorizeRoles("admin"),
  DeleteQuestion
);
//reorder question

// Reorder questions route
// courseRouter.patch('/:courseId/years/:yearId/subjects/:subjectId/questions/reorder', QuestionReorder);
// //
courseRouter.put(
  "/edit-course/:id",
  isAutheticated,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.get(
  "/get-admin-courses",
  isAutheticated,
  authorizeRoles("admin"),
  getAdminAllCourses
);

courseRouter.get("/get-course-content/:id", isAutheticated, getCourseByUser);

courseRouter.put("/add-question", isAutheticated, addQuestion);

courseRouter.put("/add-answer", isAutheticated, addAnwser);

courseRouter.put("/add-review/:id", isAutheticated, addReview);

courseRouter.put(
  "/add-reply",
  isAutheticated,
  authorizeRoles("admin"),
  addReplyToReview
);

courseRouter.post("/getVdoCipherOTP", generateVideoUrl);

courseRouter.delete(
  "/delete-course/:id",
  isAutheticated,
  authorizeRoles("admin"),
  deleteCourse
);

export default courseRouter;
