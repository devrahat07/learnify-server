import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import NotificationModel from "../models/notification.model";

export const getNotification = CatchAsyncError(async (req: Request,res: Response,next: NextFunction) => {
    try {
        const notification = await NotificationModel.find().sort({createdAt: -1})

        res.status(200).json({
            success: true,
            notification
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message,400))
    }
})