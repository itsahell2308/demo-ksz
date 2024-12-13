import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 8020,
  jwtSecret: process.env.JWT_SECRET,
  mongoDbUrl: process.env.MONGODB_URL,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
};

export const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
