import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export interface IUser extends Document {
  fullName: string;
  username: string;
  gender: "male" | "female" | "other";
  profilePic?: string;
  password: string;
  email: string;
  createHash: (password: string) => Promise<string>;
  validatePassword: (
    password: string,
    bcryptPassword: String
  ) => Promise<boolean>;
  createJWT: () => Promise<string>;
  token?: string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      // select: false,
    },
    token: {
      type: String,
      // select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.validatePassword = async function (
  candidatePassword: string,
  bcryptPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, bcryptPassword);
};

userSchema.methods.createJWT = async function (): Promise<string> {
  const secret = config.jwtSecret;
  if (!secret) {
    throw new Error("No JWT secret provided");
  }
  const options = { expiresIn: "1D" };
  const token = await jwt.sign({ id: this._id }, secret, options);
  this.token = token;
  return token;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
