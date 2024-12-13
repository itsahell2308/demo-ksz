import { Request, Response } from "express";
import * as response from "../helpers/response.helper";
import User from "../models/user.model";
import sendEmail from "../services/emailSender";
import jwtVerify from "../helpers/jwtVerify.helper";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    //check user existed
    const user = await User.findOne({ username });
    console.log("🚀 ~ login ~ user:", user);

    if (!user) {
      return response.invalid(res, "Invalid user.");
    }

    const isMatched = await user.validatePassword(password, user.password);
    console.log("🚀 ~ login ~ isMatched:", isMatched);

    if (isMatched) {
      await user.createJWT(); // create JWT token
      console.log(132456);

      return response.success(res, "Login success.", user);
    } else {
      return response.invalid(res, "Invalid user.");
    }
  } catch (error: any) {
    response.error(res, error);
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, fullName, email, gender, password, confirmPassword } =
      req.body;

    if (password !== confirmPassword) {
      return response.invalid(res, "Password and confirm password not matched");
    }

    //check user existed
    const user = await User.findOne({ username });
    if (user) {
      return response.invalid(res, "User already existed!");
    }

    //create new user
    const newUser = new User({
      username,
      fullName,
      email,
      gender,
      profilePic: `https://avatar.iran.liara.run/public/${
        gender === "male" ? "boy" : "girl"
      }?username=${username}`,
      password,
    });

    if (newUser) {
      await newUser.createJWT(); // create JWT token
      const user = await newUser.save(); // save user

      return response.success(res, "Data created success", user);
    } else {
      return response.invalid(res, "Invalid User.");
    }
  } catch (error: any) {
    response.error(res, error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    console.log("🚀 ~ logout ~ req:", req);
  } catch (error: any) {
    response.error(res, error);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    console.log("🚀 ~ forgotPassword ~ req.body:", req.body);
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return response.invalid(res, "User not found!");
    }

    //generate token
    const token = await user.createJWT();

    //update user with new token
    await user.save();

    // send email to user with reset password link
    // const checkMail = await sendEmail(
    //   email,
    //   "Reset Password",
    //   "/templates/email.template.ejs"
    // );

    return response.success(res, "Success", token);
  } catch (error) {
    response.error(res, error);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await jwtVerify(token);

    if (!user) {
      return response.invalid(res, "Invalid user.");
    }

    user.password = password;
    user.token = "";
    await user.save();

    response.success(res, "Password reset successfully.", user);
  } catch (error) {
    response.error(res, error);
  }
};
