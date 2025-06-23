import { routerColor } from "../../module/color/router/color.js";
import { routerFont } from "../../module/font/router/font.js";
import { routerAuth } from "../../module/auth/router/auth.js";
import { Router } from "express";

export const routerApi = Router();

routerApi.use('/color', routerColor);
routerApi.use('/font', routerFont);
routerApi.use('/auth', routerAuth);
