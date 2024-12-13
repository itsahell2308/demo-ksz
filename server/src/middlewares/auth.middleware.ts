import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as response from "../helpers/response.helper";
import User, { IUser } from "../models/user.model"; // Assuming IUser is imported
import { config } from "../config/config";
import jwtVerify from "../helpers/jwtVerify.helper";

export interface AuthenticatedRequest extends Request {
  user?: IUser & { _id: string; email: string; name: string }; // Extend IUser to match the expected structure
}

export const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return response.invalid(res, "Unauthorized - token is empty");
    }

    // Verify the token
    try {
      const user = await jwtVerify(token); // Expecting a single document or null
      if (!user) {
        return response.invalid(res, "User not found.");
      }

      // Ensure user is converted to a plain object before assigning to req.user
      req.user = user.toObject() as IUser & {
        _id: string;
        email: string;
        name: string;
      };
      next();
    } catch (error: any) {
      return response.invalid(res, "Invalid or expired token.");
    }
  } catch (error: any) {
    return response.error(res, "An unexpected error occurred.");
  }
};
