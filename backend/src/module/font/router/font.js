import { Router } from "express";
import { ControllerFont } from "../controller/font.js";
import { authMiddleware } from "../../../middlewares/auth.js";
import { authorizeRole } from "../../../middlewares/authRole.js";

export const routerFont = Router();

routerFont.get("/", authMiddleware, authorizeRole('admin'), ControllerFont.getAllFont);
routerFont.get("/:font_id", authMiddleware, authorizeRole('admin'), ControllerFont.getIdFont);
routerFont.post("/", authMiddleware, authorizeRole('admin'), ControllerFont.createFont);
routerFont.patch("/:font_id", authMiddleware, authorizeRole('admin'), ControllerFont.updateFont);
routerFont.patch("/family/:fontFamily_id", authMiddleware, authorizeRole('admin'), ControllerFont.updateFontFamily);
routerFont.delete("/:fontFamily_id", authMiddleware, authorizeRole('admin'), ControllerFont.deleteFontFamily);