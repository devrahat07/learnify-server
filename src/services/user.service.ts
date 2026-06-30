import { Response } from "express";
import User from "../models/user.model";
import { redis } from "../utils/redis";

export const getUserById = async (id: string, res: Response) => {
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  await redis.set(id.toString(), JSON.stringify(user));

  res.status(200).json({
    success: true,
    user,
  });
};
