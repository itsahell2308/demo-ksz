import { Application } from "express";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import userRoutes from "./routes/user.routes";
import movieRoutes from "./routes/movie.routes";

const routes = (app: Application): void => {
  app.use("/api/auth", authRoutes);
  app.use("/api/message", messageRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/movie", movieRoutes);
};

export default routes;
