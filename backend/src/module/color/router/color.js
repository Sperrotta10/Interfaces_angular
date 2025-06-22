import { Router } from "express";
import { ControllerPaletteColor } from "../controller/color.js";
import { authMiddleware } from "../../../middlewares/auth.js";
import { authorizeRole } from "../../../middlewares/authRole.js";

export const routerColor = Router();

routerColor.get("/", authMiddleware, authorizeRole('admin'), ControllerPaletteColor.getAllPalette);
routerColor.get("/:palette_id", authMiddleware, authorizeRole('admin'), ControllerPaletteColor.getIdPalette);
routerColor.post("/", authMiddleware, authorizeRole('admin'), ControllerPaletteColor.createPalette);
routerColor.patch("/palette/:palette_id", authMiddleware, authorizeRole('admin'), ControllerPaletteColor.updatePalette);
routerColor.patch("/:colors_id", authMiddleware, authorizeRole('admin'), ControllerPaletteColor.updateColors);
routerColor.delete("/:colors_id", authMiddleware, authorizeRole('admin'), ControllerPaletteColor.deletePaletteColor);