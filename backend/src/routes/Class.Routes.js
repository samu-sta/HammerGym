import { Router } from "express";
import ClassController from "../controllers/Class.Controller.js";
import { authTrainer, authUser } from "../middleware/auth.js";

export const ClassRoutes = () => {
  const classRouter = Router();
  const classController = new ClassController();


  classRouter.get("/", classController.getAllClasses);
  classRouter.post("/", authTrainer, classController.createClass);
  classRouter.delete("/:classId", authTrainer, classController.deleteClass);
  classRouter.post("/enroll", authUser, classController.enrollInClass);
  classRouter.post("/unenroll", authUser, classController.unenrollFromClass);
  classRouter.get("/user", authUser, classController.getUserClasses);
  classRouter.get("/trainer", authTrainer, classController.getTrainerClasses);

  return classRouter;
};