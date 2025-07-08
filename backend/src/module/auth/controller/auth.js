import { ModelAuth } from "../model/auth.js";
import { validationCreate } from "../validation/createAuth.js";
import { updateValidation } from "../validation/updateAuth.js";
import { validationLogin } from "../validation/login.js";
import { enviroment } from "../../../config/enviroment.js";
import dotenv from "dotenv"
dotenv.config()

export class ControllerAuth {

    static async create(req,res) {

        const result = validationCreate(req.body);

        if(!result.success) return res.status(422).json({message : "Error de validacion", error : result.error.errors});

        try {

            const user = await ModelAuth.create(result.data);

            if(user.status) return res.status(user.status).json({message : user.message});

            return res.status(201).json({message : user.message, data : user.data});
            
        } catch (error) {
            return res.status(500).json({message : "Error interno del servidor", error : error.message});
        }

    }

    static async login(req,res) {

        const result = validationLogin(req.body);

        if(!result.success) return res.status(422).json({message : "Error de validacion", error : result.error.errors});

        try {

            const login = await ModelAuth.login(result.data);

            if(login.status) return res.status(login.status).json({message : login.message});

            res.cookie('access_token', login.access_token, {
                httpOnly : true, // la cookie solo se puede acceder en el servidor
                secure : enviroment.SECURE_COOKIE === 'production', // la cookie solo se puede acceder en https
                sameSite: 'lax',
                maxAge : 1000 * 60 * 60 // duracion de una hora,
            });

            return res.status(200).json({message : login.message, data : login.data});
            
        } catch (error) {

            return res.status(500).json({message : "Error interno del servidor", error : error.message});
        }
    }

    static async logout(req, res) {

        try {

            res.clearCookie('access_token', { 
                httpOnly: true, 
                secure: enviroment.SECURE_COOKIE === 'production',
                sameSite: 'strict' 
            });

            return res.status(200).json({message: "Logout exitoso", status: 200, data: true});

        } catch (error) {

            return res.status(500).json({message: "Error interno del servidor", error: error.message});
        }
    }

    static async getAll(req, res) {

        try {

            const data = await ModelAuth.getAll();
            return res.status(data.status).json({ message: data.message, data: data.data });

        } catch (error) {
            return res.status(500).json({ message: "Error interno", error: error.message });
        }
    };

    static async getById(req, res) {
    const { id } = req.params;
    try {
        const result = await ModelAuth.getbyID(id);
        return res.status(result.status).json({ message: result.message, data: result.data ?? null });
    } catch (error) {
        return res.status(500).json({ message: "Error interno", error: error.message });
    }
}

    static async update(req, res) {

        const { id } = req.params;
        const { role } = req.user;
        
        const result = updateValidation(req.body);

        if (!result.success)
        return res.status(400).json({ message: "Error de validación", error: result.error.errors });

        try {

            if (role === 'admin') {
                
                const filtered = { status: result.data.status };
                if(filtered.status === undefined) return res.status(422).json({ message: "El campo status es obligatorio" });
                const updated = await ModelAuth.update(id, filtered);
                return res.status(updated.status).json({ message: updated.message, data: updated.data });

            } else if (role === 'user') {

                const update = await ModelAuth.update(id, result.data);
                return res.status(update.status).json({message : update.message, data: update.data ?? null});

            } else {
                return res.status(403).json({ message: "No autorizado para actualizar" });
            }

        } catch (error) {
            return res.status(500).json({ message: "Error interno", error: error.message });
        }
    };

    static async delete(req, res) {

        const { id } = req.params;

        try {

            const data = await ModelAuth.delete(id);
            return res.status(data.status).json({ message: data.message, data: data.data });

        } catch (error) {
            return res.status(500).json({ message: "Error interno", error: error.message });
        }
    };

}