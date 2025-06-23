import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { enviroment } from "../../../config/enviroment.js" 
import { User, Role } from "../../../models/tables.js"
import dotenv from "dotenv"
dotenv.config()

export class ModelAuth {

    static async create(data) {

        try {

            const exist = await User.findOne({where : {email : data.email}});

            if(exist) return {message : "User ya existe", status : 409};

            const salt = parseInt(enviroment.SALT, 10);
            const hashPassword = await bcrypt.hash(data.password, salt);

            if(!hashPassword) return {message : "No se pudo crear el user", status : 500};

            const user = await User.create({...data, password : hashPassword, role_id : enviroment.ROLE_DEFAULT}, {
                attributes : {
                    exclude : ['password','role_id'],
                },
            });

            return {message : "User creado", data : user};


        } catch (error) {
            console.error("Error al crear usuario");
            throw error;
        }
    }

    static async login(data) {

        try {

            const user = await User.findOne({
                where : {email : data.email},
                include : {
                    model : Role,
                    as : 'role',
                    attributes: ['name']
                }
            });

            if(!user) return {message : "El email no existe", status : 401};

            if(!user.status) return {message : "El usuario no esta activo", status : 401};

            const verifyPassword = await bcrypt.compare(data.password, user.password);

            if(!verifyPassword) return {message : "Error al loguearse", status : 401};

            const token = jwt.sign(
                {user_id : user.user_id, email : user.email, role : user.role.name }, 
                enviroment.JWT_SECRET,
                {expiresIn : '1h'}
            )

            const userReturn = { user_id : user.user_id, user_name : user.user_name, email : user.email };
            
            return {message : "Login exitoso", data : userReturn, access_token : token};

        } catch (error) {
            console.error("Error al hacer el login", error.message);
            throw error;
        }
    }

    static async getAll() {

        try {
            
            const users = await User.findAll({
                where : { status : true },
                attributes: { exclude: ['password'] } 
            });

            if(!users) return {message : "Users no encontrados", status : 404};

            return {message : "Users obtenidos", data : users, status : 200};

        } catch (error) {
            console.error("Error al obtener los usuarios");
            throw error;
        }
    }

    static async update(user_id, data) {
        
        try {

            const exist = await User.findByPk(user_id);

            if(!exist) return {message : "User no encontrado", status : 404};

            await User.update(data, {where : { user_id }});

            return {message : "User modificado", status : 200};
            

        } catch (error) {
            console.error("Error al modificar user");
            throw error;
        }
    }

}