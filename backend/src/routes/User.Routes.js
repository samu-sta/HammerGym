import { Router } from "express";
import UserController from "../controllers/User.Controller.js";
import { authAdmin } from "../middleware/auth.js";

export const UserRoutes = () => {
  const router = Router();
  const userController = new UserController();

  router.use(authAdmin);

  router.get("/", userController.getAllUsers);
  router.put("/:id", userController.updateUser);
  router.delete("/:id", userController.deleteUser);

  return router;
};