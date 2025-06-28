import { Router } from "express";
import { ControllerAuth } from "../controller/auth.js";
import { authMiddleware } from "../../../middlewares/auth.js";
import { authorizeRole } from "../../../middlewares/authRole.js"

export const routerAuth = Router();

routerAuth.post("/register", ControllerAuth.create);
routerAuth.post("/login", ControllerAuth.login);
routerAuth.post("/logout", authMiddleware, ControllerAuth.logout);
routerAuth.get("/", authMiddleware, authorizeRole("admin"), ControllerAuth.getAll);
routerAuth.get("/:id", authMiddleware,authorizeRole("user","admin"), ControllerAuth.getById);
routerAuth.patch("/:id", authMiddleware, authorizeRole("user", "admin"), ControllerAuth.update);