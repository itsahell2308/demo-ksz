import { Response } from "express";
import * as response from "../helpers/response.helper";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import User from "../models/user.model";

export const allUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log("🚀 ~ allUsers ~ req.user:", req.user);
    const loggedInUser = req.user?._id.toString();

    const filterUser = await User.find({ _id: { $ne: loggedInUser } });
    response.success(res, "Users fetched successfully.", filterUser);
  } catch (error: any) {
    console.log("🚀 ~ allUsers ~ error:", error.message);
    response.error(res, error);
  }
};
