import nodemailer from "nodemailer";
import { config } from "./config";

const createTransporter = (): nodemailer.Transporter => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.emailUser,
      pass: config.emailPass as string,
    },
  });
};

export default createTransporter;
