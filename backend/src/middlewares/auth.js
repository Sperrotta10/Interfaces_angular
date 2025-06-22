import jwt from 'jsonwebtoken';
import { enviroment } from '../config/enviroment.js';
import dotenv from "dotenv"
dotenv.config()

export function authMiddleware(req, res, next) {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message: 'No estás autorizado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, enviroment.JWT_SECRET);
        req.user = decoded; // ahora puedes acceder al usuario en cualquier ruta con req.user
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
}