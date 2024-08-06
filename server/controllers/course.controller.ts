


import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";

import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import CourseModel, { ISubject } from "../models/course.model";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.Model";
import axios from "axios";
import { IYear, IQuestion } from "../models/course.model";
import { FileArray } from 'express-fileupload';

const extractVideoId = (url: string): string | null => {
  let videoId = null;
  const youtubePatterns = [
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  ];
  const vimeoPattern = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/;

  for (let pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }

  if (!videoId) {
    const match = url.match(vimeoPattern);
    if (match && match[1]) {
      videoId = match[1];
    }
  }

  return videoId;
};




export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      // Check if thumbnail is a string
      if (thumbnail && typeof thumbnail === 'string') {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }


      // Remove `years` from the data before creating the course
      const { years, ...courseData } = data;

      // Create the course with the processed data
      const course = await CourseModel.create(courseData);



      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);



// Adding a Year to a Course Main

// export const AddYeartoCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const courseId = req.params.courseId;
//     const { year } = req.body;

//     if (!courseId || !year) {
//       return res.status(400).json({ success: false, message: 'Course ID and year are required' });
//     }

//     const course = await CourseModel.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }

//     // Check if year already exists
//     const yearExists = course.years.some(y => y.year === year);
//     if (yearExists) {
//       return res.status(400).json({ success: false, message: 'Year already exists' });
//     }

//     // Add the new year
//     course.years.push({ year, subjects: [] });
//     await course.save();

//     res.status(201).json({ success: true, course });
//   } catch (error: any) {
//     return next(new ErrorHandler(error.message, 500));
//   }
// })
export const AddYeartoCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year, subjects } = req.body;
    const newYear = { year, subjects }; // Ensure this matches IYear
    const course = await CourseModel.findById(req.params.courseId);
    if (!course) return res.status(404).send('Course not found');
    course.years.push(newYear as any); // Cast to 'any' if TypeScript complains
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('An unknown error occurred');
    }
  }
};


// //adding year to a course
// export const AddYeartoCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const courseId = req.params.courseId;
//     const { year } = req.body;

//     if (!courseId || !year) {
//       return res.status(400).json({ success: false, message: 'Course ID and year are required' });
//     }

//     const course = await CourseModel.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }

//     const yearExists = course.years.some(y => y.year === year);
//     if (yearExists) {
//       return res.status(400).json({ success: false, message: 'Year already exists' });
//     }

//     const newYear: IYear = new mongoose.Types.ObjectId() as any;
//     Object.assign(newYear, { year, subjects: [] });

//     course.years.push(newYear);
//     await course.save();

//     res.status(201).json({ success: true, course });
//   } catch (error: any) {
//     return next(new ErrorHandler(error.message, 500));
//   }
// });
//get the year
export const GetYearsOfCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = req.params.courseId;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Course ID is required' });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const years = course.years.map(year => ({ _id: year._id, year: year.year }));

    res.status(200).json({ success: true, years });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};


// Edit Year main
// export const EditYear = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { courseId, yearId } = req.params;
//     const { year } = req.body;

//     if (!year) {
//       return res.status(400).json({ success: false, message: 'Year is required' });
//     }

//     const course = await CourseModel.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }

//     const yearToEdit = course.years.id(yearId);
//     if (!yearToEdit) {
//       return res.status(404).json({ success: false, message: 'Year not found' });
//     }

//     yearToEdit.year = year;
//     await course.save();

//     res.status(200).json({ success: true, course });
//   } catch (error: any) {
//     return next(new ErrorHandler(error.message, 500));
//   }
// });



export const EditYear = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId } = req.params;
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({ success: false, message: 'Year is required' });
    }

    // Find the course by ID
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Find the year to edit
    const yearToEdit = course.years.find(y => y._id.toString() === yearId);
    if (!yearToEdit) {
      return res.status(404).json({ success: false, message: 'Year not found' });
    }

    // Update the year
    yearToEdit.year = year;
    await course.save();

    res.status(200).json({ success: true, course });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});


// Delete Year main
// export const DeleteYear = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { courseId, yearId } = req.params;

//     const course = await CourseModel.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }

//     const yearToDelete = course.years.id(yearId);
//     if (!yearToDelete) {
//       return res.status(404).json({ success: false, message: 'Year not found' });
//     }

//     course.years.pull(yearToDelete._id);
//     await course.save();

//     res.status(200).json({ success: true, course });
//   } catch (error: any) {
//     return next(new ErrorHandler(error.message, 500));
//   }
// });




export const DeleteYear = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId } = req.params;

    // Find the course by ID
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Find the year to delete
    const yearToDelete = course.years.find(y => y._id.toString() === yearId);
    if (!yearToDelete) {
      return res.status(404).json({ success: false, message: 'Year not found' });
    }

    // Remove the year from the array
    course.years = course.years.filter(y => y._id.toString() !== yearId);
    await course.save();

    res.status(200).json({ success: true, course });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Adding a Subject to a Year main


// export const AddSubjectToYear = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

//   try {
//     const { courseId, yearId } = req.params;
//     const { name } = req.body;

//     if (!name) {
//       return res.status(400).json({ success: false, message: "Subject name is required" });
//     }

//     const course = await CourseModel.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     const year = course.years.id(yearId);
//     if (!year) {
//       return res.status(404).json({ success: false, message: "Year not found" });
//     }

//     year.subjects.push({ name, questions: [] });
//     await course.save();

//     res.status(201).json({ success: true, course });
//   } catch (error: any) {
//     return next(new ErrorHandler(error.message, 500));
//   }
// })


export const AddSubjectToYear = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Subject name is required" });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Find the year document in the array manually
    const year = course.years.find((y) => y._id.toString() === yearId);
    if (!year) {
      return res.status(404).json({ success: false, message: "Year not found" });
    }

    // Create a new subject instance using the schema
    const SubjectModel = mongoose.model('Subject', CourseModel.schema.paths.years.schema.paths.subjects.schema);
    const newSubject = new SubjectModel({
      name,
      questions: []
    });

    // Push the new subject to the year
    year.subjects.push(newSubject as any); // Type assertion to bypass TypeScript error

    // Save the updated course
    await course.save();

    res.status(201).json({ success: true, course });
  } catch (error: any) {
    console.error(error); // Improved error logging
    return next(new ErrorHandler(error.message, 500));
  }
});
// Edit Subject main
// export const EditSubject = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { courseId, yearId, subjectId } = req.params;
//     const { name } = req.body;

//     if (!name) {
//       return res.status(400).json({ success: false, message: 'Subject name is required' });
//     }

//     const course = await CourseModel.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }

//     const year = course.years.id(yearId);
//     if (!year) {
//       return res.status(404).json({ success: false, message: 'Year not found' });
//     }

//     const subjectToEdit = year.subjects.id(subjectId);
//     if (!subjectToEdit) {
//       return res.status(404).json({ success: false, message: 'Subject not found' });
//     }

//     subjectToEdit.name = name;
//     await course.save();

//     res.status(200).json({ success: true, course });
//   } catch (error: any) {
//     return next(new ErrorHandler(error.message, 500));
//   }
// });




export const EditSubject = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId, subjectId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Subject name is required' });
    }

    // Find the course by ID
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Find the specific year within the course
    const year = course.years.find(y => y._id.toString() === yearId);
    if (!year) {
      return res.status(404).json({ success: false, message: 'Year not found' });
    }

    // Find the specific subject within the year
    const subjectToEdit = year.subjects.find(s => s._id.toString() === subjectId);
    if (!subjectToEdit) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    // Update the subject name
    subjectToEdit.name = name;

    // Save the updated course
    await course.save();

    res.status(200).json({ success: true, course });
  } catch (error: any) {
    console.error(error); // Improved error logging
    return next(new ErrorHandler(error.message, 500));
  }
});





// Delete Subject main
// export const DeleteSubject = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { courseId, yearId, subjectId } = req.params;

//     const course = await CourseModel.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }

//     const year = course.years.id(yearId);
//     if (!year) {
//       return res.status(404).json({ success: false, message: 'Year not found' });
//     }

//     const subjectToDelete = year.subjects.id(subjectId);
//     if (!subjectToDelete) {
//       return res.status(404).json({ success: false, message: 'Subject not found' });
//     }

//     year.subjects.pull(subjectToDelete._id);
//     await course.save();

//     res.status(200).json({ success: true, course });
//   } catch (error: any) {
//     return next(new ErrorHandler(error.message, 500));
//   }
// });


export const DeleteSubject = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId, subjectId } = req.params;

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Find the year document in the array manually
    const year = course.years.find((y: IYear) => y._id.toString() === yearId);
    if (!year) {
      return res.status(404).json({ success: false, message: 'Year not found' });
    }

    const subjectIndex = year.subjects.findIndex(s => s._id.toString() === subjectId);
    if (subjectIndex === -1) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    // Remove the subject from the array
    year.subjects.splice(subjectIndex, 1);
    await course.save();

    res.status(200).json({ success: true, course });
  } catch (error: any) {
    console.error(error);
    return next(new ErrorHandler(error.message, 500));
  }
});



export const GetAllSubjects = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId } = req.params;

    console.log("courseId:", courseId);
    console.log("yearId:", yearId);

    // Fetch the course and its years and subjects
    const course = await CourseModel.findById(courseId)
      .populate({
        path: 'years',
        match: { _id: yearId },
        populate: {
          path: 'subjects',
        },
      });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const year = course.years.find((year) => year._id.toString() === yearId);
    if (!year) {
      return res.status(404).json({ success: false, message: 'Year not found' });
    }

    res.status(200).json({
      success: true,
      subjects: year.subjects,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }


});



  //add question main
// export const AddQuestToSubject = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { courseId, yearId, subjectId } = req.params;
//     const { questionText, answerText, videoLink } = req.body;
//     const questionImage = req.files?.questionImage;
//     const answerImage = req.files?.answerImage;

//     let questionImageUrl = null;
//     let questionImagePublicId = null;
//     if (questionImage) {
//       const result = await cloudinary.v2.uploader.upload((questionImage as any).tempFilePath, {
//         folder: 'questions',
//       });
//       questionImageUrl = result.secure_url;
//       questionImagePublicId = result.public_id;
//     }

//     let answerImageUrl = null;
//     let answerImagePublicId = null;
//     if (answerImage) {
//       const result = await cloudinary.v2.uploader.upload((answerImage as any).tempFilePath, {
//         folder: 'answers',
//       });
//       answerImageUrl = result.secure_url;
//       answerImagePublicId = result.public_id;
//     }

//     const videoId = videoLink ? extractVideoId(videoLink) : null;

//     const course = await CourseModel.findById(courseId)
//       .populate({
//         path: 'years.subjects',
//         populate: {
//           path: 'questions'
//         }
//       });

//     if (!course) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     const year = course.years.id(yearId);
//     if (!year) {
//       return res.status(404).json({ success: false, message: "Year not found" });
//     }

//     const subject = year.subjects.id(subjectId);
//     if (!subject) {
//       return res.status(404).json({ success: false, message: `Subject not found with ID: ${subjectId}` });
//     }

//     subject.questions.push({
//       questionText,
//       questionImage: {
//         url: questionImageUrl,
//         public_id: questionImagePublicId,
//       },
//       answerText,
//       answerImage: {
//         url: answerImageUrl,
//         public_id: answerImagePublicId,
//       },
//       videoLink,
//       videoId,
//     });
//     await course.save();

//     res.status(201).json({
//       success: true,
//       course,
//       uploadedImages: {
//         question: questionImageUrl || null,
//         answers: answerImageUrl || null
//       }
//     });

//   } catch (error: any) {
//     console.error(error);
//     return next(new ErrorHandler(error.message, 500));
//   }
// });

export const AddQuestToSubject = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId, subjectId } = req.params;
    const { questionText, answerText, videoLink } = req.body;
    const questionImage = req.files?.questionImage;
    const answerImage = req.files?.answerImage;

    let questionImageUrl: string | null = null;
    let questionImagePublicId: string | null = null;
    if (questionImage) {
      const result = await cloudinary.v2.uploader.upload((questionImage as any).tempFilePath, {
        folder: 'questions',
        transformation: [
          { width: 800, height: 600, crop: 'limit', quality: 'auto', format: 'auto', }, // Optimize image size and quality
        ],
      });
      questionImageUrl = result.secure_url;
      questionImagePublicId = result.public_id;
    }

    let answerImageUrl: string | null = null;
    let answerImagePublicId: string | null = null;
    if (answerImage) {
      const result = await cloudinary.v2.uploader.upload((answerImage as any).tempFilePath, {
        folder: 'answers',
        transformation: [
          { width: 800, height: 600, crop: 'limit', quality: 'auto',format:'auto', }, // Optimize image size and quality
        ],
      });
      answerImageUrl = result.secure_url;
      answerImagePublicId = result.public_id;
    }

    const videoId = videoLink ? extractVideoId(videoLink) : null;

    const course = await CourseModel.findById(courseId)
      .populate({
        path: 'years.subjects',
        populate: {
          path: 'questions'
        }
      });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const year = (course.years as IYear[]).find(y => y._id.toString() === yearId);
    if (!year) {
      return res.status(404).json({ success: false, message: "Year not found" });
    }

    const subject = (year.subjects as ISubject[]).find(sub => sub._id.toString() === subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: `Subject not found with ID: ${subjectId}` });
    }

    // Create a new question document using the Question model
    const newQuestion = {
      questionText,
      questionImage: {
        url: questionImageUrl || '',
        public_id: questionImagePublicId || '',
      },
      answerText,
      answerImage: {
        url: answerImageUrl || '',
        public_id: answerImagePublicId || '',
      },
      videoLink,
      videoId,
    };

    subject.questions.push(newQuestion as any); // Casting to `any` to bypass TypeScript error

    await course.save();

    res.status(201).json({
      success: true,
      course,
      uploadedImages: {
        question: questionImageUrl || null,
        answers: answerImageUrl || null
      }
    });

  } catch (error: any) {
    console.error(error);
    return next(new ErrorHandler(error.message, 500));
  }
});

// export const AddQuestToSubject = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { courseId, yearId, subjectId } = req.params;
//     const { questionText, answerText, videoLink } = req.body;
//     const files = req.files as FileArray;
//     const questionImage = files?.questionImage;
//     const answerImage = files?.answerImage;

//     let questionImageUrl: string | null = null;
//     let questionImagePublicId: string | null = null;
//     if (questionImage && (questionImage as any).tempFilePath) {
//       const result = await cloudinary.v2.uploader.upload((questionImage as any).tempFilePath, {
//         folder: 'questions',
//       });
//       questionImageUrl = result.secure_url;
//       questionImagePublicId = result.public_id;
//     }

//     let answerImageUrl: string | null = null;
//     let answerImagePublicId: string | null = null;
//     if (answerImage && (answerImage as any).tempFilePath) {
//       const result = await cloudinary.v2.uploader.upload((answerImage as any).tempFilePath, {
//         folder: 'answers',
//       });
//       answerImageUrl = result.secure_url;
//       answerImagePublicId = result.public_id;
//     }

//     const videoId = videoLink ? extractVideoId(videoLink) : null;

//     const course = await CourseModel.findById(courseId)
//       .populate({
//         path: 'years.subjects',
//         populate: {
//           path: 'questions'
//         }
//       });

//     if (!course) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     const year = (course.years as IYear[]).find(y => y._id.toString() === yearId);
//     if (!year) {
//       return res.status(404).json({ success: false, message: "Year not found" });
//     }

//     const subject = (year.subjects as ISubject[]).find(sub => sub._id.toString() === subjectId);
//     if (!subject) {
//       return res.status(404).json({ success: false, message: `Subject not found with ID: ${subjectId}` });
//     }

//     // Create and add new question
//     const newQuestion = {
//       questionText,
//       questionImage: {
//         url: questionImageUrl || '',
//         public_id: questionImagePublicId || '',
//       },
//       answerText,
//       answerImage: {
//         url: answerImageUrl || '',
//         public_id: answerImagePublicId || '',
//       },
//       videoLink,
//       videoId: videoId || undefined,
//       order: 0,
//     };

//     subject.questions.push(newQuestion as any);
//     await course.save();


  

//     res.status(201).json({
//       success: true,
//       course,
//       uploadedImages: {
//         question: questionImageUrl || null,
//         answers: answerImageUrl || null
//       }
//     });

//   } catch (error: any) {
//     console.error(error);
//     return next(new ErrorHandler(error.message, 500));
//   }
// });


export const GetQuestions = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId, subjectId } = req.params;

    // Fetch the course
    const course = await CourseModel.findById(courseId)
      .populate({
        path: 'years',
        match: { _id: yearId },
        populate: {
          path: 'subjects',
          match: { _id: subjectId },
          populate: {
            path: 'questions',
          },
        },
      });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const year = course.years.find((y) => y._id.toString() === yearId);
    if (!year) {
      return res.status(404).json({ success: false, message: 'Year not found' });
    }

    const subject = year.subjects.find((s) => s._id.toString() === subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const questions = subject.questions.map((question) => ({
      _id: question._id,
      questionText: question.questionText,
      questionImage: question.questionImage,
      answerText: question.answerText,
      answerImage: question.answerImage,
      videoLink: question.videoLink,
      videoId: question.videoId,
    }));

    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error: any) {
    console.error(error);
    return next(new ErrorHandler(error.message, 500));
  }
});



export const UpdateQuestInSubject = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId, subjectId, questionId } = req.params;
    const { questionText, answerText, videoLink } = req.body;
    const questionImage = req.files?.questionImage;
    const answerImage = req.files?.answerImage;

    let questionImageUrl: string | null = null;
    let questionImagePublicId: string | null = null;
    if (questionImage) {
      const result = await cloudinary.v2.uploader.upload((questionImage as any).tempFilePath, {
        folder: 'questions',
      });
      questionImageUrl = result.secure_url;
      questionImagePublicId = result.public_id;
    }

    let answerImageUrl: string | null = null;
    let answerImagePublicId: string | null = null;
    if (answerImage) {
      const result = await cloudinary.v2.uploader.upload((answerImage as any).tempFilePath, {
        folder: 'answers',
      });
      answerImageUrl = result.secure_url;
      answerImagePublicId = result.public_id;
    }

    const course = await CourseModel.findById(courseId)
      .populate({
        path: 'years.subjects.questions',
      });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const year = course.years.find(y => y._id.toString() === yearId);
    if (!year) {
      return res.status(404).json({ success: false, message: 'Year not found' });
    }

    const subject = year.subjects.find(s => s._id.toString() === subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const question = subject.questions.find(q => q._id.toString() === questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Update the question fields
    question.questionText = questionText || question.questionText;
    question.answerText = answerText || question.answerText;
    question.videoLink = videoLink || question.videoLink;

    if (questionImageUrl) {
      question.questionImage.url = questionImageUrl;
      question.questionImage.public_id = questionImagePublicId as string; // Type assertion
    }

    if (answerImageUrl) {
      question.answerImage.url = answerImageUrl;
      question.answerImage.public_id = answerImagePublicId as string; // Type assertion
    }

    // Save the updated course
    await course.save();

    res.status(200).json({ success: true, question });
  } catch (error: any) {
    console.error(error);
    return next(new ErrorHandler(error.message, 500));
  }
});

//delete question of subjects
export const DeleteQuestFromSubject = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId, subjectId, questionId } = req.params;

    // Fetch the course with populated sub-documents
    const course = await CourseModel.findById(courseId)
      .populate({
        path: 'years.subjects',
        populate: {
          path: 'questions'
        }
      });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Find the specific year within the course
    const year = course.years.find(y => y._id.toString() === yearId);
    if (!year) {
      return res.status(404).json({ success: false, message: "Year not found" });
    }

    // Find the specific subject within the year
    const subject = year.subjects.find(s => s._id.toString() === subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: `Subject not found with ID: ${subjectId}` });
    }

    // Find the specific question within the subject
    const question = subject.questions.find(q => q._id.toString() === questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: `Question not found with ID: ${questionId}` });
    }

    // Remove the question
    subject.questions = subject.questions.filter(q => q._id.toString() !== questionId);

    // Save the updated course
    await course.save();

    res.status(200).json({
      success: true,
      message: `Question with ID ${questionId} successfully deleted.`
    });

  } catch (error: any) {
    console.error(error); // Improved error logging
    return next(new ErrorHandler(error.message, 500));
  }
});



export const DeleteQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId, subjectId, questionId } = req.params;

    // Fetch the course with populated sub-documents
    const course = await CourseModel.findById(courseId).populate({
      path: 'years.subjects.questions',
    });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Find the specific year within the course
    const year = course.years.find(y => y._id.toString() === yearId);
    if (!year) {
      return res.status(404).json({ success: false, message: "Year not found" });
    }

    // Find the specific subject within the year
    const subject = year.subjects.find(s => s._id.toString() === subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    // Find the specific question within the subject
    const question = subject.questions.find(q => q._id.toString() === questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    // Remove the question from the subject's questions array
    subject.questions = subject.questions.filter(q => q._id.toString() !== questionId);

    // Save the updated course
    await course.save();

    res.status(200).json({ success: true, message: "Question deleted successfully" });
  } catch (error: any) {
    console.error(error);
    return next(new ErrorHandler(error.message, 500));
  }
});

// export const DeleteQuestFromSubject = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { courseId, yearId, subjectId, questionId } = req.params;

//     // Fetch the course
//     const course = await CourseModel.findById(courseId)
//       .populate({
//         path: 'years.subjects',
//         populate: {
//           path: 'questions'
//         }
//       });

//     if (!course) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     // Find the year
//     const year = course.years.find(y => y._id.toString() === yearId);
//     if (!year) {
//       return res.status(404).json({ success: false, message: "Year not found" });
//     }

//     // Find the subject
//     const subject = year.subjects.find(sub => sub._id.toString() === subjectId);
//     if (!subject) {
//       return res.status(404).json({ success: false, message: `Subject not found with ID: ${subjectId}` });
//     }

//     // Find and remove the question
//     const questionIndex = subject.questions.findIndex(q => q._id.toString() === questionId);
//     if (questionIndex === -1) {
//       return res.status(404).json({ success: false, message: `Question not found with ID: ${questionId}` });
//     }

//     subject.questions.splice(questionIndex, 1); // Remove the question

//     await course.save();

//     res.status(200).json({
//       success: true,
//       message: `Question with ID ${questionId} successfully deleted.`
//     });

//   } catch (error: any) {
//     console.error(error); // Improved error logging
//     return next(new ErrorHandler(error.message, 500));
//   }
// });
// // Question Reorder

// export const QuestionReorder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//   const { courseId, yearId, subjectId } = req.params;
//   const { orderedQuestions } = req.body; // Array of question IDs in the new order

//   try {
//     // Find the course by ID
//     const course = await CourseModel.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     // Find the year by ID
//     const year = course.years.id(yearId);
//     if (!year) {
//       return res.status(404).json({ message: 'Year not found' });
//     }

//     // Find the subject by ID
//     const subject = year.subjects.id(subjectId);
//     if (!subject) {
//       return res.status(404).json({ message: 'Subject not found' });
//     }

//     // Reorder questions based on the new order
//     const questionMap = new Map(subject.questions.map(question => [question._id.toString(), question]));
//     subject.questions = orderedQuestions.map(questionId => questionMap.get(questionId)).filter(Boolean);

//     // Save the updated course
//     await course.save();

//     res.status(200).json({ message: 'Questions reordered successfully' });
//   } catch (error) {
//     console.error('Error reordering questions:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });


export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const courseId = req.params.id;
      const courseData = await CourseModel.findById(courseId) as any;

      const thumbnail = data.thumbnail;

      // If a new thumbnail is provided
      if (thumbnail && typeof thumbnail === 'string' && !thumbnail.startsWith("http")) {
        // Destroy the old image if exists
        if (courseData.thumbnail.public_id) {
          await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);
        }

        // Upload the new thumbnail
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } else {
        // Preserve the existing thumbnail if not updated
        data.thumbnail = courseData.thumbnail;
      }

      // Update the course data in the database
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );

      // Update the course in Redis (optional, ensure you have Redis setup correctly)
      // await redis.set(courseId, JSON.stringify(course)); 

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get single course --- without purchasing
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      //at a minute if 100000 people visit the course and details so 100000 hit generate but among them 20 people buy course so our server slows down so maintain this CacheExists code will written
      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all courses --- without purchasing
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get course content -- only for valid user
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not eligible to access this course", 404)
        );
      }

      const course = await CourseModel.findById(courseId);

      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add question in course
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const couseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!couseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      // create a new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // add this question to our course content
      couseContent.questions.push(newQuestion);

      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question Received",
        message: `You have a new question in ${couseContent.title}`,
      });

      // save the updated course
      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add answer in course question
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnwser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;

      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const couseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!couseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const question = couseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );

      if (!question) {
        return next(new ErrorHandler("Invalid question id", 400));
      }

      // create a new answer object
      const newAnswer: any = {
        user: req.user,
        answer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // add this answer to our course content
      question.questionReplies.push(newAnswer);

      await course?.save();

      if (req.user?._id === question.user._id) {
        // create a notification
        await NotificationModel.create({
          user: req.user?._id,
          title: "New Question Reply Received",
          message: `You have a new question reply in ${couseContent.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: couseContent.title,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add review in course
interface IAddReviewData {
  review: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;

      const courseId = req.params.id;

      // check if courseId already exists in userCourseList based on _id

      const courseExists = userCourseList?.some(
        (course: any) => course._id.toString() === courseId.toString()
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not eligible to access this course", 404)
        );
      }

      const course = await CourseModel.findById(courseId);

      const { review, rating } = req.body as IAddReviewData;

      const reviewData: any = {
        user: req.user,
        rating,
        comment: review,
      };

      course?.reviews.push(reviewData);

      let avg = 0;

      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });

      if (course) {
        course.ratings = avg / course.reviews.length; // one example we have 2 reviews one is 5 another one is 4 so math working like this = 9 / 2  = 4.5 ratings
      }

      await course?.save();

      await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

      // create notification
      await NotificationModel.create({
        user: req.user?._id,
        title: "New Review Received",
        message: `${req.user?.name} has given a review in ${course?.name}`,
      });


      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add reply in review
interface IAddReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}
export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewData;

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() === reviewId
      );

      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }

      const replyData: any = {
        user: req.user,
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }

      review.commentReplies?.push(replyData);

      await course?.save();

      await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all courses --- only for admin
export const getAdminAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete Course --- only for admin
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const course = await CourseModel.findById(id);

      if (!course) {
        return next(new ErrorHandler("course not found", 404));
      }

      await course.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// generate video url
export const generateVideoUrl = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;

      //For videmo video

      // const {videoUrl}=req.body
      // const videoId=videoUrl.split("/").pop()

      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        { ttl: 300 },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VIMEO_API_SECRET}`,
          },
        }
      );
      res.json(response.data);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
