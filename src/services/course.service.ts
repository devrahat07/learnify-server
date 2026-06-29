import CourseModel from "../models/course.model";
import cloudinary from "cloudinary";

export const createCourse = async (data: any) => {
  const course = await CourseModel.create(data);
  return course;
};