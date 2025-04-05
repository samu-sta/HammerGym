import { Router } from "express";
import ClassController from "../controllers/Class.Controller.js";
import { authAccount } from "../middleware/auth.js";

export const ClassRoutes = () => {
  const classRouter = Router();
  const classController = new ClassController();

  classRouter.use(authAccount);

  classRouter.get("/", classController.getAllClasses);
  classRouter.post("/enroll", classController.enrollInClass);
  classRouter.post("/unenroll", classController.unenrollFromClass);

  return classRouter;
};