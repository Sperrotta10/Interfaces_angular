import { Sequelize } from "sequelize";
import { enviroment } from "./enviroment.js";
import dotenv from "dotenv"
dotenv.config()

// configuraciones
const db_name = enviroment.DB_NAME ;
const db_host = enviroment.DB_HOST;
const db_user = enviroment.DB_USER ;
const db_password = enviroment.DB_PASSWORD;

export const sequelize = new Sequelize(db_name, db_user, db_password, {
    host : db_host,
    dialect : "mysql",
    pool : {
        max : 5,
        min : 0,
        acquire : 30000,
        idle : 10000,
    }

})