"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPayment = exports.sendStripePublishableKey = exports.getAllOrders = exports.createOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const notification_Model_1 = __importDefault(require("../models/notification.Model"));
const order_service_1 = require("../services/order.service");
const redis_1 = require("../utils/redis");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// create order
// export const createOrder = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { courseId, payment_info } = req.body as IOrder;
//       const user = await userModel.findById(req.user?._id);
//       if (!user) {
//         return next(new ErrorHandler("User not found", 404));
//       }
//       const courseExistInUser = user.courses.some(
//         (course: any) => course.courseId.toString() === courseId
//       );
//       if (courseExistInUser) {
//         return next(new ErrorHandler("You have already purchased this course", 400));
//       }
//       const course: ICourse | null = await CourseModel.findById(courseId);
//       if (!course) {
//         return next(new ErrorHandler("Course not found", 404));
//       }
//       const data: any = {
//         courseId: course._id.toString(),
//         userId: user._id.toString(),
//         payment_info,
//       };
//       const mailData = {
//         order: {
//           _id: course._id.toString().slice(0, 6),
//           name: course.name,
//           tag:course.tags,
//           price: course.price,
//           date: new Date().toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           }),
//         },
//       };
//       const html = await ejs.renderFile(
//         path.join(__dirname, "../mails/order-confirmation.ejs"),
//         { order: mailData }
//       );
//       try {
//         if (user) {
//           await sendMail({
//             email: user.email,
//             subject: "Order Confirmation",
//             template: "order-confirmation.ejs",
//             data: mailData,
//           });
//         }
//       } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//       }
//       user.courses.push({ courseId: course._id.toString() });
//       const userId = req.user?._id?.toString();
//       if (userId) {
//         await redis.set(userId, JSON.stringify(user));
//       } else {
//         return next(new ErrorHandler("User ID is missing", 400));
//       }
//       await user.save();
//       await NotificationModel.create({
//         user: user._id,
//         title: "New Order",
//         message: `You have a new order from ${course.name}`,
//       });
//       course.purchased += 1;
//       await course.save();
//       newOrder(data, res, next);
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );
exports.createOrder = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { courseId, payment_info } = req.body;
        // Check if req.user is properly populated
        if (!req.user) {
            return next(new ErrorHandler_1.default("User not authenticated", 401));
        }
        const user = await user_model_1.default.findById(req.user._id);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        // Check if courseId is valid and find the course
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        // Debugging output
        console.log("Course ID:", course._id.toString());
        console.log("User ID:", user._id.toString());
        // Ensure payment_info is not undefined
        if (!payment_info) {
            return next(new ErrorHandler_1.default("Payment info is missing", 400));
        }
        const data = {
            courseId: course._id.toString(),
            userId: user._id.toString(),
            payment_info,
        };
        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6),
                name: course.name,
                tag: course.tags,
                price: course.price,
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            },
        };
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/order-confirmation.ejs"), { order: mailData });
        try {
            if (user) {
                await (0, sendMail_1.default)({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                });
            }
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        user.courses.push({ courseId: course._id.toString() });
        const userId = req.user._id?.toString();
        if (userId) {
            await redis_1.redis.set(userId, JSON.stringify(user));
        }
        else {
            return next(new ErrorHandler_1.default("User ID is missing", 400));
        }
        await user.save();
        await notification_Model_1.default.create({
            user: user._id,
            title: "New Order",
            message: `You have a new order from ${course.name}`,
        });
        course.purchased += 1;
        await course.save();
        (0, order_service_1.newOrder)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get All orders --- only for admin
exports.getAllOrders = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        (0, order_service_1.getAllOrdersService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//  send stripe publishble key
exports.sendStripePublishableKey = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res) => {
    res.status(200).json({
        publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});
// new payment
exports.newPayment = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "US",
            description: "SolviT course services",
            metadata: {
                company: "SolviT",
            },
            automatic_payment_methods: {
                enabled: true,
            },
            shipping: {
                name: "Harmik Lathiya",
                address: {
                    line1: "510 Townsend St",
                    postal_code: "98140",
                    city: "San Francisco",
                    state: "CA",
                    country: "US",
                },
            },
        });
        res.status(201).json({
            success: true,
            client_secret: myPayment.client_secret,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
