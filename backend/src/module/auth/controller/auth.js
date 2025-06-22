import { ModelAuth } from "../model/auth.js";
import { validationCreate } from "../validation/createAuth.js";
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
                maxAge : 1000 * 60 * 60 // duracion de una hora
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

            return res.status(200).json({message: "Logout exitoso"});

        } catch (error) {

            return res.status(500).json({message: "Error interno del servidor", error: error.message});
        }
    }

}