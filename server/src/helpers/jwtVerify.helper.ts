import jwt from "jsonwebtoken";
import { config } from "../config/config";
import User from "../models/user.model";

const jwtVerify = async (token: string) => {
  try {
    // Decode the token
    const decoded = jwt.verify(token, config.jwtSecret as string) as {
      id: string;
    };

    // Fetch the user from the database
    const user = await User.findOne({
      _id: decoded.id,
      token,
    }).select("-password");

    // Return the user or null if not found
    return user;
  } catch (error) {
    // Return null if verification fails
    return null;
  }
};

export default jwtVerify;
