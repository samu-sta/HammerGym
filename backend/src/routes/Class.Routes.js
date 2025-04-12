import { Router } from "express";
import ClassController from "../controllers/Class.Controller.js";
import { authUser } from "../middleware/auth.js";

export const ClassRoutes = () => {
  const classRouter = Router();
  const classController = new ClassController();

  classRouter.use(authUser);

  classRouter.get("/", classController.getAllClasses);
  classRouter.post("/enroll", classController.enrollInClass);
  classRouter.post("/unenroll", classController.unenrollFromClass);
  classRouter.get("/user", classController.getUserClasses);

  return classRouter;
};