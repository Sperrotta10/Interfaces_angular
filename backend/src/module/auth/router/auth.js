import { Router } from "express";
import { ControllerAuth } from "../controller/auth.js";
import { authMiddleware } from "../../../middlewares/auth.js";

export const routerAuth = Router();

routerAuth.post("/register", ControllerAuth.create);
routerAuth.post("/login", ControllerAuth.login);
routerAuth.post("/logout", authMiddleware, ControllerAuth.logout);