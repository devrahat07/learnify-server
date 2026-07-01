import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/order.model";
import User from "../models/user.model";
import CourseModel from "../models/course.model";
import mongoose from "mongoose";
import sendMail from "../utils/sendMail";
import ejs from "ejs";
import path from "node:path";
import { title } from "node:process";
import NotificationModel from "../models/notification.model";

export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;
      const user = await User.findById(req.user?._id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      const courseExist = user.courses.some(
        (course: any) => course.toString() === courseId.toString(),
      );
      if (courseExist) {
        return next(
          new ErrorHandler("You are already enrolled in this course", 400),
        );
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const data: any = {
        courseId: course?._id,
        userId: user?._id,
        payment_info,
      };
      const order = await OrderModel.create(data);
      user.courses.push(course._id as unknown as mongoose.Types.ObjectId);
      await user.save();

      const emailData = {
        order: {
          _id: course?._id.toString().slice(0, 6),
          name: course?.name,
          price: course?.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
        user: {
          name: user?.name,
          email: user?.email,
        },
      };

      const templatePath = path.resolve(
        process.cwd(),
        "src/mails/order-confirmation.ejs",
      );
      const html = await ejs.renderFile(templatePath, emailData);
      try {
        await sendMail({
          email: user?.email,
          subject: "Order Confirmation",
          template: templatePath,
          data: emailData,
        });
      } catch (error) {
        return next(new ErrorHandler("Failed to send email", 500));
      }

      user?.courses.push(course?._id);
      await user.save();

      await NotificationModel.create({
        userId: user._id.toString(),
        title: "New Order",
        message: `You have a new order from ${course.name}`,
      });

      if (course) {
        course.purchased += 1;
      }

      await course.save();

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        order,
      });
    } catch (error) {
      next(new ErrorHandler("Failed to create order", 500));
    }
  },
);
